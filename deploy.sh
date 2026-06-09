#!/bin/bash
set -e

echo "🎸 RAVEN DEPLOY SCRIPT"
echo "======================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar variables de entorno
echo -e "${YELLOW}1. Verificando variables de entorno...${NC}"

required_vars=(
  "MONGODB_URI"
  "SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "SUPABASE_JWT_SECRET"
  "GROQ_API_KEY"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "FRONTEND_URL"
)

missing=0
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}❌ Falta: $var${NC}"
    missing=1
  else
    echo -e "${GREEN}✅ $var${NC}"
  fi
done

if [ $missing -eq 1 ]; then
  echo -e "${RED}❌ Faltan variables. Completa el .env antes de deployar.${NC}"
  exit 1
fi

# 2. Build shared types
echo -e "${YELLOW}\n2. Building shared types...${NC}"
cd packages/shared-types
npm install
npm run build
cd ../..

# 3. Build backend
echo -e "${YELLOW}\n3. Building backend...${NC}"
cd apps/api
npm install
npm run build
cd ../..

# 4. Build frontend
echo -e "${YELLOW}\n4. Building frontend...${NC}"
cd apps/web
npm install
npm run build
cd ../..

echo -e "${GREEN}\n✅ Build completo!${NC}"
echo -e "${YELLOW}\nPróximos pasos:${NC}"
echo "1. Frontend: cd apps/web && vercel --prod"
echo "2. Backend: cd apps/api && render deploy"
echo "3. Configurar webhook de Stripe apuntando a: https://TU-API-URL/api/stripe/webhook"
