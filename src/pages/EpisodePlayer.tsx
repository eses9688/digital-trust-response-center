import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import episode1 from "../data/episodes/episode1";
import episode2 from "../data/episodes/episode2";
import episode3 from "../data/episodes/episode3";
import type { Episode, Scene, SummaryScene as SummarySceneType } from "../types/types";
import type { Effects, FootprintEntry } from "../engine/types";
import { applyEffects, checkTimeEvent, computeRank, resolveEnding } from "../engine/gameEngine";
import { episodeCatalog } from "../data/episodeCatalog";
import { saveCollectedCard } from "../storage/storage";
import DesktopSceneView from "../scenes/DesktopSceneView";
import InboxSceneView from "../scenes/InboxSceneView";
import ReadingSceneView from "../scenes/ReadingSceneView";
import FakeSiteSceneView from "../scenes/FakeSiteSceneView";
import DamageSceneView from "../scenes/DamageSceneView";
import DTRCSceneView from "../scenes/DTRCSceneView";
import SummarySceneView from "../scenes/SummarySceneView";
import ChoiceSceneView from "../scenes/ChoiceSceneView";
import QuizSceneView from "../scenes/QuizSceneView";
import ResponseSceneView from "../scenes/ResponseSceneView";
import InstallSceneView from "../scenes/InstallSceneView";
import BrowserSceneView from "../scenes/BrowserSceneView";
import Screen from "../components/Screen";
import EvidencePanel from "../components/EvidencePanel";

const episodes: Record<string, Episode> = {
  ep1: episode1,
  ep2: episode2,
  ep3: episode3,
};

const INTRO_DURATION_MS = 1500;

type PlayerState = {
  currentSceneId: string;
  gameState: Record<string, number | boolean>;
  evidence: Set<string>;
  elapsedMinutes: number;
  firedTimeEvents: Set<string>;
  footprints: Map<string, FootprintEntry>;
};

type Action = { type: "advance"; nextSceneId: string; effects?: Effects };

function findEffects(scene: Scene, nextSceneId: string): Effects | undefined {
  switch (scene.kind) {
    case "inbox": {
      const email = scene.emails.find((e) => e.goTo === nextSceneId);
      return email?.effects;
    }
    case "choice": {
      const option = scene.options.find((o) => o.goTo === nextSceneId);
      if (option?.effects) return option.effects;
      const link = scene.body.find(
        (seg) => seg.type === "link" && seg.goTo === nextSceneId
      );
      return link && link.type === "link" ? link.effects : undefined;
    }
    case "reading": {
      const link = scene.body.find(
        (seg) => seg.type === "link" && seg.goTo === nextSceneId
      );
      return link && link.type === "link" ? link.effects : undefined;
    }
    case "fakesite":
      if (nextSceneId === scene.submitGoTo) return scene.submitEffects;
      if (nextSceneId === scene.backGoTo) return scene.backEffects;
      return undefined;
    case "quiz": {
      const option = scene.options.find((o) => o.goTo === nextSceneId);
      return option?.effects;
    }
    case "dtrc":
      return nextSceneId === scene.goTo ? scene.reportEffects : undefined;
    case "damage":
      return nextSceneId === scene.goTo ? scene.goToEffects : undefined;
    case "install":
      return nextSceneId === scene.goTo ? scene.effects : undefined;
    case "browser": {
      const prefix = `${scene.id}::`;
      if (!nextSceneId.startsWith(prefix)) return undefined;
      const rest = nextSceneId.slice(prefix.length);
      const separatorIndex = rest.indexOf("::");
      if (separatorIndex === -1) return undefined;
      const kind = rest.slice(0, separatorIndex);
      const key = rest.slice(separatorIndex + 2);
      if (kind === "search") return scene.results[key]?.effects;
      if (kind === "page") return scene.pages[key]?.effects;
      return undefined;
    }
    default:
      return undefined;
  }
}

function targetSceneIdOf(nextSceneId: string): string {
  const separatorIndex = nextSceneId.indexOf("::");
  return separatorIndex === -1 ? nextSceneId : nextSceneId.slice(0, separatorIndex);
}

function makeInitialState(episode: Episode): PlayerState {
  return {
    currentSceneId: episode.startSceneId,
    gameState: episode.initialState ?? {},
    evidence: new Set(),
    elapsedMinutes: 0,
    firedTimeEvents: new Set(),
    footprints: new Map(),
  };
}

