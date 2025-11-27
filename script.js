// Firebase imports (loaded via CDN in HTML)
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// State management
let currentUser = null;
let notebooks = [];
let currentNotebookId = null;
let todos = [];
let todoIdCounter = 0;

// DOM elements
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const closeAuth = document.getElementById('closeAuth');
const showAuthBtn = document.getElementById('showAuthBtn');
const authTabs = document.querySelectorAll('.auth-tab');
const userBar = document.getElementById('userBar');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeMessage = document.getElementById('welcomeMessage');
const notebooksSection = document.getElementById('notebooksSection');
const notebooksTabs = document.getElementById('notebooksTabs');
const addNotebookBtn = document.getElementById('addNotebookBtn');
const inputSection = document.getElementById('inputSection');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const stats = document.getElementById('stats');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const lightningOverlay = document.getElementById('lightningOverlay');

// Auth Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tabName === 'login') {
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex';
        }
    });
});

// Show Auth Modal
function showAuthModal() {
    authModal.style.display = 'flex';
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    authTabs[0].classList.add('active');
    authTabs[1].classList.remove('active');
    loginError.textContent = '';
    signupError.textContent = '';
}

// Hide Auth Modal
function hideAuthModal() {
    authModal.style.display = 'none';
}

// Login
loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    
    if (!email || !password) {
        loginError.textContent = 'Please fill in all fields';
        return;
    }
    
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'LOGGING IN...';
        await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        hideAuthModal();
    } catch (error) {
        loginError.textContent = error.message || 'Login failed';
        loginBtn.disabled = false;
        loginBtn.textContent = 'LOGIN';
    }
});

// Signup
signupBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    
    if (!name || !email || !password) {
        signupError.textContent = 'Please fill in all fields';
        return;
    }
    
    if (password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters';
        return;
    }
    
    try {
        signupBtn.disabled = true;
        signupBtn.textContent = 'CREATING...';
        const userCredential = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        
        // Save user profile
        await setDoc(doc(window.firebaseDb, 'users', userCredential.user.uid), {
            name: name,
            email: email,
            createdAt: new Date().toISOString()
        });
        
        // Create default notebook
        const defaultNotebookId = `notebook_${Date.now()}`;
        await setDoc(doc(window.firebaseDb, 'notebooks', defaultNotebookId), {
            userId: userCredential.user.uid,
            name: 'My Notebook',
            createdAt: new Date().toISOString(),
            order: 0
        });
        
        hideAuthModal();
    } catch (error) {
        signupError.textContent = error.message || 'Signup failed';
        signupBtn.disabled = false;
        signupBtn.textContent = 'CREATE ACCOUNT';
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(window.firebaseAuth);
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Event Listeners
showAuthBtn?.addEventListener('click', showAuthModal);
closeAuth?.addEventListener('click', hideAuthModal);

// Auth State Observer
onAuthStateChanged(window.firebaseAuth, async (user) => {
    currentUser = user;
    
    if (user) {
        // User is logged in
        const userDoc = await getDoc(doc(window.firebaseDb, 'users', user.uid));
        const userData = userDoc.data();
        userName.textContent = userData?.name || user.email;
        userBar.style.display = 'flex';
        welcomeMessage.style.display = 'none';
        notebooksSection.style.display = 'block';
        inputSection.style.display = 'block';
        stats.style.display = 'flex';
        
        // Load notebooks
        loadNotebooks();
    } else {
        // User is logged out
        userBar.style.display = 'none';
        welcomeMessage.style.display = 'block';
        notebooksSection.style.display = 'none';
        inputSection.style.display = 'none';
        stats.style.display = 'none';
        notebooks = [];
        todos = [];
        currentNotebookId = null;
        renderNotebooks();
        renderTodos();
    }
});

// Load Notebooks
function loadNotebooks() {
    if (!currentUser) return;
    
    const notebooksQuery = query(
        collection(window.firebaseDb, 'notebooks'),
        where('userId', '==', currentUser.uid)
    );
    
    onSnapshot(notebooksQuery, (snapshot) => {
        notebooks = [];
        snapshot.forEach((doc) => {
            notebooks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort by order
        notebooks.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        renderNotebooks();
        
        // Select first notebook if none selected
        if (notebooks.length > 0 && !currentNotebookId) {
            switchNotebook(notebooks[0].id);
        } else if (currentNotebookId && notebooks.find(n => n.id === currentNotebookId)) {
            switchNotebook(currentNotebookId);
        } else if (notebooks.length > 0) {
            switchNotebook(notebooks[0].id);
        }
    });
}

// Render Notebooks
function renderNotebooks() {
    notebooksTabs.innerHTML = '';
    
    notebooks.forEach(notebook => {
        const tab = document.createElement('button');
        tab.className = `notebook-tab ${notebook.id === currentNotebookId ? 'active' : ''}`;
        tab.textContent = notebook.name;
        tab.addEventListener('click', () => switchNotebook(notebook.id));
        
        // Delete button
        if (notebooks.length > 1) {
            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-notebook';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNotebook(notebook.id);
            });
            tab.appendChild(deleteBtn);
        }
        
        notebooksTabs.appendChild(tab);
    });
}

// Switch Notebook
async function switchNotebook(notebookId) {
    currentNotebookId = notebookId;
    renderNotebooks();
    loadTodos();
}

// Create Notebook
addNotebookBtn.addEventListener('click', () => {
    const name = prompt('Enter notebook name:');
    if (name && name.trim()) {
        createNotebook(name.trim());
    }
});

async function createNotebook(name) {
    if (!currentUser) return;
    
    try {
        const notebookId = `notebook_${Date.now()}`;
        await setDoc(doc(window.firebaseDb, 'notebooks', notebookId), {
            userId: currentUser.uid,
            name: name,
            createdAt: new Date().toISOString(),
            order: notebooks.length
        });
        
        // Switch to new notebook
        switchNotebook(notebookId);
    } catch (error) {
        console.error('Error creating notebook:', error);
        alert('Failed to create notebook');
    }
}

// Delete Notebook
async function deleteNotebook(notebookId) {
    if (!currentUser || notebooks.length <= 1) return;
    
    if (!confirm('Delete this notebook? All todos will be deleted.')) return;
    
    try {
        // Delete all todos in this notebook
        const todosQuery = query(
            collection(window.firebaseDb, 'todos'),
            where('notebookId', '==', notebookId)
        );
        
        const todosSnapshot = await getDocs(todosQuery);
        todosSnapshot.forEach(async (todoDoc) => {
            await deleteDoc(doc(window.firebaseDb, 'todos', todoDoc.id));
        });
        
        // Delete notebook
        await deleteDoc(doc(window.firebaseDb, 'notebooks', notebookId));
        
        // Switch to first remaining notebook
        if (notebooks.length > 1) {
            const remainingNotebooks = notebooks.filter(n => n.id !== notebookId);
            if (remainingNotebooks.length > 0) {
                switchNotebook(remainingNotebooks[0].id);
            }
        }
    } catch (error) {
        console.error('Error deleting notebook:', error);
        alert('Failed to delete notebook');
    }
}

// Load Todos
function loadTodos() {
    if (!currentUser || !currentNotebookId) {
        todos = [];
        renderTodos();
        updateStats();
        return;
    }
    
    const todosQuery = query(
        collection(window.firebaseDb, 'todos'),
        where('notebookId', '==', currentNotebookId)
    );
    
    onSnapshot(todosQuery, (snapshot) => {
        todos = [];
        snapshot.forEach((doc) => {
            todos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort by creation date
        todos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        renderTodos();
        updateStats();
    });
}

// Save Todo
async function saveTodo(todo) {
    if (!currentUser || !currentNotebookId) return;
    
    try {
        const todoRef = doc(window.firebaseDb, 'todos', todo.id);
        await setDoc(todoRef, {
            ...todo,
            userId: currentUser.uid,
            notebookId: currentNotebookId
        });
    } catch (error) {
        console.error('Error saving todo:', error);
    }
}

// Delete Todo
async function deleteTodoFromFirestore(todoId) {
    if (!currentUser) return;
    
    try {
        await deleteDoc(doc(window.firebaseDb, 'todos', todoId));
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Update Statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// Lightning Effect
function triggerLightningEffect() {
    lightningOverlay.classList.add('active');
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const bolt = document.createElement('div');
            bolt.style.position = 'fixed';
            bolt.style.top = '0';
            bolt.style.left = `${Math.random() * 100}%`;
            bolt.style.width = '2px';
            bolt.style.height = '100%';
            bolt.style.background = `linear-gradient(to bottom, 
                transparent 0%,
                var(--neon-cyan) ${20 + Math.random() * 20}%,
                var(--neon-pink) ${40 + Math.random() * 20}%,
                var(--neon-cyan) ${60 + Math.random() * 20}%,
                var(--neon-purple) ${80 + Math.random() * 20}%,
                transparent 100%
            )`;
            bolt.style.boxShadow = `
                0 0 20px var(--neon-cyan),
                0 0 40px var(--neon-pink),
                0 0 60px var(--neon-purple)
            `;
            bolt.style.pointerEvents = 'none';
            bolt.style.zIndex = '10000';
            bolt.style.opacity = '0';
            bolt.style.animation = 'lightning 0.3s ease-out';
            document.body.appendChild(bolt);
            
            setTimeout(() => {
                bolt.remove();
            }, 300);
        }, i * 100);
    }
    
    setTimeout(() => {
        lightningOverlay.classList.remove('active');
    }, 500);
}

// Add Todo
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

async function addTodo() {
    if (!currentNotebookId) return;
    
    const text = todoInput.value.trim();
    
    if (text === '') {
        todoInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            todoInput.style.animation = '';
        }, 500);
        return;
    }
    
    const todoId = `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTodo = {
        id: todoId,
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    await saveTodo(newTodo);
    todoInput.value = '';
    todoInput.focus();
}

// Toggle Todo
async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        await saveTodo(todo);
        
        if (todo.completed) {
            triggerLightningEffect();
        }
    }
}

// Delete Todo
async function deleteTodo(id) {
    await deleteTodoFromFirestore(id);
}

// Render Todos
function renderTodos() {
    todoList.innerHTML = '';
    
    if (!currentNotebookId) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '40px';
        emptyMessage.style.color = 'var(--text-secondary)';
        emptyMessage.style.fontSize = '1.2rem';
        emptyMessage.textContent = 'Select or create a notebook to get started';
        todoList.appendChild(emptyMessage);
        return;
    }
    
    if (todos.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '40px';
        emptyMessage.style.color = 'var(--text-secondary)';
        emptyMessage.style.fontSize = '1.2rem';
        emptyMessage.textContent = 'No tasks yet. Add one to get started!';
        todoList.appendChild(emptyMessage);
        return;
    }
    
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = todo.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);
        
        // Add animation for new items
        if (index === todos.length - 1 && !todo.completed) {
            todoItem.classList.add('new-item');
            setTimeout(() => {
                todoItem.classList.remove('new-item');
            }, 500);
        }
        
        todoList.appendChild(todoItem);
    });
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
