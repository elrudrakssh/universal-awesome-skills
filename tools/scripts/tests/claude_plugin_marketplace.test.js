const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("../../lib/project-root");

const projectRoot = findProjectRoot(__dirname);
const marketplacePath = path.join(projectRoot, ".claude-plugin", "marketplace.json");
const editorialBundlesPath = path.join(projectRoot, "data", "editorial-bundles.json");
const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
const editorialBundles = JSON.parse(fs.readFileSync(editorialBundlesPath, "utf8")).bundles || [];

assert.ok(Array.isArray(marketplace.plugins), "marketplace.json must define a plugins array");
assert.ok(marketplace.plugins.length > 0, "marketplace.json must contain at least one plugin");
assert.strictEqual(
  marketplace.plugins[0]?.name,
  "antigravity-awesome-skills",
  "full library Claude plugin should remain the first marketplace entry",
);

const expectedBundlePluginNames = editorialBundles.map((bundle) => `antigravity-bundle-${bundle.id}`);
for (const pluginName of expectedBundlePluginNames) {
  assert.ok(
    marketplace.plugins.some((plugin) => plugin.name === pluginName),
    `marketplace.json must contain bundle plugin ${pluginName}`,
  );
}

for (const plugin of marketplace.plugins) {
  assert.strictEqual(
    typeof plugin.source,
    "string",
    `plugin ${plugin.name || "<unnamed>"} must define source as a string`,
  );
  assert.ok(
    plugin.source.startsWith("./"),
    `plugin ${plugin.name || "<unnamed>"} source must be a repo-relative path starting with ./`,
  );
}

console.log("ok");
