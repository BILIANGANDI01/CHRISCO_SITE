=============================================
CHRISCO — PANNEAU D’ADMINISTRATION (VERSION SOMBRE)
=============================================

📁 CONTENU DU DOSSIER / ZIP :
---------------------------------------------
- admin.html           → Interface complète (panneau d’administration)
- firebase-config.js   → Fichier de configuration Firebase
- LOGO CHRISCO dac.png → Logo officiel de CHRISCO intégré à l’en-tête
- README.txt           → Guide d’installation et de déploiement

Mot de passe d’accès : AdminChrisco2025
URL d’accès : https://chrisco-site.web.app/admin.html


🚀 INSTALLATION (LOCALE)
---------------------------------------------
1️⃣ Copier tous les fichiers dans votre dossier du site :
   C:\ChriscoP\CHRISCO_SITE\

2️⃣ Ouvrir le fichier firebase-config.js avec le Bloc-notes
   et y coller votre configuration Firebase :

   const firebaseConfig = {
     apiKey: "AIzaSyAcXqSf_kvVR_a9hJcnlL69wTUtyFs01zU",
     authDomain: "chrisco-site.firebaseapp.com",
     projectId: "chrisco-site",
     storageBucket: "chrisco-site.firebasestorage.app",
     messagingSenderId: "491678385297",
     appId: "1:491678385297:web:862eb46270a2594f7eab30"
   };

3️⃣ Sauvegarder le fichier.


🌐 DÉPLOIEMENT SUR FIREBASE
---------------------------------------------
1️⃣ Ouvrir PowerShell dans le dossier :
   C:\ChriscoP\CHRISCO_SITE\

2️⃣ Vérifier que le projet est bien connecté :
   firebase use

   (Sinon, reconnecter avec :)
   firebase use --add

3️⃣ Déployer le site :
   firebase deploy --only "hosting"

4️⃣ Une fois le déploiement terminé :
   Accéder à l’URL publique :
   https://chrisco-site.web.app/admin.html


🔐 CONNEXION ADMINISTRATEUR
---------------------------------------------
- Mot de passe : AdminChrisco2025
- Interface sombre moderne
- Logo CHRISCO + barre de statut Firestore
- Gestion directe :
  • Ministères
  • Organigramme
  • Paroisses (carte)

🔥 Toute modification via l’interface est enregistrée dans Firebase Firestore.


🧱 STRUCTURE FIRESTORE
---------------------------------------------
Collections utilisées :
  - ministries   → { name, lead, created }
  - organigram   → { title, parent, created }
  - parishes     → { name, lat, lng, created }

Chaque modification depuis admin.html met à jour ces collections.


🔒 SÉCURISATION RECOMMANDÉE
---------------------------------------------
1️⃣ Dans Firebase Console → Firestore → Règles :
   Remplacer les règles par :

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if false;
       }
     }
   }

2️⃣ Cliquer sur “Publier” pour sécuriser la base.

(Optionnel) Activer Firebase Authentication pour limiter
les accès admin à un compte email spécifique.


☁️ SAUVEGARDE PUBLIQUE DU ZIP
---------------------------------------------
Si vous souhaitez héberger ce ZIP sur Google Drive :
1️⃣ Allez sur https://drive.google.com
2️⃣ Glissez le fichier CHRISCO_ADMIN_DARK.zip dans Drive
3️⃣ Cliquez droit → Partager → “N’importe qui avec le lien”
4️⃣ Copier le lien public généré

Ce lien reste stable et peut être partagé avec d’autres administrateurs CHRISCO.


=============================================
© ÉGLISE CHRISCO — CHRIST ET COMPAGNONS
Version : Novembre 2025
Développement technique : CHRISCO Web & GPT-5
=============================================
