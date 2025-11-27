# Firebase Setup Guide

Quick guide to get your CyberToDo app connected to Firebase.

## What You Need

- Firebase account (free)
- 10 minutes

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "CyberToDo" (or any name)
4. Skip Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. Click "Authentication" in left menu
2. Click "Get Started"
3. Click "Sign-in method" tab
4. Click "Email/Password"
5. Toggle "Enable" ON
6. Click "Save"

## Step 3: Create Database

1. Click "Firestore Database" in left menu
2. Click "Create database"
3. Choose "Start in test mode"
4. Pick a location (closest to you)
5. Click "Enable"

### Add Security Rules

1. Go to "Rules" tab
2. Replace everything with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /notebooks/{notebookId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    match /todos/{todoId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

## Step 4: Get Your Config

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll to "Your apps"
4. Click the web icon `</>`
5. Name it "CyberToDo"
6. Click "Register app"
7. **Copy the config** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "yourproject.firebaseapp.com",
  projectId: "yourproject",
  storageBucket: "yourproject.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 5: Add Config to Your App

1. Open `firebase-config.js` in your project
2. Replace everything with:

```javascript
window.firebaseConfig = {
    apiKey: "PASTE_YOUR_API_KEY_HERE",
    authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
    projectId: "PASTE_YOUR_PROJECT_ID_HERE",
    storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "PASTE_YOUR_APP_ID_HERE"
};
```

3. Paste your values from Step 4
4. Save the file

## Step 6: Test It

1. Open terminal in your project folder
2. Run: `python -m http.server 8000` (or `npx http-server`)
3. Open http://localhost:8000
4. Click "GET STARTED"
5. Create an account
6. Try adding todos!

## Step 7: Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to Settings → Pages
3. Select branch: `main`, folder: `/ (root)`
4. Click Save
5. Wait 2 minutes, then visit your site!

### Add Domain to Firebase (if needed)

If you get an auth error after deploying:

1. Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add: `yourusername.github.io`
5. Click "Add"

## Done! 🎉

Your app should now work with user accounts and cloud storage.

## Need Help?

- **"Permission denied"** → Check security rules in Step 3
- **"Unauthorized domain"** → Add your domain (Step 7)
- **"Module not found"** → Use a local server, don't open file directly
