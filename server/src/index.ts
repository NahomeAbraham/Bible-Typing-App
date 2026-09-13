import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Load Bible Data into memory
const bibleData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../data/kjv.json'), 'utf8')
);

// Route: Get a random verse
app.get('/api/verse/random', (req, res) => {
  const books = bibleData;
  const randomBook = books[Math.floor(Math.random() * books.length)];
  const randomChapter = randomBook.chapters[Math.floor(Math.random() * randomBook.chapters.length)];
  const randomVerse = randomChapter[Math.floor(Math.random() * randomChapter.length)];

  res.json({
    book: randomBook.name,
    chapter: randomBook.chapters.indexOf(randomChapter) + 1,
    verseNum: randomChapter.indexOf(randomVerse) + 1,
    text: randomVerse
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});