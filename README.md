# ChessToday Backend

**ChessToday** is the backend service for an online chess platform that supports real-time multiplayer, AI play, puzzles, and user management.

**Developer:** Phuc Nguyen  
**Project Duration:** August 2025 – January 2026  
**Deployment:** Render

---

## Overview

The backend handles:

- **Authentication & verification** (cookies, JWT)
- **CRUD operations** for:
  - Games, Moves, GameMessages, Chatbox
  - Friendships & Invitations
  - Users & Puzzles
- **Database management**:
  - Table models
  - Migrations (Sequelize + Umzug)
  - Types & relations
- **Real-time features**:
  - Multiplayer gameplay
  - Matchmaking
  - Messaging
  - Notifications
- **Middleware**:
  - Token verification (HTTP & Socket)
  - Error handling
- **Local development only**:
  - Stockfish engine
  - OpenAI integration
- **Infrastructure**:
  - PostgreSQL via Docker & Docker-compose
  - Nodemailer SMTP server for emails

---

## Key Features

- Database & table management
- Real-time matchmaking & in-game logic
- Pagination (after/before cursor)
- Authentication & cookie management
- Middleware for error & token handling
- Socket.IO-based real-time feature handling

---

## Tech Stack

- **Runtime & Framework:** Node.js, Express, TypeScript  
- **Authentication & Security:** jsonwebtoken, argon2, cookie, cookie-parser  
- **Database & ORM:** PostgreSQL, Sequelize, Umzug  
- **Realtime & Communication:** Socket.IO  
- **Email / Notifications:** Nodemailer  
- **DevOps:** Docker, Docker-compose  
- **CORS & Utilities:** Cors  

---

##  Project Structure

```
src/
├── app.ts                     # Setup routes, DB connection, socket connection, middleware
├── index.ts                   # Run backend service
├── helpers/                   # Pagination helpers
├── infrastructure/            # Nodemailer SMTP setup & helpers
├── matchmaking/               # Matchmaking logic (add/remove/find player)
├── migrations/                # Sequelize migration files
├── models/                    # Database models
│   └── index.ts               # Model relations
├── routes/                    # CRUD routes for tables
├── socket/                    # Socket.IO handlers & registration
├── types/                     # TypeScript interfaces/types
└── utils/                     # Middleware, migration helpers, env setup
```

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- Docker & Docker-compose
- PostgreSQL (via Docker)

### Installation

```bash
git clone <repository-url>
cd chess-today-backend
npm install
docker-compose up -d  
npm run dev
```

## Known Issues & Incomplete Goals

### 1. AI Mode (Stockfish + Move Explanation)
This mode works only in local development. Production deployment is challenging due to process management and communication with the Stockfish engine. A Docker + AWS setup is considered for future implementation.

### 2. Real-Time Clock
The game clock can sometimes lag by 1–2 seconds between players due to unexpected user interactions or network delays. Clock synchronization needs further optimization.

### 3. Middleware in Production
Some middleware behaves inconsistently on first requests in production, normalizing only after a page reload.