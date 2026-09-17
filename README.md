# Bible Typing App

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack Scripture typing platform. Users practice typing Bible verses while receiving real-time
**Words Per Minute (WPM)** and **accuracy** feedback.

## Overview

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (normalized `translations` → `books` → `verses` schema)

## Architecture

```
┌─────────────────────────────┐        HTTP        ┌──────────────────────────────┐        SQL        ┌────────────────┐
│   Client (React + Vite)     │  ─────────────────► │   Server (Express + TS)      │ ─────────────────►│  PostgreSQL    │
│   TypingEngine component    │ ◄───────────────────│   /api/verse/random, /health  │ ◄──────────────────│  translations  │
│   fetches via VITE_API_URL  │                      │   pg connection pool          │                    │  books, verses │
└─────────────────────────────┘                      └──────────────────────────────┘                    └────────────────┘
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (or a connection string to a hosted instance)

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/NahomeAbraham/Bible-Typing-App.git
cd Bible-Typing-App
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Copy the example env files and fill in your local PostgreSQL credentials:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

| File | Variable | Description |
|---|---|---|
| `server/.env` | `PORT` | Port the Express server listens on (default `5001`) |
| `server/.env` | `PG_HOST` | PostgreSQL host |
| `server/.env` | `PG_PORT` | PostgreSQL port (default `5432`) |
| `server/.env` | `PG_DATABASE` | Database name |
| `server/.env` | `PG_USER` | Database user |
| `server/.env` | `PG_PASSWORD` | Database password |
| `server/.env` | `DATABASE_URL` | Optional full connection string (used by the seed script) |
| `client/.env` | `VITE_API_URL` | Base URL of the backend API (default `http://localhost:5001`) |

### 3. Create and seed the database

```bash
createdb bible_data
psql -d bible_data -f server/schema.sql
cd server && npm run seed
```

### 4. Run the app

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:5001`.

## Project Structure

```
.
├── client/           # React + TypeScript + Vite frontend
│   └── src/components/TypingEngine.tsx
├── server/           # Express + TypeScript backend
│   ├── schema.sql            # Database DDL
│   └── src/
│       ├── index.ts          # App entrypoint & API routes
│       └── scripts/seedKjv.ts
└── data/kjv.json     # Sample King James Version verse data
```

## Roadmap

This project is being actively hardened for production readiness. Planned work includes backend security
hardening (Helmet, rate limiting, input validation), JWT-based authentication and user typing history,
an automated test suite (Jest/Supertest/Vitest/RTL), Docker & CI/CD pipelines, and cloud deployment.

## License

MIT — see [LICENSE](LICENSE).
