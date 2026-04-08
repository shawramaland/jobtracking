# Job Tracker

A job application tracker that actually makes the grind bearable. Track your applications, prep for interviews, and play some games while you wait to hear back.

Built while job hunting myself — needed something to track applications without losing my mind, and spreadsheets weren't cutting it.

## What it does

- Track job applications with statuses, notes, and dates
- Interview prep tab with flashcard-style Q&A and cheat sheets
- Retro boot screen on startup (randomly picks between BIOS, Windows 95, or Commodore 64 style)
- Arcade games to play while waiting to hear back: Snake, Pong, Tetris, Speed Typing, and one that is "very special"

## Run it with Docker

No Node.js required. Just Docker.

```bash
docker build -t job-tracker .
docker run -p 3000:80 job-tracker
```

Then open http://localhost:3000

## Run it locally (dev mode)

```bash
npm install
npm start
```

## Stack

- React
- Web Audio API (boot sounds)
- Canvas 2D (games)
- nginx + Docker (deployment)
