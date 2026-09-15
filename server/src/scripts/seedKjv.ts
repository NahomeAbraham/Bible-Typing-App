import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/bible_data'
});

const bookFiles = fs.readdirSync(path.join(__dirname, '../../../kjv-source'))
  .filter(f => f.endsWith('.json') && f !== 'Books.json');

async function seed() {
  // Ensure the 'kjv' translation exists
  await pool.query(
    `INSERT INTO translations (id, name, language)
     VALUES ('kjv', 'King James Version', 'en')
     ON CONFLICT (id) DO NOTHING`
  );

  for (const file of bookFiles) {
    const raw = fs.readFileSync(path.join(__dirname, '../../../kjv-source', file), 'utf-8');
    const data = JSON.parse(raw);
    const bookName = data.book;

    const bookResult = await pool.query(
      `SELECT id FROM books WHERE name = $1`,
      [bookName]
    );

    if (bookResult.rows.length === 0) {
      console.warn(`Book not found in DB: ${bookName}`);
      continue;
    }

    const bookId = bookResult.rows[0].id;

    for (const chapterObj of data.chapters) {
      const chapterNum = parseInt(chapterObj.chapter, 10);

      for (const verseObj of chapterObj.verses) {
        const verseNum = parseInt(verseObj.verse, 10);
        const text = verseObj.text;

        await pool.query(
          `INSERT INTO verses (translation_id, book_id, chapter, verse_number, text)
           VALUES ('kjv', $1, $2, $3, $4)
           ON CONFLICT (translation_id, book_id, chapter, verse_number) DO NOTHING`,
          [bookId, chapterNum, verseNum, text]
        );
      }
    }

    console.log(`Seeded: ${bookName}`);
  }

  console.log('Seeding complete!');
  await pool.end();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});