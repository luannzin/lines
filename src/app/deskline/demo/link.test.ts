import { expect, test } from "bun:test";
import { linkQuality, newCode, newKey, parseCode } from "./link";

test("a code is nine digits and reads back with or without spaces", () => {
  for (let i = 0; i < 100; i++) {
    const code = newCode();
    expect(code).toMatch(/^\d{3} \d{3} \d{3}$/);
    expect(parseCode(code)).toBe(code.replaceAll(" ", ""));
  }
  expect(parseCode("012-345-678")).toBe("012345678");
  expect(parseCode("12345678")).toBeNull();
  expect(parseCode("12345678a")).toBeNull();
  expect(parseCode(newKey())).toBeNull(); // a long code isn't typed here
});

test("a key is 52 z-base-32 characters", () => {
  expect(newKey()).toMatch(/^[ybndrfg8ejkmcpqxot1uwisza345h769]{52}$/);
});

test("link quality matches Deskline's measure", () => {
  expect(linkQuality({ route: "lan", rttMs: 0 })).toBe(1);
  expect(linkQuality({ route: "direct", rttMs: null })).toBe(0.9);
  expect(linkQuality({ route: "relay", rttMs: 60 })).toBeCloseTo(0.5);
  expect(linkQuality({ route: "relay", rttMs: 5000 })).toBe(0.15);
});
