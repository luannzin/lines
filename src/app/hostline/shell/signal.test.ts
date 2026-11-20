import { expect, test } from "bun:test";
import { parseLink, who } from "./link";
import { open, roomKey, roomTag, seal } from "./signal";

// The same secret must give the same room as the hostline CLI (src/signal.rs, matches_the_page).
test("room matches the CLI", async () => {
  expect(await roomTag("0123456789abcdefABCDEF")).toBe(
    "239d7edac96ad773488af98bf4b8e368",
  );
});

test("seals and opens", async () => {
  const key = await roomKey("0123456789abcdefABCDEF");
  const other = await roomKey("x".repeat(22));
  const sealed = await seal(key, { t: "offer", sdp: "v=0" });
  expect(await open(key, sealed)).toEqual({ t: "offer", sdp: "v=0" });
  expect(await open(other, sealed)).toBeNull();
});

test("reads links", () => {
  expect(parseLink("#0123456789abcdefABCDEF~8e833ad122a809af866f07")).toEqual({
    secret: "0123456789abcdefABCDEF",
    host: "8e833ad122a809af866f07",
  });
  expect(parseLink("#short~8e833ad122a809af866f07")).toBeNull();
  expect(parseLink("")).toBeNull();
});

test("names the visitor's browser", () => {
  expect(
    who(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    ),
  ).toBe("Safari on iPhone");
  expect(
    who(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    ),
  ).toBe("Chrome on Windows");
});
