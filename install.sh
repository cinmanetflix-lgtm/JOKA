#!/bin/bash

echo "🚀 Installation de JOKA Platform..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Installer les dépendances root
echo -e "${BLUE}📦 Installation des dépendances racine...${NC}"
npm install

# Backend
echo ""
echo -e "${BLUE}📦 Installation du backend...${NC}"
cd backend
npm install
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️  Création du fichier .env backend...${NC}"
    cp .env.example .env
fi
cd ..

# Frontend Web
echo ""
echo -e "${BLUE}📦 Installation du frontend web...${NC}"
cd frontend-web
npm install
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️  Création du fichier .env frontend...${NC}"
    cp .env.example .env
fi
cd ..

# Mobile
echo ""
echo -e "${BLUE}📱 Configuration Flutter...${NC}"
if command -v flutter &> /dev/null; then
    cd mobile
    flutter pub get
    cd ..
    echo -e "${GREEN}✓ Flutter configuré${NC}"
else
    echo -e "${YELLOW}⚠️  Flutter n'est pas installé. Ignoré.${NC}"
fi

echo ""
echo -e "${GREEN}✅ Installation terminée !${NC}"
echo ""
echo -e "${BLUE}🎯 Prochaines étapes :${NC}"
echo "1. Configurez vos clés API dans backend/.env et frontend-web/.env"
echo "2. Lancez les services avec : docker-compose up -d"
echo "   OU lancez manuellement :"
echo "   - Backend : cd backend && npm run start:dev"
echo "   - Frontend : cd frontend-web && npm run dev"
echo ""
echo -e "${GREEN}📚 Documentation : README.md et GETTING_STARTED.md${NC}"
