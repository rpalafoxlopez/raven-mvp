# 🎸 RAVEN — RockYourself

Plataforma de coaching personalizado basada en arquetipos rockstar.

## Arquitectura

```
RAVEN/
├── apps/
│   ├── backend/     → Node.js + Express + Socket.io + MongoDB (Render)
│   └── frontend/    → Vue 3 + Vite + Pinia + Tailwind (Vercel)
```

| Capa | Tecnología | Deploy |
|------|-----------|--------|
| **Frontend** | Vue 3 + Vite + Pinia | Vercel |
| **Backend** | Node.js + Express + Socket.io | Render |
| **Database** | MongoDB Atlas | Cloud |
| **Auth** | Supabase (OAuth) | — |
| **IA** | Groq API | — |
| **Email** | Resend | — |
| **Pagos** | Stripe | — |

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- MongoDB Atlas (o local)
- Cuenta en Render y Vercel (para deploy)
- Cuenta en Supabase (para auth)
- API Key de Groq
- API Key de Resend
- Cuenta de Stripe (opcional)

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd raven-mvp
```

### 2. Backend

```bash
cd apps/backend
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm run dev
```

Servidor corriendo en `http://localhost:10000`

### 3. Frontend

```bash
cd apps/frontend
cp .env.example .env
# Editar .env: VITE_API_URL=http://localhost:10000
npm install
npm run dev
```

App corriendo en `http://localhost:5173`

## 📁 Estructura del Monorepo

```
RAVEN/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── index.js              # Entry point
│   │   │   ├── models/
│   │   │   │   ├── User.js           # Schema de usuarios
│   │   │   │   ├── QuizResult.js     # Schema de resultados
│   │   │   │   └── CoachingPlan.js   # Schema de planes
│   │   │   ├── routes/
│   │   │   │   ├── auth.js           # Auth con Supabase
│   │   │   │   ├── quiz.js           # Quiz de 32 preguntas
│   │   │   │   ├── results.js        # Resultados y arquetipos
│   │   │   │   └── coaching.js       # Coaching con IA
│   │   │   ├── socket/
│   │   │   │   └── coachingSocket.js # Real-time
│   │   │   ├── services/
│   │   │   │   ├── groq.js           # Integración Groq AI
│   │   │   │   ├── resend.js         # Email service
│   │   │   │   └── stripe.js         # Pagos
│   │   │   ├── middleware/
│   │   │   │   └── auth.js           # Auth middleware
│   │   │   └── utils/
│   │   │       └── helpers.js        # Utilidades
│   │   ├── package.json
│   │   ├── render.yaml               # Config de deploy
│   │   └── .env.example
│   │
│   └── frontend/
│       ├── src/
│       │   ├── main.js
│       │   ├── App.vue
│       │   ├── router/
│       │   │   └── index.js          # Rutas
│       │   ├── stores/
│       │   │   ├── auth.js           # Auth store (Supabase)
│       │   │   ├── quiz.js           # Quiz store
│       │   │   └── coaching.js       # Coaching store
│       │   ├── views/
│       │   │   ├── HomeView.vue      # Landing page
│       │   │   ├── QuizView.vue      # Quiz 32 preguntas
│       │   │   ├── ResultsView.vue   # Resultados arquetipo
│       │   │   ├── DashboardView.vue # Panel principal
│       │   │   └── CoachingView.vue  # Coach IA
│       │   └── components/
│       │       ├── quiz/
│       │       │   ├── QuestionCard.vue
│       │       │   └── ProgressBar.vue
│       │       ├── results/
│       │       │   ├── ArchetypeReveal.vue
│       │       │   └── PillarChart.vue
│       │       └── coaching/
│       │           ├── ChatInterface.vue
│       │           └── ActionPlan.vue
│       ├── package.json
│       ├── vite.config.js
│       ├── tailwind.config.js
│       └── .env.example
│
└── README.md
```

## 🎮 Flujo de la App

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   LANDING   │────→│   LOGIN     │────→│    QUIZ     │
│   (Home)    │     │  (OAuth)    │     │  (32 preg)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  RESULTADOS │
                                        │ (Arquetipo) │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  DASHBOARD  │
                                        │ (Progreso)  │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   COACH IA  │
                                        │  (Groq AI)  │
                                        └─────────────┘
```

## 🔌 API Endpoints

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/verify` | Verificar token Supabase |
| GET | `/api/auth/me` | Obtener usuario actual |

### Quiz
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/quiz/questions` | Obtener 32 preguntas |
| POST | `/api/quiz/submit` | Enviar respuestas |

### Results
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/results/latest` | Último resultado |
| GET | `/api/results/history` | Historial completo |

### Coaching
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/coaching/plan` | Obtener plan |
| PUT | `/api/coaching/goals` | Actualizar metas |
| POST | `/api/coaching/actions` | Agregar acción |
| PATCH | `/api/coaching/actions/:id` | Toggle acción |
| POST | `/api/coaching/chat` | Mensaje a IA |

## 🦅 Los 8 Arquetipos

| Arquetipo | Emoji | Pilar |
|-----------|-------|-------|
| El Frontman | 🎤 | Presencia |
| El Guitar Hero | 🎸 | Creatividad |
| El Survivor | 🔥 | Resiliencia |
| El Conector | 🤝 | Carisma |
| El Productor | 🎛️ | Disciplina |
| El Visionario | 👁️ | Intuición |
| El Rebelde | ⚡ | Rebeldía |
| El Dreamer | 🌟 | Visión |

## 🚀 Deploy

### Backend en Render
1. Subir repo a GitHub
2. New Web Service → conectar repo
3. Root Directory: `apps/backend`
4. Build: `npm install` | Start: `npm start`
5. Environment Variables (todas las de `.env.example`)

### Frontend en Vercel
1. New Project → importar repo
2. Root Directory: `apps/frontend`
3. Framework: `Vite`
4. Environment Variables: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## 🛠️ Stack Técnico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | 18+ | Runtime backend |
| Express | ^4.18 | Framework HTTP |
| Socket.io | ^4.7 | WebSockets |
| Mongoose | ^8.0 | ODM MongoDB |
| Vue | ^3.4 | Framework frontend |
| Vite | ^5.0 | Build tool |
| Pinia | ^2.1 | State management |
| Vue Router | ^4.2 | Routing |
| Tailwind | ^3.4 | Styling |
| Supabase | ^2.39 | Auth |
| Groq SDK | ^0.3 | AI |
| Resend | ^2.0 | Email |
| Stripe | ^14.0 | Pagos |

## 📝 Licencia

© 2026 ROCKYOURSELF.ORG

> **Raven** — *"Descubre tu arquetipo. Rockea tu vida."*