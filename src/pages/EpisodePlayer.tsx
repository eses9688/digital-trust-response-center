import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import episode1 from "../data/episodes/episode1";
import type { Episode } from "../types/types";
import { episodeCatalog } from "../data/episodeCatalog";
import DesktopSceneView from "../scenes/DesktopSceneView";
import InboxSceneView from "../scenes/InboxSceneView";
import ReadingSceneView from "../scenes/ReadingSceneView";
import FakeSiteSceneView from "../scenes/FakeSiteSceneView";
import DamageSceneView from "../scenes/DamageSceneView";
import FailureSceneView from "../scenes/FailureSceneView";
import DTRCSceneView from "../scenes/DTRCSceneView";
import SummarySceneView from "../scenes/SummarySceneView";
import Screen from "../components/Screen";

const episodes: Record<string, Episode> = {
  ep1: episode1,
};

const INTRO_DURATION_MS = 1500;

function EpisodePlayer() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const episode = episodeId ? episodes[episodeId] : undefined;

  const [currentSceneId, setCurrentSceneId] = useState(
    episode?.startSceneId ?? ""
  );
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!episode) {
    return (
      <Screen>
        <p className="text-slate-400">존재하지 않는 에피소드입니다.</p>
      </Screen>
    );
  }

  if (showIntro) {
    const catalogEntry = episodeCatalog.find((c) => c.id === episode.id);
    return (
      <Screen>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-3">
          {catalogEntry && (
            <p className="text-cyan-400 text-sm tracking-widest">
              Episode {String(catalogEntry.episodeNumber).padStart(2, "0")}
            </p>
          )}
          <p className="text-slate-100 font-bold text-2xl">{episode.title}</p>
          <p className="text-slate-500">시작합니다.</p>
        </div>
      </Screen>
    );
  }

  const scene = episode.scenes.find((s) => s.id === currentSceneId);

  if (!scene) {
    return (
      <Screen>
        <p className="text-slate-400">씬을 찾을 수 없습니다: {currentSceneId}</p>
      </Screen>
    );
  }

  switch (scene.kind) {
    case "desktop":
      return <DesktopSceneView scene={scene} onAdvance={setCurrentSceneId} />;
    case "inbox":
      return <InboxSceneView scene={scene} onAdvance={setCurrentSceneId} />;
    case "reading":
      return <ReadingSceneView scene={scene} onAdvance={setCurrentSceneId} />;
    case "fakesite":
      return <FakeSiteSceneView scene={scene} onAdvance={setCurrentSceneId} />;
    case "damage":
      return <DamageSceneView scene={scene} onAdvance={setCurrentSceneId} />;
    case "failure":
      return <FailureSceneView scene={scene} onRestart={setCurrentSceneId} />;
    case "dtrc":
      return <DTRCSceneView scene={scene} onAdvance={setCurrentSceneId} />;
    case "summary":
      return <SummarySceneView scene={scene} />;
  }
}

export default EpisodePlayer;
