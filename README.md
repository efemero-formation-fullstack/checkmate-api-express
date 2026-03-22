# Checkmate API - Express

API RESTful pour la gestion de tournois d'échecs (Checkmate), construite avec Node.js, Express, Sequelize (PostgreSQL) et documentée avec Swagger/OpenAPI.

## 🛠️ Stack Technique

- **Framework**: Express.js
- **Base de Données**: PostgreSQL via Sequelize ORM
- **Validation**: Zod
- **Documentation**: Swagger UI (`swagger-jsdoc` & `swagger-ui-express`)
- **Tests**: Vitest & Supertest
- **Authentification**: JWT (JSON Web Tokens) & bcrypt pour le hachage
- **Environnement**: Docker & Docker Compose

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18+ recommandé)
- **NPM**
- **Docker** et **Docker Compose** (si vous souhaitez utiliser l'environnement conteneurisé)
- **PostgreSQL** (si vous souhaitez faire tourner la base de données en local sans Docker)

---

## 🚀 Installation & Configuration

1. **Cloner le projet ou naviguer dans le dossier**

    ```bash
    cd checkmate-api-express
    ```

2. **Installer les dépendances**

    ```bash
    npm install
    ```

3. **Variables d'environnement**
   Créez un fichier `.env` à la racine du projet (vous pouvez vous baser sur un éventuel fichier `.env.example`) et configurez vos variables. Exemple de variables nécessaires :
    ```env
    APP_PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=checkmate_db
    DB_USER=postgres
    DB_PASSWORD=root
    JWT_SECRET=super_secret_key
    JWT_EXPIRES_IN=1d
    ```
    _Note: SMTP service is not needed for the API to work, but it is required for the email service to work. (if you don't want/can't use it, juste remove the `SMTP_HOST` variable from the .env file)_

---

## 🏃‍♂️ Démarrage SANS Docker (Développement en Local)

Cette méthode est recommandée si vous avez déjà un serveur PostgreSQL qui tourne sur votre machine hôte.

1. **Démarrer PostgreSQL** et assurez-vous que la base de données configurée dans votre `.env` existe.
2. **Lancer le serveur en mode développement** (avec rechargement automatique via Nodemon) :
    ```bash
    npm run dev
    ```
3. _(Optionnel)_ **Peupler la base de données** avec des fausses données de test :
    ```bash
    node scripts/dev-seed-db.js
    ```

Le serveur sera accessible sur `http://localhost:3000` (ou le port défini dans `.env`).

---

## 🐳 Démarrage AVEC Docker (Recommandé)

Cette méthode instancie l'API Node.js ainsi qu'une base de données PostgreSQL de manière isolée à l'aide de Docker Compose. Parfait pour avoir un environnement propre et iso-production !

1. **Démarrer les conteneurs** (API et Base de données) en tâche de fond :

    ```bash
    npm run dev:docker
    ```

    _Note : Nodemon est configuré avec le mode `legacyWatch` pour permettre le rechargement à chaud automatique (hot-reload) depuis votre machine hôte vers le conteneur._

2. _(Optionnel)_ **Peupler la base de données Docker** avec des données de test :

    ```bash
    npm run dev:docker:seed
    ```

3. **Arrêter l'environnement Docker** (depuis le terminal) :
    ```bash
    docker compose -f docker/docker-compose.yml -p checkmate down
    ```
    _Astuce : Ajoutez l'option `-v` à l'arrêt pour supprimer également les volumes de la base de données (remise à zéro complète)._

---

## 📚 Documentation de l'API (Swagger)

Une fois le serveur lancé (avec ou sans Docker), la documentation interactive complète de l'API est accessible via l'interface Swagger UI à l'adresse suivante :

👉 **http://localhost:3000/docs**

---

## 🧪 Tests & Utilitaires

Le projet inclut plusieurs scripts pratiques accessibles via npm :

- `npm start` : Lance le projet en mode standard (sans rechargement, idéal pour la production).
- `npm run test` : Lance les tests unitaires et d'intégration en mode "watch" interactif avec Vitest.
- `npm run test:run` : Exécute les tests une seule fois (idéal pour CI/CD).
- `npm run coverage` : Lance les tests et génère un rapport de couverture de code (coverage).
- `npm run format` : Formate l'ensemble du code du projet en utilisant Prettier.
