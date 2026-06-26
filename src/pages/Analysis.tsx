import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCase } from "../data/days";
import Screen from "../components/Screen";

const formatLabel: Record<string, string> = {
  sms: "문자 메시지", kakao: "카카오톡", email: "이메일", video: "영상", sns: "SNS",
};

function Analysis() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const c = getCase(caseId ?? "");

  const [foundIds, setFoundIds] = useState<string[]>([]);

  if (!c) return <Screen><p>없는 사건입니다.</p></Screen>;

  function handleClueClick(evidenceId: string) {
    if (!foundIds.includes(evidenceId)) setFoundIds([...foundIds, evidenceId]);
  }

  function handleChoice(choiceId: string) {
    navigate(`/result/${c!.id}`, { state: { choiceId, viewedIds: foundIds } });
  }

  const keyTotal = c.evidences.filter((ev) => ev.isKey).length;
  const keyFound = c.evidences.filter((ev) => ev.isKey && foundIds.includes(ev.id)).length;
  const victim = c.victim;

  return (
    <Screen>
      <p className="text-cyan-400 text-xs tracking-[0.2em] mb-2">ANALYSIS</p>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">{c.title}</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-[1.3]">
          {/* 메시지형 */}
          {victim.segments && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500 text-xs ml-2">
                  {formatLabel[victim.format] ?? victim.format}
                </span>
              </div>
              <div className="p-5">
                <div className="bg-slate-800 rounded-2xl rounded-tl-sm p-4 text-slate-200 text-sm leading-7 whitespace-pre-line">
                  {victim.segments.map((seg, i) => {
                    if (seg.kind === "text") return <span key={i}>{seg.text}</span>;
                    const isFound = foundIds.includes(seg.evidenceId);
                    return (
                      <span
                        key={i}
                        onClick={() => handleClueClick(seg.evidenceId)}
                        className={isFound ? "bg-cyan-600/40 text-cyan-200 rounded px-1" : ""}
                      >
                        {seg.text}
                      </span>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-slate-600">수상한 부분을 클릭해 조사하세요</p>
              </div>
            </div>
          )}

          {/* 비교형 */}
          {victim.compare && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[victim.compare.left, victim.compare.right].map((src, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="bg-slate-800 px-3 py-2 border-b border-slate-700">
                      <span className="text-slate-300 text-xs">{src.label}</span>
                    </div>
                    <div className="aspect-video bg-slate-950 flex items-center justify-center p-3">
                      <span className="text-slate-600 text-xs text-center">{src.caption}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 text-xs tracking-[0.2em] mb-2">체크 포인트</p>
              <div className="space-y-2">
                {victim.compare.clues.map((clue) => {
                  const isFound = foundIds.includes(clue.evidenceId);
                  return (
                    <div
                      key={clue.evidenceId}
                      onClick={() => handleClueClick(clue.evidenceId)}
                      className={`rounded-xl border p-3 cursor-pointer transition ${
                        isFound ? "bg-cyan-950/50 border-cyan-700" : "bg-slate-800 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <p className="text-slate-200 text-sm font-bold">{clue.label} 비교</p>
                      {isFound && (
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <p className="text-emerald-400">정상: {clue.normalDesc}</p>
                          <p className="text-amber-400">의심: {clue.fakeDesc}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-600">체크 포인트를 클릭해 두 영상을 비교하세요</p>
            </div>
          )}
        </div>

        {/* 수사 노트 */}
        <div className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <p className="text-cyan-400 text-xs tracking-[0.2em] mb-3">수사 노트</p>
          <div className="space-y-2">
            {c.evidences.map((ev) => {
              if (!foundIds.includes(ev.id)) return null;
              return (
                <div key={ev.id} className="bg-cyan-950/50 border border-cyan-800 rounded-xl p-3">
                  <p className="text-cyan-300 text-sm font-bold">{ev.title}</p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{ev.content}</p>
                </div>
              );
            })}
            {foundIds.length === 0 && (
              <p className="text-slate-600 text-sm">아직 발견한 단서가 없습니다.</p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700 space-y-1">
            <p className="text-slate-400 text-sm">
              발견한 단서 <span className="text-cyan-400 font-bold">{foundIds.length}</span> / {c.evidences.length}
            </p>
            <p className="text-slate-500 text-xs">
              핵심 단서 <span className="text-amber-400 font-bold">{keyFound}</span> / {keyTotal}
              {keyFound >= keyTotal && <span className="text-emerald-400"> ✓ 충분</span>}
            </p>
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-xs tracking-[0.2em] mb-3">판단</p>
      <div className="space-y-2">
        {c.choices.map((ch) => (
          <button
            key={ch.id}
            onClick={() => handleChoice(ch.id)}
            className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 border border-slate-700
                       text-slate-200 hover:border-cyan-500 transition-all duration-200 cursor-pointer"
          >
            {ch.text}
          </button>
        ))}
      </div>
    </Screen>
  );
}

export default Analysis;