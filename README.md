# CyberToDo - Neon Task Manager

A futuristic cyberpunk-themed ToDo app with stunning visual effects, perfect for managing your tasks in style.

## Features

- 🎨 **Cyberpunk Design**: Neon colors, glitch effects, and futuristic styling
- ⚡ **Lightning Effect**: Epic lightning animation when completing tasks
- ✨ **Clean Add Effect**: Smooth animation when adding new tasks
- 👤 **User Accounts**: Create an account to save your todos in the cloud
- 📚 **Notebooks/Tabs**: Organize your tasks into multiple notebooks (like tabs)
- ☁️ **Cloud Sync**: All your data is saved to Firebase and synced across devices
- 📊 **Statistics**: Track total, active, and completed tasks per notebook
- 📱 **Responsive**: Works on desktop and mobile devices

## Live Demo

Visit the app on GitHub Pages: [View Live Demo](https://yourusername.github.io/ToDo/)

## Getting Started

### Prerequisites

- A Firebase account (free tier is sufficient)
- Node.js or Python (for local development server)

### Setup Instructions

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/ToDo.git
cd ToDo
```

2. **Set up Firebase:**
   - Follow the detailed instructions in [SETUP.md](SETUP.md)
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `firebase-config.js`

3. **Run locally:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

4. **Visit `http://localhost:8000` in your browser**

### Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to your repository settings
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select the branch (usually `main`) and folder (usually `/root`)
5. Click "Save"
6. Your app will be available at `https://yourusername.github.io/ToDo/`

## Technologies Used

- HTML5
- CSS3 (with animations and keyframes)
- Vanilla JavaScript (ES6 Modules)
- Firebase Authentication
- Cloud Firestore
- Google Fonts (Orbitron)

## Usage

1. **Create an Account**: Click "GET STARTED" and sign up with your email
2. **Create Notebooks**: Click "+ NEW" to create a new notebook (like tabs for organizing tasks)
3. **Switch Notebooks**: Click on any notebook tab to switch between them
4. **Add a Task**: Type your task in the input field and click "ADD" or press Enter
5. **Complete a Task**: Click the checkbox next to a task to mark it as complete (triggers lightning effect!)
6. **Delete a Task**: Click the "×" button to remove a task
7. **Delete a Notebook**: Click the "×" on a notebook tab to delete it (must have at least one notebook)
8. **View Statistics**: Check the stats at the bottom for total, active, and completed tasks in the current notebook
9. **Logout**: Click "LOGOUT" in the top right to sign out

## Firebase Setup

See [SETUP.md](SETUP.md) for detailed Firebase configuration instructions.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

See LICENSE file for details.