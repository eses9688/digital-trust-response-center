import { useState } from "react";
import type { BrowserScene } from "../types/types";
import type { FootprintEntry } from "../engine/types";
import Screen from "../components/Screen";
import WindowTitleBar from "../components/WindowTitleBar";
import HistoryPanel from "../components/HistoryPanel";

type Props = {
  scene: BrowserScene;
  onAdvance: (nextSceneId: string) => void;
  onClose: () => void;
  footprints: Map<string, FootprintEntry>;
};

type Tab =
  | { kind: "search"; query: string; submittedQuery: string | null }
  | { kind: "page"; pageId: string };

function tabLabel(scene: BrowserScene, tab: Tab): string {
  if (tab.kind === "page") {
    return scene.pages[tab.pageId]?.title ?? tab.pageId;
  }
  return tab.submittedQuery ?? "새 탭";
}

function BrowserSceneView({ scene, onAdvance, onClose, footprints }: Props) {
  const [tabs, setTabs] = useState<Tab[]>([
    { kind: "search", query: "", submittedQuery: null },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const activeTab = tabs[activeIndex];

  function updateActiveTab(updater: (tab: Tab) => Tab) {
    setTabs((prev) =>
      prev.map((t, i) => (i === activeIndex ? updater(t) : t))
    );
  }

  function openPage(pageId: string) {
    setTabs((prev) => [...prev, { kind: "page", pageId }]);
    setActiveIndex(tabs.length);
    onAdvance(`${scene.id}::page::${pageId}`);
  }

  function openSearchTab(query: string) {
    setTabs((prev) => [
      ...prev,
      { kind: "search", query, submittedQuery: query },
    ]);
    setActiveIndex(tabs.length);
    onAdvance(`${scene.id}::search::${query}`);
  }

  function newBlankTab() {
    setTabs((prev) => [
      ...prev,
      { kind: "search", query: "", submittedQuery: null },
    ]);
    setActiveIndex(tabs.length);
  }

  function closeTab(index: number) {
    if (tabs.length <= 1) return;
    setTabs((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((prev) => {
      if (index < prev) return prev - 1;
      if (index === prev) return Math.max(0, prev - 1);
      return prev;
    });
  }

  function runSearch(raw: string) {
    const normalized = raw.trim();
    if (!normalized) return;
    updateActiveTab((t) =>
      t.kind === "search" ? { ...t, query: normalized, submittedQuery: normalized } : t
    );
    onAdvance(`${scene.id}::search::${normalized}`);
  }

  return (
    <Screen monitor topBar={<WindowTitleBar title="브라우저" onClose={onClose} />}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center gap-1 flex-wrap flex-shrink-0">
          {tabs.map((tab, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-t-md border-b-2 cursor-pointer ${
                i === activeIndex
                  ? "border-cyan-500 text-cyan-300 bg-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <span onClick={() => setActiveIndex(i)} className="max-w-[8rem] truncate">
                {tabLabel(scene, tab)}
              </span>
              {tabs.length > 1 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(i);
                  }}
                  className="hover:text-red-400"
                >
                  ✕
                </span>
              )}
            </div>
          ))}
          <button
            onClick={newBlankTab}
            className="text-slate-500 text-xs px-2 py-1 hover:text-slate-300 cursor-pointer"
          >
            +
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="ml-auto text-slate-500 text-xs px-2 py-1 hover:text-slate-300 cursor-pointer"
          >
            🕘 기록
          </button>
        </div>

        {activeTab.kind === "search" ? (
          <div className="flex flex-col gap-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runSearch(activeTab.query);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={activeTab.query}
                onChange={(e) => {
                  const value = e.target.value;
                  updateActiveTab((t) =>
                    t.kind === "search" ? { ...t, query: value } : t
                  );
                }}
                placeholder={scene.homeHint}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-700"
              />
              <button
                type="submit"
                className="px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm hover:border-slate-500 cursor-pointer"
              >
                🔍 검색
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {scene.suggestedQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => runSearch(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-600 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {activeTab.submittedQuery &&
              (() => {
                const resultSet = scene.results[activeTab.submittedQuery];
                return (
                  <div className="flex flex-col gap-4">
                    {resultSet ? (
                      resultSet.items.map((item, i) => (
                        <div key={i} className="flex flex-col gap-0.5">
                          <p className="text-cyan-400 text-sm">{item.url}</p>
                          {item.targetPageId ? (
                            <button
                              onClick={() => openPage(item.targetPageId!)}
                              className="text-cyan-300 font-bold text-left underline underline-offset-2 cursor-pointer"
                            >
                              {item.title}
                            </button>
                          ) : (
                            <p className="text-cyan-300 font-bold">{item.title}</p>
                          )}
                          <p className="text-slate-400 text-sm">{item.snippet}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">
                        '{activeTab.submittedQuery}'에 대한 검색 결과가 없습니다.
                      </p>
                    )}
                  </div>
                );
              })()}
          </div>
        ) : (
          (() => {
            const page = scene.pages[activeTab.pageId];
            if (!page) return null;
            return (
              <div className="flex flex-col gap-4">
                <p className="text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                  🔒 {page.url}
                </p>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <p className="text-slate-100 font-bold mb-3">{page.title}</p>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {page.body.map((segment, i) =>
                      segment.type === "link" ? (
                        <button
                          key={i}
                          onClick={() =>
                            segment.targetPageId
                              ? openPage(segment.targetPageId)
                              : segment.targetQuery
                                ? openSearchTab(segment.targetQuery)
                                : undefined
                          }
                          className="text-cyan-400 underline underline-offset-2 cursor-pointer"
                        >
                          {segment.value}
                        </button>
                      ) : (
                        <span key={i}>{segment.value}</span>
                      )
                    )}
                  </p>
                </div>
              </div>
            );
          })()
        )}
      </div>
      {showHistory && (
        <HistoryPanel
          entries={Array.from(footprints.values())}
          onClose={() => setShowHistory(false)}
        />
      )}
    </Screen>
  );
}

export default BrowserSceneView;
