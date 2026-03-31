# Vantage — Competitor Intelligence Platform

> See what your competitors see. Act before they do.

## Quick Start (Local)

```bash
# 1. Clone and setup
git clone https://github.com/rohitreddyeipimedia/vantage.git
cd vantage
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# 2. Run everything
docker-compose up

# 3. Seed demo data (in another terminal)
docker-compose exec backend python -m app.seed

# 4. Open
# Frontend: http://localhost:3000
# API docs: http://localhost:8000/docs
# Login: demo@getvantage.io / demo123
```

## Deploy

### Backend (Railway)
1. Connect your GitHub repo to Railway
2. Set root directory to `backend/`
3. Add environment variables: DATABASE_URL, SECRET_KEY, OPENAI_API_KEY
4. Deploy

### Frontend (Vercel)
1. Import the GitHub repo on Vercel
2. Set root directory to `frontend/`
3. Add env var: NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
4. Deploy

## Stack
- **Frontend:** Next.js 14 + TailwindCSS (dark mode)
- **Backend:** FastAPI + SQLAlchemy
- **Database:** PostgreSQL
- **AI:** OpenAI GPT-4o + GPT-4o Vision
- **Ad Data:** Meta Ad Library API + mock data fallback