function EpisodePlayer() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const episode = episodeId ? episodes[episodeId] : undefined;

  const [playerState, dispatch] = useReducer(
    (state: PlayerState, action: Action): PlayerState => {
      if (!episode) return state;
      const snapshot = applyEffects(
        {
          state: state.gameState,
          evidence: state.evidence,
          elapsedMinutes: state.elapsedMinutes,
          footprints: state.footprints,
        },
        action.effects
      );
      const resolvedNextSceneId = targetSceneIdOf(action.nextSceneId);
      const timeEvent = checkTimeEvent(
        resolvedNextSceneId,
        snapshot.elapsedMinutes,
        state.firedTimeEvents,
        episode.timeEvents ?? []
      );
      const firedTimeEvents = timeEvent
        ? new Set(state.firedTimeEvents).add(timeEvent.id)
        : state.firedTimeEvents;
      const targetSceneId = timeEvent ? timeEvent.insertSceneId : resolvedNextSceneId;

      return {
        currentSceneId: targetSceneId,
        gameState: snapshot.state,
        evidence: snapshot.evidence,
        elapsedMinutes: snapshot.elapsedMinutes,
        firedTimeEvents,
        footprints: snapshot.footprints,
      };
    },
    episode,
    (ep) => (ep ? makeInitialState(ep) : makeInitialState({ id: "", title: "", startSceneId: "", scenes: [] }))
  );

  const [showIntro, setShowIntro] = useState(true);
  const [showEvidencePanel, setShowEvidencePanel] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);

  const currentScene = episode?.scenes.find((s) => s.id === playerState.currentSceneId);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (episode && currentScene?.kind === "ending") {
      saveCollectedCard(episode.id);
    }
  }, [episode, currentScene]);

  if (!episode) {
    return (
      <Screen>
        <p className="text-slate-400">존재하지 않는 에피소드입니다.</p>
      </Screen>
    );
  }

  function handleAdvance(nextSceneId: string) {
    const scene = episode!.scenes.find((s) => s.id === playerState.currentSceneId);
    const effects = scene ? findEffects(scene, nextSceneId) : undefined;
    dispatch({ type: "advance", nextSceneId, effects });
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

  const scene = currentScene;

  if (!scene) {
    return (
      <Screen>
        <p className="text-slate-400">
          씬을 찾을 수 없습니다: {playerState.currentSceneId}
        </p>
      </Screen>
    );
  }

  const hud =
    episode.evidence && episode.evidence.length > 0 ? (
      <button
        onClick={() => setShowEvidencePanel(true)}
        className="fixed top-3 right-3 z-50 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 cursor-pointer hover:border-slate-600"
      >
        ⏱ {playerState.elapsedMinutes}분 · 🔍 증거 {playerState.evidence.size}/
        {episode.evidence.length}
      </button>
    ) : null;

  function closeToHub() {
    if (episode!.hubSceneId) {
      dispatch({ type: "advance", nextSceneId: episode!.hubSceneId });
    }
  }

  let sceneElement;

  switch (scene.kind) {
    case "desktop":
      sceneElement = (
        <DesktopSceneView
          scene={scene}
          onAdvance={handleAdvance}
          notificationVisible={!notificationShown}
          onNotificationShown={() => setNotificationShown(true)}
        />
      );
      break;
    case "inbox":
      sceneElement = (
        <InboxSceneView scene={scene} onAdvance={handleAdvance} onClose={closeToHub} />
      );
      break;
    case "reading":
      sceneElement = (
        <ReadingSceneView
          scene={scene}
          onAdvance={handleAdvance}
          onBack={scene.backTo ? () => handleAdvance(scene.backTo!) : undefined}
          onClose={closeToHub}
        />
      );
      break;
    case "fakesite":
      sceneElement = <FakeSiteSceneView scene={scene} onAdvance={handleAdvance} />;
      break;
    case "damage":
      sceneElement = <DamageSceneView scene={scene} onAdvance={handleAdvance} />;
      break;
    case "dtrc":
      sceneElement = <DTRCSceneView scene={scene} onAdvance={handleAdvance} />;
      break;
    case "summary":
      sceneElement = <SummarySceneView scene={scene} />;
      break;
    case "choice":
      sceneElement = <ChoiceSceneView scene={scene} onAdvance={handleAdvance} />;
      break;
    case "quiz":
      sceneElement = <QuizSceneView scene={scene} onAdvance={handleAdvance} />;
      break;
    case "response":
      sceneElement = <ResponseSceneView scene={scene} onAdvance={handleAdvance} />;
      break;
    case "install":
      sceneElement = <InstallSceneView scene={scene} onAdvance={handleAdvance} />;
      break;
    case "browser":
      sceneElement = (
        <BrowserSceneView
          scene={scene}
          onAdvance={handleAdvance}
          onClose={closeToHub}
          footprints={playerState.footprints}
        />
      );
      break;
    case "ending": {
      const ending = resolveEnding(playerState.gameState, episode.endings ?? []);
      const summaryScene: SummarySceneType = {
        id: scene.id,
        kind: "summary",
        incidentSummary: ending.incidentSummary,
        whyFooledLabel: ending.whyFooledLabel,
        whyFooled: ending.whyFooled,
        tips: ending.tips,
        hypotheticalDamage: ending.hypotheticalDamage,
      };
      const evidenceTotal = episode.evidence?.length ?? 0;
      const evidenceFound = playerState.evidence.size;
      const rank = computeRank({
        evidenceFound,
        evidenceTotal,
        reported: playerState.gameState.reported === true,
        damaged: playerState.gameState.damaged === true,
      });
      sceneElement = (
        <SummarySceneView
          scene={summaryScene}
          rank={rank}
          evidenceFound={evidenceTotal > 0 ? evidenceFound : undefined}
          evidenceTotal={evidenceTotal > 0 ? evidenceTotal : undefined}
        />
      );
      break;
    }
  }

  return (
    <>
      {hud}
      {sceneElement}
      {showEvidencePanel && episode.evidence && (
        <EvidencePanel
          evidenceDefs={episode.evidence}
          found={playerState.evidence}
          onClose={() => setShowEvidencePanel(false)}
        />
      )}
    </>
  );
}

export default EpisodePlayer;
