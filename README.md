<<<<<<< HEAD
# CyberSafe

Educational cybersecurity-awareness website with React + TypeScript, Express REST API, and MongoDB.

## Requirements
- Node.js 20+ (LTS recommended)
- npm
- MongoDB Atlas account OR local MongoDB

## 1. Configure the backend
Open a terminal:
```bash
cd CyberSafe/backend
npm install
```
Copy `.env.example` to `.env`, then set `MONGODB_URI` to your MongoDB connection string.
```bash
cp .env.example .env
```
Windows PowerShell alternative:
```powershell
Copy-Item .env.example .env
```
Run:
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

## 2. Configure the frontend
Open a second terminal:
```bash
cd CyberSafe/frontend
npm install
```
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Windows PowerShell:
```powershell
Copy-Item .env.example .env
```
Run:
```bash
npm run dev
```
Open the URL Vite prints, normally `http://localhost:5173`.

## Pages/features
- Home, Awareness, Link Checker, Report Incident, Quiz, Security Self-Check, Admin Dashboard
- Incident create/read/update/delete via REST API + MongoDB
- Dashboard status counts and refresh
- Link checking uses local educational heuristics only; it does not fetch or scan the destination site.

## API endpoints
- `GET /api/health`
- `GET /api/incidents`
- `POST /api/incidents`
- `PATCH /api/incidents/:id/status`
- `DELETE /api/incidents/:id`

## Important security notes
This is a student/demo project, not a production incident-reporting service. The admin page is intentionally a demo page and has **no authentication** in this starter. Do not expose it publicly or use it for real sensitive incident reports until you add proper admin authentication, authorization, rate limiting, privacy controls, and deployment hardening. Do not submit real passwords, OTPs, card data, or other secrets in incident descriptions.
=======
# Project-CyberSafe
A cybersecurity awareness and incident reporting web application.
>>>>>>> origin/main
