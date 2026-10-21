import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

test("GitHub project paths preserve queries, assets, external links and already prefixed URLs", () => {
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import { sitePath } from './lib/site-path.ts'; console.log(JSON.stringify(['/home/', '/curs/?id=one#form', '/assets/icon.png', '/cmiea-preview/home/', 'https://facebook.com/post', '//example.com/image', '#cursuri'].map(sitePath)))`,
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, NEXT_PUBLIC_BASE_PATH: "/cmiea-preview" },
      encoding: "utf8",
    },
  );
  assert.deepEqual(JSON.parse(output), [
    "/cmiea-preview/home/",
    "/cmiea-preview/curs/?id=one#form",
    "/cmiea-preview/assets/icon.png",
    "/cmiea-preview/home/",
    "https://facebook.com/post",
    "//example.com/image",
    "#cursuri",
  ]);
});
