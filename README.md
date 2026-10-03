# Moji Firebase

React/Vite front end based on the existing Moji UI. Firebase Authentication
handles email/password accounts, and Cloud Firestore stores user profiles and
reserves unique usernames.

## Run locally

1. Create a Firebase project and register a Web app in the Firebase console.
2. Enable **Authentication > Email/Password**.
3. Create a Cloud Firestore database and publish the rules from `firestore.rules`.
4. Copy `.env.example` to `.env` and fill in the Web app configuration values.
5. Install dependencies and start the app:

   ```sh
   npm install
   npm run dev
   ```

The original project in `Moji` is unchanged. This folder is a standalone copy of
its frontend; no Express or MongoDB server is needed.
