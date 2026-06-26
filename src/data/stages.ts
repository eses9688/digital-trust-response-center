import type { Stage } from "../types/types";
import { stage1 } from "./stage1";
import { stage2 } from "./stage2";
import { stage3 } from "./stage3";
import { stage4 } from "./stage4";

export const stages: Stage[] = [stage1, stage2, stage3, stage4];
export function getStage(id: number): Stage | undefined {
  return stages.find((s) => s.id === id);
}