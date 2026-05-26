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
