const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

try {
  // Find the clang-fetcher.js file
  const findResult =
      execSync('find node_modules -name clang-fetcher.js 2>/dev/null',
               {encoding : 'utf8'});
  const files = findResult.trim().split('\n').filter(f => f);

  if (files.length === 0) {
    console.log('clang-fetcher.js not found, skipping patch');
    return;
  }

  for (const filePath of files) {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Replace the import
      content = content.replace(/import tar from 'tar';/,
                                "import { x as tarX } from 'tar/x';");

      // Replace the usage
      content = content.replace(/await tar\.x\(\{/, 'await tarX({');

      fs.writeFileSync(filePath, content);
      console.log(`Patched ${filePath}`);
    }
  }
} catch (error) {
  console.log('Error finding or patching clang-fetcher.js:', error.message);
}
