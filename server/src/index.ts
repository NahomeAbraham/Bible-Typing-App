import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const bibleFilePath = path.join(__dirname, '../../data/kjv.json');

const bibleData = JSON.parse(
  fs.readFileSync(bibleFilePath, 'utf8')
);

app.get('/api/verse/random', (_req, res) => {
  const randomBook =
    bibleData[Math.floor(Math.random() * bibleData.length)];

  const randomChapterIndex = Math.floor(
    Math.random() * randomBook.chapters.length
  );
  const randomChapter = randomBook.chapters[randomChapterIndex];

  const randomVerseIndex = Math.floor(
    Math.random() * randomChapter.length
  );
  const randomVerse = randomChapter[randomVerseIndex];

  res.json({
    book: randomBook.name,
    chapter: randomChapterIndex + 1,
    verseNum: randomVerseIndex + 1,
    text: randomVerse,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});