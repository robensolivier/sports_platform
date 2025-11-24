Sports Platform – Documentation

Plateforme web pour organiser, gérer et suivre des tournois sportifs (équipes, joueurs, inscriptions, paiements).

Fonctionnalités principales

Authentification Clerk (rôles, inscription, connexion)
Gestion des joueurs, équipes, organisateurs
Création et suivi de tournois et matchs
Paiement Stripe
Dashboard et filtres dynamiques
Demandes d’adhésion et gestion des membres
Structure du projet

sports_platform/
├── backend/      # Django + apps (accounts, tournaments, players, matches, requests, organizers, payments)
│   ├── manage.py
│   ├── installations.txt
│   ├── ...
├── frontend/
│   └── sports_platform_frontend/
│       ├── app/            # Next.js app/pages/components
│       ├── components/     # UI components
│       ├── public/
│       ├── style/
│       ├── package.json
│       ├── doc/
│       └── ...
├── doc/
│   └── README.md   # Documentation projet (ce fichier)
└── ...
Technologies utilisées

Backend : Django 5, Django REST Framework, PostgreSQL, Stripe, Clerk
Frontend : Next.js 16, React 19, Tailwind CSS, Clerk, Axios
Prérequis

Python 3.8+
Node.js 18+
npm ou Yarn
PostgreSQL (ou SQLite pour dev)
Git
Installation rapide

Cloner le repo :
git clone <https://github.com/robensolivier/sports_platform.git>
cd sports_platform
Backend :
cd backend
python3 -m venv env
source env/bin/activate  # Windows : .\env\Scripts\activate
pip install -r installations.txt
cp .env.example .env  # Remplir les variables
python manage.py migrate
python manage.py runserver
Frontend :
cd ../frontend/sports_platform_frontend
npm install
cp .env.local.example .env.local  # Remplir les variables
npm run dev
Variables d’environnement

Backend : .env (DB, Stripe, Clerk, ...)
Frontend : .env.local (NEXT_PUBLIC_API_URL, Clerk, Stripe)
Commandes utiles

Tests backend : pytest
Tests frontend : npm test
Linter frontend : npm run lint
Build frontend : npm run build
Endpoints API principaux

/tournaments/ : Tournois
/tournaments/teams/ : Équipes
/players/ : Joueurs
/requests/ : Demandes
/accounts/ : Authentification
/matches/ : Matchs
/organizers/ : Organisateurs
Déploiement

Backend : Heroku, Railway, etc. (config DB/variables)
Frontend : Vercel, Netlify, etc.
Liens utiles

Django REST Framework
Next.js
Clerk Auth
Stripe
