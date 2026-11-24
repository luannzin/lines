import { expect, test } from "bun:test";
import { type Cookie, read, write } from "./jar";

test("reads the cookies whose path covers the page, longest path first", () => {
  const jar: Cookie[] = [
    ["a", "1", "/"],
    ["b", "2", "/shop"],
    ["c", "3", "/shopping"],
  ];
  expect(read(jar, "/shop/cart")).toBe("b=2; a=1");
  expect(read(jar, "/")).toBe("a=1");
});

test("writes, replaces and deletes like a browser", () => {
  let jar: Cookie[] = [];
  jar = write(jar, "theme=dark", "/settings/page");
  expect(jar).toEqual([["theme", "dark", "/settings"]]);
  jar = write(jar, "theme=light; Path=/settings", "/");
  expect(jar).toEqual([["theme", "light", "/settings"]]);
  jar = write(jar, "theme=; Max-Age=0; path=/settings", "/");
  expect(jar).toEqual([]);
  jar = write(jar, "old=1; expires=Thu, 01 Jan 1970 00:00:00 GMT", "/");
  expect(jar).toEqual([]);
  expect(write(jar, "secret=1; HttpOnly", "/")).toEqual([]);
});
