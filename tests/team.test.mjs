import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { teamContent } from "../lib/team.ts";

test("published team content preserves editable names, roles, order and quote", async () => {
  const initial = JSON.parse(await readFile("content/team.json", "utf8"));
  assert.deepEqual(teamContent(initial), initial);
  const updated = {
    ...initial,
    members: [...initial.members]
      .reverse()
      .map((member) => ({ ...member, role: "Funcție actualizată" })),
  };
  assert.deepEqual(teamContent(updated), updated);
  assert.equal(teamContent({ ...updated, members: [] }).members.length, 0);
});
test("invalid team documents cannot replace public content or introduce executable image URLs", async () => {
  const initial = JSON.parse(await readFile("content/team.json", "utf8"));
  assert.equal(teamContent(undefined), null);
  assert.equal(
    teamContent({
      ...initial,
      members: [{ ...initial.members[0], image: "javascript:alert(1)" }],
    }),
    null,
  );
  assert.equal(
    teamContent({
      ...initial,
      members: [initial.members[0], initial.members[0]],
    }),
    null,
  );
});
