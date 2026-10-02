import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(srcDir);
console.log('Checking', allFiles.length, 'files in src/...');

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Check for Lucide icon tags <IconName ...
  const lucideMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
  const importedIcons = new Set();
  if (lucideMatch) {
    lucideMatch[1].split(',').forEach(item => {
      const trimmed = item.trim();
      if (trimmed) {
        const parts = trimmed.split(/\s+as\s+/);
        importedIcons.add(parts[parts.length - 1].trim());
      }
    });
  }

  // Find all JSX tags <TagName ...
  const tagMatches = content.matchAll(/<([A-Z][a-zA-Z0-9]+)(\s|>|\/)/g);
  for (const m of tagMatches) {
    const tagName = m[1];
    // Ignore standard known React components or internal definitions
    const isInternallyDefined = 
      content.includes(`function ${tagName}`) ||
      content.includes(`const ${tagName}`) ||
      content.includes(`let ${tagName}`) ||
      content.includes(`var ${tagName}`) ||
      content.includes(`class ${tagName}`) ||
      content.includes(`import ${tagName}`) ||
      content.includes(`import { ${tagName}`) ||
      content.includes(`import {`) && content.includes(tagName);

    if (!isInternallyDefined && !importedIcons.has(tagName)) {
      console.warn(`[WARNING] Missing identifier "${tagName}" in ${path.relative(rootDir, file)}`);
    }
  }
}
console.log('Audit complete.');
