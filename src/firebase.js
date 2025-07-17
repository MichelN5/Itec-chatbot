// firebase.js
import { loadConfig } from './configLoader.js';

let firebaseApp = null;
let auth = null;
let db = null;

const firebaseReady = loadConfig().then(config => {
    const firebaseConfig = config.FIREBASE;
    firebaseApp = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    return { auth, db };
});

export { firebaseReady }; 