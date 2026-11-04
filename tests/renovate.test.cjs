const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const config = JSON.parse(readFileSync(path.join(root, "renovate.json"), "utf8"));

function matchFields(rule) {
  return Object.keys(rule).filter((key) => key.startsWith("match"));
}

test("Renovate configuration is consolidated in the root file", () => {
  assert.equal(existsSync(path.join(root, ".github", "renovate.json")), false);
  assert.ok(config.extends.includes("config:best-practices"));
  assert.ok(config.extends.includes(":disableRateLimiting"));
  assert.ok(config.extends.includes(":disableDependencyDashboard"));
});

test("semantic commit settings apply the ci preset and automatic lowercasing", () => {
  const bestPractices = config.extends.indexOf("config:best-practices");
  assert.ok(config.extends.indexOf(":semanticCommitTypeAll(ci)") > bestPractices);
  assert.equal(config.semanticCommits, "enabled");
  assert.equal(config.commitMessageLowerCase, "auto");
});

test("the PR body template uses the Renovate default and extra notes are empty", () => {
  assert.equal(Object.hasOwn(config, "prBodyTemplate"), false);
  assert.equal(config.prBodyNotes, "");
});

test("production and development dependencies have unrestricted ci rules", () => {
  for (const depType of ["dependencies", "devDependencies"]) {
    const rule = config.packageRules.find(
      (candidate) =>
        candidate.matchDepTypes?.includes(depType) &&
        candidate.semanticCommitType === "ci" &&
        matchFields(candidate).length === 1 &&
        matchFields(candidate)[0] === "matchDepTypes"
    );
    assert.ok(rule, `Missing unrestricted ci rule for ${depType}`);
  }

  // No local rule should override the ci preset for an overlapping update.
  for (const rule of config.packageRules) {
    if (Object.hasOwn(rule, "semanticCommitType")) {
      assert.equal(rule.semanticCommitType, "ci");
    }
  }
});

test("npm grouping remains limited to minor and patch updates", () => {
  const group = config.packageRules.find((rule) => rule.groupSlug === "npm-minor-patch");
  assert.ok(group);
  assert.deepEqual(matchFields(group).sort(), ["matchManagers", "matchUpdateTypes"]);
  assert.deepEqual(group.matchManagers, ["npm"]);
  assert.deepEqual([...group.matchUpdateTypes].sort(), ["minor", "patch"]);
  assert.equal(group.groupName, "npm minor and patch updates");

  const major = config.packageRules.find((rule) => rule.groupName === null && rule.matchUpdateTypes?.includes("major"));
  assert.ok(major);
  assert.deepEqual(matchFields(major).sort(), ["matchManagers", "matchUpdateTypes"]);
  assert.deepEqual(major.matchManagers, ["npm"]);
  assert.deepEqual(major.matchUpdateTypes, ["major"]);
});
