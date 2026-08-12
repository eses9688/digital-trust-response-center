import type {
  GameState,
  StateChange,
  Effects,
  EndingDef,
  EndingCondition,
  TimeEventDef,
  FootprintEntry,
} from "./types";

export type EngineSnapshot = {
  state: GameState;
  evidence: Set<string>;
  elapsedMinutes: number;
  footprints: Map<string, FootprintEntry>;
};

function applyStateChange(state: GameState, change: StateChange): GameState {
  if (change.type === "set") {
    return { ...state, [change.key]: change.value };
  }
  const current = state[change.key];
  const base = typeof current === "number" ? current : 0;
  return { ...state, [change.key]: base + change.amount };
}

export function applyEffects(
  snapshot: EngineSnapshot,
  effects: Effects | undefined
): EngineSnapshot {
  if (!effects) return snapshot;

  let state = snapshot.state;
  for (const change of effects.stateChanges ?? []) {
    state = applyStateChange(state, change);
  }

  const evidence = new Set(snapshot.evidence);
  for (const id of effects.evidenceGained ?? []) {
    evidence.add(id);
  }

  const elapsedMinutes = snapshot.elapsedMinutes + (effects.timeCost ?? 0);

  const footprints = new Map(snapshot.footprints);
  if (effects.footprint) {
    footprints.set(effects.footprint.id, {
      id: effects.footprint.id,
      label: effects.footprint.label,
      atMinute: elapsedMinutes,
    });
  }

  return { state, evidence, elapsedMinutes, footprints };
}

function conditionMatches(state: GameState, condition: EndingCondition): boolean {
  const actual = state[condition.key];
  const expected = condition.value;

  switch (condition.op) {
    case "eq":
      return actual === expected;
    case "gte":
      return typeof actual === "number" && typeof expected === "number"
        ? actual >= expected
        : false;
    case "lte":
      return typeof actual === "number" && typeof expected === "number"
        ? actual <= expected
        : false;
    case "gt":
      return typeof actual === "number" && typeof expected === "number"
        ? actual > expected
        : false;
    case "lt":
      return typeof actual === "number" && typeof expected === "number"
        ? actual < expected
        : false;
  }
}

export function resolveEnding(
  state: GameState,
  endings: EndingDef[]
): EndingDef {
  const sorted = [...endings].sort((a, b) => a.priority - b.priority);
  for (const ending of sorted) {
    if (ending.conditions.every((c) => conditionMatches(state, c))) {
      return ending;
    }
  }
  return sorted[sorted.length - 1];
}

export function checkTimeEvent(
  sceneId: string,
  elapsedMinutes: number,
  firedIds: Set<string>,
  events: TimeEventDef[]
): TimeEventDef | null {
  for (const event of events) {
    if (event.checkAtSceneId !== sceneId) continue;
    if (firedIds.has(event.id)) continue;
    if (elapsedMinutes >= event.minElapsed) return event;
  }
  return null;
}
