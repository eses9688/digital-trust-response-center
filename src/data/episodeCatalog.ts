import type { EpisodeCatalogEntry } from "../types/types";

export const episodeCatalog: EpisodeCatalogEntry[] = [
  {
    id: "ep1",
    episodeNumber: 1,
    title: "피싱 메일",
    icon: "📧",
    difficulty: 2,
    locked: false,
  },
  {
    id: "ep2",
    episodeNumber: 2,
    title: "스미싱",
    icon: "📱",
    difficulty: 1,
    locked: true,
  },
  {
    id: "ep3",
    episodeNumber: 3,
    title: "중고거래 사기",
    icon: "🛒",
    difficulty: 3,
    locked: true,
  },
];
