🎉 Gestionnaire d'Événements Web
Une application web complète pour la planification et l'organisation d'événements de tous types avec une interface moderne et intuitive.
✨ Fonctionnalités principales

📝 Gestion des comptes : inscription, connexion et profils utilisateurs
🎪 Création d'événements : planification personnalisée et flexible
🛍️ Catalogue de services : salles, décoration, restauration, animation
💰 Gestion budgétaire : estimation des coûts et suivi financier
📊 Suivi en temps réel : progression de l'organisation étape par étape
📅 Planification avancée : calendrier et gestion des dates
⭐ Système d'évaluation : avis et commentaires sur les services
📬 Gestion des demandes : communication entre tous les acteurs
📈 Tableaux de bord : statistiques et analytics détaillées
🔧 Administration : supervision et configuration système

🎭 Types d'événements supportés

💒 Mariages : organisation complète de A à Z
🎂 Anniversaires : fêtes personnalisées
🏢 Conférences : événements professionnels
🎊 Célébrations : fêtes diverses et occasions spéciales
🎭 Événements culturels : spectacles, expositions, concerts

🛠️ Technologies utilisées

Frontend : React.js + CSS moderne
Backend : Django (Python)
Base de données : SQLite
Authentification : Django Auth System
API : Django REST Framework
Design : Interface responsive et moderne

📦 Installation
Pré-requis

Python 3.8+
Node.js 14+
npm ou yarn

Backend (Django)

Cloner le repository
bashgit clone https://github.com/votre-username/event-management-app.git
cd event-management-app

Environnement virtuel Python
bashpython -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

Installer les dépendances Django
bashcd backend
pip install -r requirements.txt

Configuration de la base de données
bashpython manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser


Frontend (React)

Installer les dépendances Node.js
bashcd frontend
npm install
# ou
yarn install


🚀 Lancement de l'application
Démarrer le backend
bashcd backend
python manage.py runserver
Le serveur Django sera accessible sur http://localhost:8000
Démarrer le frontend
bashcd frontend
npm start
# ou
yarn start
L'application React sera accessible sur http://localhost:3000
