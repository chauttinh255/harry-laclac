const fs = require('fs');
const path = './src/data/vocabularyData.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('imageEmoji: string;', 'image: string;');

content = content.replace(/word:\s*'([^']+)'([\s\S]*?)imageEmoji:\s*'[^']+'/g, (match, word, middle) => {
  const query = encodeURIComponent(word.trim());
  return `word: '${word}'${middle}image: 'https://loremflickr.com/400/400/${query},cute/all'`;
});

fs.writeFileSync(path, content);
console.log('Successfully updated vocabularyData.ts');
