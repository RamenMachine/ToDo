# Firebase Setup Instructions

This app uses Firebase for authentication and data storage. Follow these steps to set up your Firebase project:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can skip Google Analytics for now)

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Click on **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click **Save**

## Step 3: Create Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Choose a location for your database
5. Click **Enable**

### Security Rules (Important!)

After creating the database, go to the **Rules** tab and update them to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own notebooks
    match /notebooks/{notebookId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Users can only read/write their own todos
    match /todos/{todoId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 4: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click the **</>** (Web) icon to add a web app
5. Register your app (give it a nickname like "CyberToDo")
6. Copy the `firebaseConfig` object

## Step 5: Update firebase-config.js

Open `firebase-config.js` and replace the placeholder values with your actual Firebase configuration:

```javascript
window.firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
    projectId: "YOUR_ACTUAL_PROJECT_ID",
    storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
    messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID"
};
```

## Step 6: Test Locally

1. Open `index.html` in a browser or use a local server
2. Try creating an account
3. Create a notebook and add some todos
4. Verify everything works

## Step 7: Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select your branch and folder
4. Your app will be live!

## Important Notes

- **Never commit your actual Firebase config to a public repository** if you're concerned about quota usage
- For production, consider using environment variables or Firebase Hosting
- The free tier of Firebase is generous and should be enough for personal use
- Make sure to set up proper Firestore security rules before going to production

## Troubleshooting

- **"Firebase: Error (auth/unauthorized-domain)"**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains
- **"Permission denied"**: Check your Firestore security rules
- **"Module not found"**: Make sure you're using a local server (not opening the file directly)

