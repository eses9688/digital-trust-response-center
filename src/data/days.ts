import type { Day, Case } from "../types/types";
import { day1 } from "./day1";
import { day2 } from "./day2";
import { day3 } from "./day3";
import { day4 } from "./day4";

export const days: Day[] = [day1, day2, day3, day4];

export function getDay(id: number): Day | undefined {
  return days.find((d) => d.id === id);
}

export function getCase(caseId: string): Case | undefined {
  for (const day of days) {
    const found = day.cases.find((c) => c.id === caseId);
    if (found) return found;
  }
  return undefined;
}