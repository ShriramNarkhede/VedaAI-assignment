# VedaAI — AI Assessment Creator

VedaAI is a high-fidelity, full-stack application designed for teachers and educators to instantly design structured academic question papers. Educators define assignment parameters (question types, difficulty ratios, total marks, and due dates) and optionally upload reference materials. VedaAI offloads paper generation to an asynchronous Gemini-powered task queue, delivering real-time status updates via WebSockets and exporting beautifully formatted, print-ready PDF exam papers.

---

## 📐 Architecture & System Flow

The application leverages a modern, decoupled architecture designed for high responsiveness, decoupling long-running LLM generation tasks from the request-response cycle.

```mermaid
graph TD
    User([Teacher Client]) -->|1. Submit Details| FE[React Frontend]
    FE -->|2. HTTP POST| BE[Express Server]
    BE -->|3. Create Job| Queue[BullMQ Task Queue]
    BE -->|4. Save Assignment| DB[(MongoDB)]
    Queue -->|5. Read Job| Worker[BullMQ Background Worker]
    Worker -->|6. Generate JSON Paper| Gemini[Google Gemini 2.5 Flash]
    Worker -->|7. Save Paper & Set Completed| DB
    Worker -->|8. Job Completed Event| Redis[(Redis)]
    BE -.->|9. Listen for Job events| Redis
    BE -->|10. Status Completed Event| FE
    FE -->|11. View & Download PDF| BE
    BE -->|12. Compile PDF (pdf-lib)| FE
```

### Components:
- **Frontend:** React, Vite, TanStack Router (for type-safe search parameters & navigation), and Tailwind CSS for the premium glassmorphism UI.
- **Backend:** Express, Node.js, TypeScript.
- **Job Orchestration:** BullMQ + Redis. Background workers process Gemini API invocations asynchronously.
- **Real-Time Communication:** Socket.io. Clients connect to room channels matching their `jobId` or `assignmentId` to receive instantaneous updates.
- **Document Generation:** `pdf-lib` programmatically draws exam sheets on the server-side, preventing client-side font and rendering discrepancies.

---

## ✨ Features & Capabilities

- **Figma-Aligned UI:** Pixel-perfect implementation of the VedaAI design system, including responsive navigation sidebars, drag-and-drop file inputs, and custom forms.
- **Asynchronous AI Generation:** Background worker pipelines prevent request timeouts and keep the HTTP layer responsive.
- **Structured JSON Prompts:** Model output is strictly enforced via JSON schema matching (`responseMimeType: "application/json"`), ensuring reliable parsing.
- **Real-time Status tracking:** Live status updates (Pending ➔ Processing ➔ Completed/Failed) with animated progress overlays.
- **PDF Export Engine:** Correctly wraps text, splits sections, displays custom difficulty badge pills, and handles printing margins out-of-the-box.
- **Instant Search/Filter:** Filter assignments instantly on the dashboard by title, topic, or instructions.
- **Clean Deletion:** Delete assignments cleanly from the database, instantly cascading to clean up associated generated papers.

---

## 📡 API Endpoints Reference

All requests and responses use JSON. 

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/assignments` | List all assignments (sorted newest first) |
| `POST` | `/api/assignments` | Create a new assignment configuration and trigger queue |
| `GET` | `/api/assignments/:id` | Get assignment metadata |
| `DELETE`| `/api/assignments/:id` | Delete assignment and its generated paper |
| `GET` | `/api/assignments/:id/status` | Get background task status (`pending`, `completed`, `failed`) |
| `GET` | `/api/assignments/:id/paper` | Fetch the structured JSON of the generated question paper |
| `GET` | `/api/assignments/:id/pdf` | Download the generated PDF question paper |

---

## 🛠️ Configuration & Setup

### Environment Variables

#### Backend (`server/.env`)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
GEMINI_API_KEY=AIzaSy... (Your Google AI Studio Key)
FRONTEND_URL=http://localhost:8080
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
```

### Local Development Setup

