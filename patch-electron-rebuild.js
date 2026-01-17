const fs = require("fs");
const path = require("path");

// Possible paths for clang-fetcher.js
const possiblePaths = [
  path.join(__dirname, "node_modules", "@electron", "rebuild", "lib", "clang-fetcher.js"),
  path.join(__dirname, "node_modules", "app-builder-lib", "node_modules", "@electron", "rebuild", "lib", "clang-fetcher.js"),
];

for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");

    // Replace the import
    content = content.replace(
      /import tar from 'tar';/,
      "import * as tar from 'tar';"
    );

    fs.writeFileSync(filePath, content);
    console.log(`Patched ${filePath}`);
    break;
  }
}
