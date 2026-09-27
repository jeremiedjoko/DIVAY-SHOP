const fs = require('fs');
const path = require('path');

const colorMap = {
  '#c45c3e': '#c0476b',
  '#a84d34': '#9e3457',
  '#b04d32': '#9e3457',
  '#e08070': '#d4799a'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    newContent = newContent.split(oldColor).join(newColor);
  }
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    updatedCount++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Finished replacing colors in ${updatedCount} files.`);
