import { MODULE_1_SECTIONS } from "./playbookModule1";
import { MODULE_2_SECTIONS } from "./playbookModule2";
import { MODULE_3_SECTIONS } from "./playbookModule3";
import { MODULE_4_SECTIONS } from "./playbookModule4";
import { MODULE_5_SECTIONS } from "./playbookModule5";
import { MODULE_6_SECTIONS } from "./playbookModule6";

const SECTIONS_BY_MODULE: Record<number, { id: string; label: string }[]> = {
  1: MODULE_1_SECTIONS,
  2: MODULE_2_SECTIONS,
  3: MODULE_3_SECTIONS,
  4: MODULE_4_SECTIONS,
  5: MODULE_5_SECTIONS,
  6: MODULE_6_SECTIONS,
};

export function sectionLabel(moduleId: number, sectionId: string): string {
  const match = SECTIONS_BY_MODULE[moduleId]?.find((s) => s.id === sectionId);
  return match?.label ?? sectionId;
}
