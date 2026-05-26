# VedaAI Assessment Creator Backend

This is the Node.js backend for the AI-powered Assessment Creator. It uses **Express, BullMQ, Redis, MongoDB, Socket.io**, and **Gemini 2.0 Flash**.

## Setup & Running Locally

### 1. Configure Environment
A `.env` file has already been generated from `.env.example`. 
**You must open `server/.env` and paste your actual `GEMINI_API_KEY` before proceeding.**

### 2. Start Infrastructure (Docker)
From the **project root** directory (where `docker-compose.yml` is located), start MongoDB and Redis:
```bash
docker compose up -d
```
*Note: This creates local persistent volumes in `../docker-data/` which are gitignored.*

### 3. Start the Backend Server
Open a new terminal, navigate to the `server/` directory, and start the development server:
```bash
cd server
npm run dev
```

### 4. (Optional) Run Worker Separately
In development mode (`npm run dev`), the BullMQ worker runs in the same process as the HTTP server. 
For production or standalone testing, you can run the worker independently:
```bash
npm run worker
```

## How It Works
1. **Frontend** submits a question paper generation request to `POST /api/assignments`.
2. **Server** saves a "queued" assignment to MongoDB and pushes a job to BullMQ (Redis).
3. **Worker** picks up the job, updates status to "processing", calls Gemini 2.0, parses the JSON, and saves the output to the `GeneratedPaper` collection.
4. **Socket.io** streams real-time updates (`queued` -> `processing` -> `generating` -> `completed`/`failed`) to the frontend.
5. **Frontend** uses the `pdf-lib` generated PDF endpoint (`GET /api/assignments/:id/pdf`) to download the final paper.
