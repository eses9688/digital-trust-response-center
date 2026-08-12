import type {
  GameState,
  Effects,
  EvidenceDef,
  EndingDef,
  TimeEventDef,
  FootprintEntry,
} from "../engine/types";

export type Channel = "email" | "sms" | "call" | "sns" | "app";

export type DesktopApp = {
  icon: string;
  label: string;
  goTo: string;
};

export type DesktopScene = {
  id: string;
  kind: "desktop";
  notificationText: string;
  notificationGoTo: string;
  apps: DesktopApp[];
};

export type SearchResultItem = {
  title: string;
  url: string;
  snippet: string;
  targetPageId?: string;
};

export type SearchResultSet = {
  items: SearchResultItem[];
  effects?: Effects;
};

export type PageSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; targetPageId?: string; targetQuery?: string };

export type WebPage = {
  id: string;
  url: string;
  title: string;
  body: PageSegment[];
  effects?: Effects;
};

export type BrowserScene = {
  id: string;
  kind: "browser";
  homeHint: string;
  suggestedQueries: string[];
  results: Record<string, SearchResultSet>;
  pages: Record<string, WebPage>;
};

export type InboxEmail = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  goTo: string;
  effects?: Effects;
};

export type InboxScene = {
  id: string;
  kind: "inbox";
  emails: InboxEmail[];
};

export type BodySegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; goTo: string; effects?: Effects };

export type ReadingScene = {
  id: string;
  kind: "reading";
  sender: string;
  subject: string;
  date: string;
  body: BodySegment[];
  reportGoTo: string;
  backTo?: string;
};

export type FakeSiteField = {
  label: string;
  placeholder: string;
  verify?: boolean;
};

export type FakeSiteScene = {
  id: string;
  kind: "fakesite";
  domain: string;
  headline: string;
  fields: FakeSiteField[];
  submitGoTo: string;
  submitEffects?: Effects;
  backGoTo: string;
  backEffects?: Effects;
};

export type DamageEvent = {
  channel: Channel;
  sender: string;
  text: string;
};

export type DamageScene = {
  id: string;
  kind: "damage";
  events: DamageEvent[];
  goTo: string;
  goToEffects?: Effects;
};

export type IncidentType = {
  label: string;
  description: string;
};

export type DTRCScene = {
  id: string;
  kind: "dtrc";
  intro: string;
  incidentTypes: IncidentType[];
  damageTypes?: string[];
  goTo: string;
  reportEffects?: Effects;
};

export type SummaryScene = {
  id: string;
  kind: "summary";
  incidentSummary: string;
  whyFooledLabel?: string;
  whyFooled: string[];
  tips: string[];
  hypotheticalDamage?: string[];
  footprintTrail?: FootprintEntry[];
};

export type ChoiceOption = {
  id: string;
  text: string;
  goTo: string;
  effects?: Effects;
};

export type ChoiceScene = {
  id: string;
  kind: "choice";
  channel: Channel;
  sender: string;
  body: BodySegment[];
  options: ChoiceOption[];
};

export type InstallScene = {
  id: string;
  kind: "install";
  appName: string;
  goTo: string;
};

export type QuizOption = {
  id: string;
  text: string;
  correct: boolean;
  goTo: string;
  effects?: Effects;
};

export type QuizScene = {
  id: string;
  kind: "quiz";
  question: string;
  options: QuizOption[];
  wrongFeedback: string;
};

export type ResponseAction = {
  id: string;
  label: string;
};

export type ResponseScene = {
  id: string;
  kind: "response";
  actions: ResponseAction[];
  goTo: string;
};

export type EndingScene = {
  id: string;
  kind: "ending";
};

export type Scene =
  | DesktopScene
  | InboxScene
  | ReadingScene
  | FakeSiteScene
  | DamageScene
  | DTRCScene
  | SummaryScene
  | ChoiceScene
  | QuizScene
  | ResponseScene
  | InstallScene
  | EndingScene
  | BrowserScene;

export type Episode = {
  id: string;
  title: string;
  startSceneId: string;
  scenes: Scene[];
  initialState?: GameState;
  evidence?: EvidenceDef[];
  endings?: EndingDef[];
  timeEvents?: TimeEventDef[];
  hubSceneId?: string;
};

export type EpisodeCatalogEntry = {
  id: string;
  episodeNumber: number;
  title: string;
  icon: string;
  difficulty: number;
  locked: boolean;
};
