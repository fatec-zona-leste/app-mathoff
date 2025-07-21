import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBTnPyNYc2IZNGceCLwC9pvkRA6jz5-uxA",
  authDomain: "mathoff-firebase.firebaseapp.com",
  projectId: "mathoff-firebase",
  storageBucket: "mathoff-firebase.appspot.com",
  messagingSenderId: "13330227743",
  appId: "1:13330227743:web:d6b5f7a0c9796d8e362b2a"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };