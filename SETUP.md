# Firebase Setup Instructions

This app uses Firebase for authentication and data storage. Follow these steps to set up your Firebase project.

## Firebase Products Used

This app uses the following Firebase products:

- **Cloud Firestore**: NoSQL database for storing todos, notebooks, and user data with real-time updates
- **Firebase Authentication**: Secure user authentication with email/password
- **Firebase Hosting** (optional): Alternative hosting option if you prefer Firebase over GitHub Pages

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter a project name (e.g., "CyberToDo")
4. Follow the setup wizard:
   - You can disable Google Analytics if you don't need it
   - Choose your preferred settings
5. Click **"Create project"** and wait for it to initialize

## Step 2: Set Up Firebase Authentication

Firebase Authentication is essential for managing users and enabling secure access to personalized todo lists.

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **"Get Started"**
3. Click on the **"Sign-in method"** tab
4. Find **"Email/Password"** in the list
5. Click on it and toggle **"Enable"**
6. Click **"Save"**

Your users can now sign up and sign in using email and password!

## Step 3: Set Up Cloud Firestore Database

Cloud Firestore is perfect for storing your todo items, notebooks, and user data with real-time synchronization.

1. Go to **Firestore Database** in the left sidebar
2. Click **"Create database"**
3. Choose your security rules:
   - Select **"Start in test mode"** for development (allows read/write for 30 days)
   - Or choose **"Start in production mode"** and set up rules immediately
4. Choose a location for your database (select the closest region to your users)
5. Click **"Enable"** and wait for the database to be created

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

## Step 4: Register Your App in Firebase

1. In Firebase Console, click the gear icon ⚙️ next to **"Project Overview"**
2. Select **"Project settings"**
3. Scroll down to the **"Your apps"** section
4. Click the **</>** (Web) icon to add a web app
5. Register your app:
   - Give it a nickname (e.g., "CyberToDo")
   - You can skip Firebase Hosting setup for now (we're using GitHub Pages)
6. Click **"Register app"**
7. **Copy the `firebaseConfig` object** - you'll need this in the next step

## Step 5: Connect Your App to Firebase

Now you'll connect your app's codebase to Firebase by adding your configuration.

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase configuration that you copied in Step 4:

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

3. Save the file

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

## Step 6: Test Your Connection

1. Start a local server (required for Firebase to work):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

2. Open `http://localhost:8000` in your browser

3. Test the app:
   - Click **"GET STARTED"**
   - Create a new account with email and password
   - Create a notebook
   - Add some todos
   - Mark todos as complete (watch for the lightning effect!)
   - Verify data persists after refresh

## Step 7: Deploy to GitHub Pages

1. Commit and push your code to GitHub (make sure `firebase-config.js` is committed)
2. Go to your repository **Settings** → **Pages**
3. Under **"Source"**, select:
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
4. Click **"Save"**
5. Your app will be live at `https://yourusername.github.io/ToDo/`

### Optional: Add Your Domain to Firebase

After deploying, you may need to authorize your GitHub Pages domain:
1. Go to Firebase Console → **Authentication** → **Settings**
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add `yourusername.github.io`
5. Click **"Add"**

## Important Notes

- **Firebase Config Security**: The Firebase config is safe to include in client-side code. However, if you're concerned about quota usage, you can restrict your API keys in Firebase Console → Project Settings → Your apps
- **Free Tier**: Firebase's free tier (Spark plan) is generous and perfect for personal projects:
  - 50,000 reads/day
  - 20,000 writes/day
  - 10 GB storage
  - Unlimited authentication
- **Security Rules**: The rules provided above ensure users can only access their own data. Review and test them before production
- **Alternative Hosting**: If you prefer, you can use Firebase Hosting instead of GitHub Pages:
  ```bash
  npm install -g firebase-tools
  firebase login
  firebase init hosting
  firebase deploy
  ```

## Troubleshooting

- **"Firebase: Error (auth/unauthorized-domain)"**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains
- **"Permission denied"**: Check your Firestore security rules
- **"Module not found"**: Make sure you're using a local server (not opening the file directly)

