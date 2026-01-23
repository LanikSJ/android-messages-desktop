const fs = require("fs");
const path = require("path");

const possiblePaths = [
  path.join(
    __dirname,
    "..",
    "node_modules",
    "@electron",
    "rebuild",
    "lib",
    "clang-fetcher.js"
  ),
  path.join(
    __dirname,
    "..",
    "node_modules",
    "@electron",
    "rebuild",
    "lib",
    "src",
    "clang-fetcher.js"
  ),
  path.join(
    __dirname,
    "..",
    "node_modules",
    "@electron",
    "rebuild",
    "src",
    "clang-fetcher.js"
  ),
];

for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    if (content.includes("import tar from 'tar';")) {
      content = content.replace(
        "import tar from 'tar';",
        "import { createRequire } from 'node:module';\nconst require = createRequire(import.meta.url);\nconst tar = require('tar');"
      );
      fs.writeFileSync(filePath, content);
      console.log(`Patched ${filePath}`);
    }
    break;
  }
}