1. **Clone and Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   ```

2. **Spin Up Infrastructure (MongoDB & Redis)**
   Launch the pre-configured database and queue cache using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. **Start the Backend (and Worker)**
   In the `server` directory, run the development environment. In dev mode, the background worker runs in-process automatically:
   ```bash
   npm run dev
   ```

4. **Start the Frontend**
   In the root directory, start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` in your browser.

---

## 🚀 Production Deployment Guide

VedaAI is designed to be easily deployable in a production environment. Below are the steps for running in production.

### Option A: Fully Containerized Deployment (Docker Compose)
This is the recommended strategy for virtual machines (AWS EC2, DigitalOcean Droplet, GCP Compute Engine).

1. **Verify your Docker files**
   The root directory contains a `docker-compose.yml` to spin up databases. For production, create a `docker-compose.prod.yml` that mounts the backend server, worker, frontend proxy, and databases:

   ```yaml
   version: "3.9"

   services:
     mongodb:
       image: mongo:7-jammy
       container_name: veda-mongo
       restart: always
       ports:
         - "27017:27017"
       volumes:
         - mongo-data:/data/db

     redis:
       image: redis:7-alpine
       container_name: veda-redis
       restart: always
       command: redis-server --appendonly yes
       volumes:
         - redis-data:/data

     backend:
       build:
         context: ./server
         dockerfile: Dockerfile
       container_name: veda-backend
       restart: always
       ports:
         - "3001:3001"
       environment:
         - PORT=3001
         - MONGODB_URI=mongodb://mongodb:27017/vedaai
         - REDIS_HOST=redis
         - REDIS_PORT=6379
         - GEMINI_API_KEY=${GEMINI_API_KEY}
         - NODE_ENV=production
         - FRONTEND_URL=https://your-domain.com
       depends_on:
         - mongodb
         - redis

     # Background worker running in a separate process/container
     worker:
       build:
         context: ./server
         dockerfile: Dockerfile
       container_name: veda-worker
       restart: always
       command: npm run start # Make sure it starts worker if configured, or starts backend in worker mode
       environment:
         - MONGODB_URI=mongodb://mongodb:27017/vedaai
         - REDIS_HOST=redis
         - REDIS_PORT=6379
         - GEMINI_API_KEY=${GEMINI_API_KEY}
         - NODE_ENV=production
       depends_on:
         - redis
         - mongodb

   volumes:
     mongo-data:
     redis-data:
   ```

2. **Build and Run:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

---

### Option B: Cloudflare Pages (Frontend) & Cloud VM / Render (Backend)
Since the frontend uses TanStack Start with Cloudflare Pages integration:

#### 1. Frontend Setup (Cloudflare Pages)
- Connect your GitHub repository to Cloudflare Pages.
- Configure build settings:
  - **Framework Preset:** None / Vite
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist/client`
- Add Environment variables:
  - `VITE_API_URL` = `https://api.yourdomain.com`
- Set **Compatibility Flags**:
  - Add `nodejs_compat` to your Pages Project setting in the Cloudflare Dashboard.

#### 2. Backend Setup (Render or Railway)
- Deploy the `server` directory as a Web Service.
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- Add Environment variables (`GEMINI_API_KEY`, `MONGODB_URI`, `REDIS_HOST`, etc.).
- Deploy Redis and MongoDB databases inside the same Railway/Render project.

---

### 🛡️ Production Nginx Reverse Proxy Configuration

To expose your backend API securely over HTTPS, configure Nginx as a reverse proxy. This setup handles REST calls and allows WebSocket upgrades:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Handle WebSockets explicitly
    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## ⚡ Production Performance Considerations

1. **Redis Persistency:** Make sure Redis runs with AOF (`--appendonly yes`) enabled to prevent losing job data if the Redis container restarts.
2. **MongoDB Indexing:** Ensure indexation is active on critical fields for lookup (`assignmentId` in `GeneratedPaper` schema) to maintain fast fetch speeds as records scale up.
3. **Queue Scalability:** Add additional instances of the worker service (e.g. `docker-compose scale worker=3`) if high volumes of question generation are expected during peak school hours.
