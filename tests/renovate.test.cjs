const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const config = JSON.parse(readFileSync(path.join(root, "renovate.json"), "utf8"));

test("the former .github Renovate config is removed", () => {
  assert.equal(existsSync(path.join(root, ".github", "renovate.json")), false);
});

test("semantic commits are enabled with the ci type for all updates", () => {
  assert.equal(config.semanticCommits, "enabled");
  assert.ok(config.extends.includes(":semanticCommitTypeAll(ci)"));
});

test("Renovate uses automatic lowercase formatting for commit and PR titles", () => {
  assert.equal(config.commitMessageLowerCase, "auto");
});

test("the PR body template and notes are empty", () => {
  assert.equal(config.prBodyTemplate, "");
  assert.deepEqual(config.prBodyNotes, []);
});

for (const depType of ["dependencies", "devDependencies"]) {
  test(`${depType} updates have an unconditional ci semantic type rule`, () => {
    const rule = config.packageRules.find(
      (candidate) =>
        candidate.semanticCommitType === "ci" &&
        candidate.matchDepTypes?.includes(depType) &&
        Object.keys(candidate).every((key) => ["matchDepTypes", "semanticCommitType"].includes(key))
    );
    assert.ok(rule, `Missing an unconditional ci rule for ${depType}`);
  });
}

test("no package rule overrides the ci semantic type", () => {
  for (const rule of config.packageRules) {
    if (Object.hasOwn(rule, "semanticCommitType")) {
      assert.equal(rule.semanticCommitType, "ci");
    }
  }
});
