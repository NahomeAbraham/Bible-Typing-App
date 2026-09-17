import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host:     process.env.PG_HOST,
      port:     process.env.PG_PORT ? parseInt(process.env.PG_PORT) : undefined,
      database: process.env.PG_DATABASE,
      user:     process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    });

interface BibleBook {
  name: string;
  chapters: string[][]; // chapters[chapterIndex][verseIndex] = verse text
}

const DATA_PATH = path.join(__dirname, '../../../data/kjv.json');

async function seed() {
  // Ensure the 'kjv' translation exists
  await pool.query(
    `INSERT INTO translations (id, name, language)
     VALUES ('kjv', 'King James Version', 'en')
     ON CONFLICT (id) DO NOTHING`
  );

  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const books: BibleBook[] = JSON.parse(raw);

  for (const book of books) {
    const bookResult = await pool.query(
      `SELECT id FROM books WHERE name = $1`,
      [book.name]
    );

    if (bookResult.rows.length === 0) {
      console.warn(`Book not found in DB: ${book.name}`);
      continue;
    }

    const bookId = bookResult.rows[0].id;

    for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
      const chapterNum = chapterIndex + 1;
      const verses = book.chapters[chapterIndex];

      for (let verseIndex = 0; verseIndex < verses.length; verseIndex++) {
        const verseNum = verseIndex + 1;
        const text = verses[verseIndex];

        await pool.query(
          `INSERT INTO verses (translation_id, book_id, chapter, verse_number, text)
           VALUES ('kjv', $1, $2, $3, $4)
           ON CONFLICT (translation_id, book_id, chapter, verse_number) DO NOTHING`,
          [bookId, chapterNum, verseNum, text]
        );
      }
    }

    console.log(`Seeded: ${book.name}`);
  }

  console.log('Seeding complete!');
  await pool.end();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});