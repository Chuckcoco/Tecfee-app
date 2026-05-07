# 🚀 Guide de déploiement — TECFÉE Pratique

## ✅ Étape 1 — Installer Node.js (si pas déjà fait)

1. Va sur https://nodejs.org
2. Télécharge la version **LTS** (recommandée)
3. Installe-la normalement

---

## ✅ Étape 2 — Ouvrir le projet dans un terminal

1. Ouvre le dossier `tecfee-app` dans ton explorateur de fichiers
2. Clique-droit dans le dossier → **Ouvrir dans le terminal** (ou PowerShell)

---

## ✅ Étape 3 — Installer les dépendances

Dans le terminal, tape :

```bash
npm install
```

Attends que tout s'installe (environ 1-2 minutes).

---

## ✅ Étape 4 — Tester localement (optionnel)

```bash
npm run dev
```

Ouvre http://localhost:5173 dans ton navigateur.
Tu devrais voir l'application ! Tape **Ctrl+C** pour arrêter.

---

## ✅ Étape 5 — Créer un compte GitHub (gratuit)

1. Va sur https://github.com/signup
2. Crée un compte gratuit
3. Installe Git : https://git-scm.com/downloads

---

## ✅ Étape 6 — Mettre le projet sur GitHub

Dans le terminal du dossier `tecfee-app` :

```bash
git init
git add .
git commit -m "Initial commit - TECFÉE Pratique"
```

Puis sur GitHub :
1. Clique sur **New repository**
2. Nomme-le `tecfee-pratique`
3. Laisse en **Public** (obligatoire pour Vercel gratuit)
4. Clique **Create repository**
5. Copie les commandes affichées et colle-les dans ton terminal

---

## ✅ Étape 7 — Déployer sur Vercel (GRATUIT)

1. Va sur https://vercel.com/signup
2. **Connecte avec GitHub** (le plus simple)
3. Clique sur **Add New Project**
4. Sélectionne ton repository `tecfee-pratique`
5. Vercel détecte automatiquement Vite → clique **Deploy**
6. Attends 1-2 minutes...

**🎉 C'est tout ! Tu obtiendras une URL comme :**
```
https://tecfee-pratique.vercel.app
```

---

## 📱 Étape 8 — Partager avec ta copine

1. Copie l'URL Vercel (ex: https://tecfee-pratique.vercel.app)
2. Envoie-lui par message
3. Elle peut l'ouvrir sur **iPhone, Android, ordinateur, tablette**

### Pour l'installer comme une app sur iPhone :
1. Ouvrir Safari → aller sur l'URL
2. Appuyer sur le bouton **Partager** (carré avec flèche)
3. Défiler et taper **« Sur l'écran d'accueil »**
4. L'app apparaît comme une vraie application !

### Pour l'installer sur Android :
1. Ouvrir Chrome → aller sur l'URL
2. Appuyer sur les **3 points** en haut à droite
3. Taper **« Ajouter à l'écran d'accueil »**

---

## 🔑 Comptes par défaut

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| demo@tecfee.ca | Demo123! | Utilisateur démo |
| admin@tecfee.ca | Admin123! | Administrateur |

Ta copine peut aussi **créer son propre compte** depuis la page de connexion.

---

## 🔄 Mettre à jour l'application

Après avoir modifié des fichiers :

```bash
git add .
git commit -m "Mise à jour des questions"
git push
```

Vercel redéploie automatiquement en 1-2 minutes ! ✨

---

## 🌐 Domaine personnalisé (optionnel, gratuit)

Dans Vercel :
1. Va dans **Settings → Domains**
2. Ajoute ton domaine (ex: tecfee.ton-nom.com)
3. Suis les instructions pour configurer le DNS

---

## ❓ Problèmes fréquents

**`npm install` échoue :**
→ Vérifie que Node.js est bien installé : `node --version`

**L'app ne s'affiche pas :**
→ Efface le cache du navigateur (Ctrl+Shift+R)

**Les données se perdent :**
→ Normal ! Les données sont stockées localement sur chaque appareil.
→ Ta copine devra créer son compte sur son téléphone ET sur son ordinateur séparément.
