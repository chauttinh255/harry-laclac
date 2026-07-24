const fs = require('fs');
const https = require('https');

const wikiMap = {
  // Animals
  'cat': 'Cat', 'dog': 'Dog', 'bird': 'Bird', 'fish': 'Fish', 'horse': 'Horse',
  'elephant': 'Elephant', 'monkey': 'Monkey', 'lion': 'Lion', 'rabbit': 'Rabbit',
  'duck': 'Duck', 'frog': 'Frog', 'bear': 'Bear', 'tiger': 'Tiger', 'snake': 'Snake',
  'butterfly': 'Butterfly',
  // Colors
  'red': 'Red', 'blue': 'Blue', 'green': 'Green', 'yellow': 'Yellow', 'orange': 'Orange (colour)',
  'purple': 'Purple', 'pink': 'Pink', 'black': 'Black', 'white': 'White', 'brown': 'Brown',
  // Family
  'mother': 'Mother', 'father': 'Father', 'sister': 'Sister', 'brother': 'Brother',
  'baby': 'Infant', 'grandmother': 'Grandparent', 'grandfather': 'Grandparent',
  'friend': 'Friendship', 'teacher': 'Teacher', 'family': 'Family', 'boy': 'Boy', 'girl': 'Girl',
  // Food
  'apple': 'Apple', 'banana': 'Banana', 'bread': 'Bread', 'milk': 'Milk', 'water': 'Drinking water',
  'rice': 'Rice', 'egg': 'Egg as food', 'cake': 'Cake', 'chicken': 'Chicken as food',
  'ice cream': 'Ice cream', 'pizza': 'Pizza', 'juice': 'Juice', 'cookie': 'Cookie', 'candy': 'Candy',
  // Numbers
  'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
  'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
};

const getWikiImage = (title) => {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=400`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

const main = async () => {
  const path = './src/data/vocabularyData.ts';
  let content = fs.readFileSync(path, 'utf8');

  // Hardcode fallback images for words that might not have good wiki thumbnails
  const fallbacks = {
    'one': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Number_1_in_green_rounded_square.svg/400px-Number_1_in_green_rounded_square.svg.png',
    'two': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Number_2_in_green_rounded_square.svg/400px-Number_2_in_green_rounded_square.svg.png',
    'three': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Number_3_in_green_rounded_square.svg/400px-Number_3_in_green_rounded_square.svg.png',
    'four': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Number_4_in_green_rounded_square.svg/400px-Number_4_in_green_rounded_square.svg.png',
    'five': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Number_5_in_green_rounded_square.svg/400px-Number_5_in_green_rounded_square.svg.png',
    'six': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Number_6_in_green_rounded_square.svg/400px-Number_6_in_green_rounded_square.svg.png',
    'seven': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Number_7_in_green_rounded_square.svg/400px-Number_7_in_green_rounded_square.svg.png',
    'eight': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Number_8_in_green_rounded_square.svg/400px-Number_8_in_green_rounded_square.svg.png',
    'nine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Number_9_in_green_rounded_square.svg/400px-Number_9_in_green_rounded_square.svg.png',
    'ten': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Number_10_in_green_rounded_square.svg/400px-Number_10_in_green_rounded_square.svg.png',
    'brother': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Boys_at_play.jpg/400px-Boys_at_play.jpg',
    'sister': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Two_sisters.jpg/400px-Two_sisters.jpg',
  };

  const words = Object.keys(wikiMap);
  for (const word of words) {
    const title = wikiMap[word];
    let imageUrl = fallbacks[word];
    
    if (!imageUrl) {
      imageUrl = await getWikiImage(title);
    }
    
    if (!imageUrl) {
      imageUrl = `https://loremflickr.com/400/400/${encodeURIComponent(word)}`;
    }
    
    console.log(`Word: ${word} -> ${imageUrl}`);
    
    // Replace the specific image URL for this word in the content
    const regex = new RegExp(`(word:\\s*'${word}'[\\s\\S]*?image:\\s*')([^']+)(')`, 'g');
    content = content.replace(regex, `$1${imageUrl}$3`);
  }

  // Handle the 'orange' ambiguity in food (since color is mapped differently)
  // Food orange:
  const foodOrangeImg = await getWikiImage('Orange (fruit)');
  content = content.replace(/(word:\s*'orange'[\s\S]*?vietnameseMeaning:\s*'quả cam'[\s\S]*?image:\s*')[^']+(')/, `$1${foodOrangeImg}$2`);

  fs.writeFileSync(path, content);
  console.log('Finished updating vocabularyData.ts with Wikipedia images');
};

main();
