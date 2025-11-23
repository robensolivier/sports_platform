# Plateforme de Tournois Sportifs

Cette plateforme est conçue pour gérer des tournois sportifs, les équipes, les joueurs et leurs interactions. Le projet se compose d’un backend Django exposant une API REST et d’un frontend Next.js pour l’interface utilisateur.

## Fonctionnalités

- **Authentification Utilisateur :** Inscription et connexion sécurisées.  
- **Gestion des Tournois :** Créer, visualiser et gérer des tournois sportifs.  
- **Gestion des Équipes :** Créer et gérer des équipes, y compris l’ajout de membres.  
- **Profils des Joueurs :** Visualiser et modifier les informations des joueurs.  
- **Demandes d’Adhésion :** Gestion des demandes des joueurs pour rejoindre des équipes.  
- **Gestion des Matchs :** Prévue dans la structure, mais non entièrement implémentée.

## Technologies Utilisées

### Backend (Django / Django REST Framework)

- **Python** : Langage de programmation  
- **Django** : Framework web  
- **Django REST Framework (DRF)** : Pour créer des API RESTful  
- **PostgreSQL / SQLite** : Base de données (configurable)  
- **Virtualenv** : Gestion de l’environnement Python

### Frontend (Next.js / React)

- **TypeScript** : Langage de programmation  
- **Next.js** : Framework React pour la production  
- **React** : Bibliothèque pour construire les interfaces utilisateur  
- **Tailwind CSS / Shadcn UI** : Pour le style et les composants UI  
- **Axios** : Pour les requêtes API  
- **npm** : Gestionnaire de paquets

Le projet est divisé en deux parties principales :

*   `backend/`: Contains the Django project and its applications (accounts, tournaments, players, matches, requests, organizers, payments).
*   `frontend/sports_platform_frontend/`: Contains the Next.js application.

```
sports_platform/
├── backend/
│   ├── accounts/
│   ├── matches/
│   ├── organizers/
│   ├── payments/
│   ├── players/
│   ├── requests/
│   ├── tournaments/
│   ├── backend/        # Django project core settings
│   ├── env/            # Python virtual environment
│   ├── manage.py
│   └── ...
├── frontend/sports_platform_frontend/
│   ├── app/            # Next.js app directory (pages, components, services)
│   ├── components/     # UI components (e.g., Shadcn UI)
│   ├── public/
│   ├── styles/
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

## Setup Instructions
## Prérequis

Avant de commencer, installez :  

- **Python 3.8+**  
- **Node.js 18+**  
- **npm** (fourni avec Node.js) ou **Yarn**  
- **Git**

## Installation

### 1. Cloner le Dépôt
```bash
git clone <repository_url>
cd sports_platform
```

### 2. Backend Setup

Navigate to the `backend` directory, create and activate a Python virtual environment, and install dependencies.

```bash
cd backend
python3 -m venv env
source env/bin/activate  # On Windows, use `.\env\Scripts\activate`
pip install -r installations.txt # Assuming a requirements.txt exists, if not, install django djangorestframework psycopg2-binary
```
#### Migrations de la Base de Données

Appliquez les migrations pour créer le schéma de la base de données :

```bash
python manage.py makemigrations
python manage.py migrate

#### Créer un Superuser (Optionel)

```bash
python manage.py createsuperuser
```

### 3. Configuration du Frontend

Navigate to the `frontend/sports_platform_frontend` directory and install dependencies.

```bash
cd ../frontend/sports_platform_frontend
npm install # or yarn install
```

## Partir L'Application

### 1. Démarrer le Serveur Backend

Assurez-vous d'être dans le répertoire `backend` et que votre environnement virtuel est activé.

```bash
cd backend
source env/bin/activate # If not already active
python manage.py runserver
```
L'API backend sera disponible à l'adresse http `http://127.0.0.1:8000/`.

### 2. Démarrer le Serveur de Développement Frontend

Assurez-vous d’être dans le répertoire `frontend/sports_platform_frontend` :

```bash
cd frontend/sports_platform_frontend
npm run dev # or npm start
```
L’application frontend sera généralement accessible à l’adresse `http://localhost:3000/`.

## Endpoints API (Résumé)

Le backend fournit des API RESTful pour gérer différentes entités :

- `/tournaments/` : Liste et création des tournois  
- `/tournaments/teams/` : Liste et création des équipes  
- `/players/` : Profils des joueurs  
- `/requests/` : Demandes pour rejoindre une équipe  
- `/accounts/` : Authentification et gestion des comptes  
- `/matches/` : Informations sur les matchs  
- `/organizers/` : Profils des organisateurs
