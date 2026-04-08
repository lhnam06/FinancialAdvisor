# FAINANCE - Virtual Financial Advisor (POC)

`FAINANCE` is a mobile-first personal finance product concept built for **WebDev Adventure 2026**.  
The project targets Problem Domain #5 (Finance): making financial guidance more accessible through smart expense tracking, visual analytics, and an AI advisor experience.

This repository is the implementation aligned with the POC document:
- Core finance management screens
- Smart input experience (UI flow for voice/OCR/manual)
- AI advisor chat interface
- Reports and budgeting visuals

---

## 1) POC Scope vs Current Implementation

### POC scope in the document
- Smart transaction capture (manual + OCR + ASR)
- Budget and savings-goal management
- AI financial advisor with RAG architecture
- Market-aware suggestions (interest rate, gold price, FX)
- Mobile-first UX

### What is implemented in this repo right now
- **Frontend mobile web app (React + Vite)** with:
  - Dashboard
  - Transactions
  - Budget
  - Goals
  - Calendar
  - Smart Input page (UX flow)
  - AI Advisor page (chat UX)
  - Reports & statistics (charts)
- **Backend scaffold** with a minimal Node HTTP server and `/health` endpoint.

### Not fully implemented yet (planned from POC)
- Production AI pipeline (RAG, vector DB, layered knowledge store)
- OCR/ASR inference backend
- Financial market API ingestion pipeline
- Full authentication + persistent relational database
- Microservices and observability stack

---

## 2) Repository Structure

```text
FinancialAdvisor/
├─ frontend/   # React + Vite + Tailwind UI application
├─ backend/    # Minimal API scaffold (Node HTTP server)
└─ README.md
```

---

## 3) Tech Stack (Current Codebase)

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Recharts
- Radix UI primitives + custom UI components

### Backend (current)
- Node.js (native `http` module)
- Minimal scaffold for future API expansion

---

## 4) Run the Project

### Prerequisites
- Node.js 18+ (recommended)
- npm

### Install dependencies
From repo root:

```bash
npm --prefix frontend i
npm --prefix backend i
```

### Run frontend (dev)
```bash
npm run dev:frontend
```

### Build frontend
```bash
npm run build:frontend
```

### Run backend scaffold
```bash
npm run start:backend
```

Backend health check:
```bash
GET http://localhost:3000/health
```

---

## 5) Product Features in Current UI

- **Dashboard**: overview of balance, spending calendar, quick finance summary
- **Transactions**: add/edit/delete transactions, category and type filtering
- **Budget**: category budget tracking with progress and warnings
- **Goals**: savings goals and progress contributions
- **Reports**: category structure, trends, and cashflow charts
- **AI Advisor**: conversational advisory UX with quick prompts and history-style drawer
- **Smart Input**: entry flow for manual/voice/OCR-oriented interaction design

---

## 6) Alignment with POC Document

This implementation is the **POC UI-first stage** for the FAINANCE concept in the submission document.

- It validates the UX and feature surface for the core modules.
- It prepares the product structure for the planned AI/data architecture.
- It keeps backend intentionally lightweight while frontend modules mature.

---

## 7) Next Development Milestones

1. Integrate real backend APIs for transactions/budgets/goals
2. Add OCR + ASR processing services
3. Add RAG-based advisor services with structured knowledge sources
4. Integrate market data APIs (gold/FX/interest rates)
5. Add authentication, persistence, and deployment pipeline

---

## 8) Notes

- Project name appears as `fainance` in package metadata (legacy naming) but product concept is **FAINANCE**.
- Current backend is intentionally minimal and serves as scaffold for competition iteration.

