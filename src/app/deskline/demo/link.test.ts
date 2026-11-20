import { expect, test } from "bun:test";
import { groups, linkQuality, newCode, parseCode } from "./link";

test("a code is 52 z-base-32 characters and reads back with or without spaces", () => {
  const code = newCode();
  expect(code).toHaveLength(52);
  expect(parseCode(code)).toBe(code);
  expect(parseCode(groups(code).join("  ").toUpperCase())).toBe(code);
  expect(parseCode(code.slice(1))).toBeNull();
  expect(parseCode(`${code.slice(1)}l`)).toBeNull(); // "l" isn't in the alphabet
});

test("link quality matches Deskline's measure", () => {
  expect(linkQuality({ route: "lan", rttMs: 0 })).toBe(1);
  expect(linkQuality({ route: "direct", rttMs: null })).toBe(0.9);
  expect(linkQuality({ route: "relay", rttMs: 60 })).toBeCloseTo(0.5);
  expect(linkQuality({ route: "relay", rttMs: 5000 })).toBe(0.15);
});
