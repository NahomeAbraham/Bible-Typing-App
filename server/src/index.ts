import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

// ── Startup environment validation ──────────────────────────────────────────
const REQUIRED_ENV_VARS = ['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD'] as const;
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variable(s): ${missingEnvVars.join(', ')}. ` +
    'Copy server/.env.example to server/.env and fill in the values before starting the server.'
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;

app.use(cors());
app.use(express.json());

// ── PostgreSQL connection pool ──────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.PG_HOST,
  port:     parseInt(process.env.PG_PORT as string),
  database: process.env.PG_DATABASE,
  user:     process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ── Random verse from PostgreSQL ─────────────────────────────────────────────
app.get('/api/verse/random', async (_req, res) => {
  try {
    const result = await pool.query<{
      book: string;
      chapter: number;
      verseNum: number;
      text: string;
    }>(`
      SELECT
        b.name          AS book,
        v.chapter AS chapter,
        v.verse_number   AS "verseNum",
        v.text
      FROM   verses v
      JOIN   books  b ON b.id = v.book_id
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No verses found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});