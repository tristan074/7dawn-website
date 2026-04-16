import { describe, test, expect } from "vitest";
import zh from "../messages/zh.json";
import en from "../messages/en.json";

function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    const v = obj[k];
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      keys.push(...collectKeys(v as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys.sort();
}

describe("i18n dictionaries", () => {
  test("zh and en have identical key sets", () => {
    const zhKeys = collectKeys(zh);
    const enKeys = collectKeys(en);
    expect(enKeys).toEqual(zhKeys);
  });

  test("no empty string values in zh", () => {
    const keys = collectKeys(zh);
    for (const key of keys) {
      const value = key.split(".").reduce<unknown>(
        (acc, k) => (acc as Record<string, unknown>)[k],
        zh,
      );
      expect(value, `zh.${key} is empty`).not.toBe("");
    }
  });

  test("no empty string values in en", () => {
    const keys = collectKeys(en);
    for (const key of keys) {
      const value = key.split(".").reduce<unknown>(
        (acc, k) => (acc as Record<string, unknown>)[k],
        en,
      );
      expect(value, `en.${key} is empty`).not.toBe("");
    }
  });
});
