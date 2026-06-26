import { useNavigate, useParams } from "react-router-dom";
import { getStage } from "../data/stages";
import Screen from "../components/Screen";
import Button from "../components/Button";

const formatLabel: Record<string, string> = {
  sms: "문자 메시지",
  kakao: "카카오톡",
  email: "이메일",
  video: "영상",
  sns: "SNS",
};

function VictimView() {
  const navigate = useNavigate();
  const { stageId } = useParams();
  const stage = getStage(Number(stageId));

  if (!stage) return <Screen><p>없는 스테이지입니다.</p></Screen>;

  return (
    <Screen>
      <p className="text-cyan-400 text-xs tracking-[0.2em] mb-2">VICTIM VIEW</p>
      <h1 className="text-2xl font-bold text-slate-100 mb-1">피해자 체험</h1>
      <p className="text-slate-400 text-sm mb-6">
        피해자가 받은 {formatLabel[stage.victim.format] ?? stage.victim.format}입니다.
      </p>

      {/* 메시지 화면 모킹 */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden mb-8">
        {/* 상단 바 */}
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-500 text-xs ml-2">
            {formatLabel[stage.victim.format] ?? stage.victim.format}
          </span>
        </div>
        {/* 메시지 본문 */}
        <div className="p-5">
          <div className="bg-slate-800 rounded-2xl rounded-tl-sm p-4 text-slate-200 text-sm leading-relaxed whitespace-pre-line max-w-[90%]">
            {stage.victim.content}
          </div>
        </div>
      </div>

      <Button onClick={() => navigate(`/analysis/${stage.id}`)}>분석 시작 →</Button>
    </Screen>
  );
}

export default VictimView;