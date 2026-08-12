export type GameState = Record<string, number | boolean>;

export type StateChange =
  | { type: "set"; key: string; value: number | boolean }
  | { type: "increment"; key: string; amount: number };

export type FootprintEntry = {
  id: string;
  label: string;
  atMinute: number;
};

export type Effects = {
  stateChanges?: StateChange[];
  evidenceGained?: string[];
  timeCost?: number;
  footprint?: { id: string; label: string };
};

export type EvidenceDef = {
  id: string;
  label: string;
};

export type EndingCondition = {
  key: string;
  op: "eq" | "gte" | "lte" | "gt" | "lt";
  value: number | boolean;
};

export type EndingDef = {
  id: string;
  title: string;
  priority: number;
  conditions: EndingCondition[];
  incidentSummary: string;
  whyFooledLabel?: string;
  whyFooled: string[];
  tips: string[];
};

export type TimeEventDef = {
  id: string;
  checkAtSceneId: string;
  minElapsed: number;
  insertSceneId: string;
};
