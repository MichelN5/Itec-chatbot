// auth.js
import { firebaseReady } from './firebase.js';

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authMsg = document.getElementById('authMsg');
const googleSignInBtn = document.getElementById('googleSignInBtn');

function setupAuthHandlers(onAuthStateChanged) {
    loginBtn.onclick = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const { auth } = await firebaseReady;
        auth.signInWithEmailAndPassword(email, password)
            .then(() => { authMsg.textContent = ''; })
            .catch(e => authMsg.textContent = e.message);
    };

    signupBtn.onclick = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const { auth } = await firebaseReady;
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => { authMsg.textContent = 'User created! You can now log in.'; })
            .catch(e => authMsg.textContent = e.message);
    };

    logoutBtn.onclick = async () => {
        const { auth } = await firebaseReady;
        auth.signOut();
    };

    if (googleSignInBtn) {
        googleSignInBtn.onclick = async () => {
            const { auth } = await firebaseReady;
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then(() => { authMsg.textContent = ''; })
                .catch(e => authMsg.textContent = e.message);
        };
    }

    firebaseReady.then(({ auth }) => {
        auth.onAuthStateChanged(onAuthStateChanged);
    });
}

export { setupAuthHandlers }; 