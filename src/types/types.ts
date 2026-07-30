export type Channel = "email" | "sms" | "call" | "sns" | "app";

export type DesktopScene = {
  id: string;
  kind: "desktop";
  notificationText: string;
  goTo: string;
};

export type InboxEmail = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  goTo: string;
};

export type InboxScene = {
  id: string;
  kind: "inbox";
  emails: InboxEmail[];
};

export type BodySegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; goTo: string };

export type ReadingScene = {
  id: string;
  kind: "reading";
  sender: string;
  subject: string;
  date: string;
  body: BodySegment[];
  reportGoTo: string;
};

export type FakeSiteField = {
  label: string;
  placeholder: string;
  verify?: boolean;
};

export type FakeSiteScene = {
  id: string;
  kind: "fakesite";
  headline: string;
  fields: FakeSiteField[];
  submitGoTo: string;
  backGoTo: string;
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
};

export type FailureScene = {
  id: string;
  kind: "failure";
  message: string;
  hint: string;
  restartSceneId: string;
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
  goTo: string;
};

export type SummaryScene = {
  id: string;
  kind: "summary";
  incidentSummary: string;
  whyFooled: string[];
  tips: string[];
  hypotheticalDamage: string[];
};

export type Scene =
  | DesktopScene
  | InboxScene
  | ReadingScene
  | FakeSiteScene
  | DamageScene
  | FailureScene
  | DTRCScene
  | SummaryScene;

export type Episode = {
  id: string;
  title: string;
  startSceneId: string;
  scenes: Scene[];
};

export type EpisodeCatalogEntry = {
  id: string;
  episodeNumber: number;
  title: string;
  icon: string;
  difficulty: number;
  locked: boolean;
};
