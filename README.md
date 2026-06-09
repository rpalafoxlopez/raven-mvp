# 🎸 RAVEN — RockYourself

Plataforma de coaching personalizado basada en arquetipos rockstar.

## Stack
- Frontend: Vue 3 + Vite + Pinia + Tailwind
- Backend: Express + TypeScript + MongoDB Atlas
- Auth: Supabase (Google/GitHub OAuth)
- IA: Groq API
- Email: Resend

## Setup

### 1. Clonar repo
```bash
git clone https://github.com/TU-USUARIO/raven.git
cd raven
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de entorno

**Backend** (`apps/api/.env`):
```
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
GROQ_API_KEY=...
GROQ_MODEL=mixtral-8x7b-32768
RESEND_API_KEY=...
RESEND_FROM_EMAIL=hola@rockyourself.org
FRONTEND_URL=https://...
JWT_SECRET=...
```

**Frontend** (`apps/web/.env`):
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://...
```

> ⚠️ **NUNCA subas archivos `.env` al repo.** Están en `.gitignore`.

### 4. Deploy

**Backend (Render):**
- Dashboard → New → Web Service
- Root: `apps/api`
- Build: `npm install && npm run build`
- Start: `npm start`
- Añadir variables de entorno

**Frontend (Vercel):**
- Importar repo
- Root: `apps/web`
- Framework: `Vite`
- Añadir variables de entorno

## Licencia
© 2026 ROCKYOURSELF.ORG
