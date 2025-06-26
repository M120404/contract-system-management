// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBeex2zM7ysvH6d2ZDwyx3U00mx1kJWkvs",
  authDomain: "clientcontractsystem.firebaseapp.com",
  projectId: "clientcontractsystem",
  storageBucket: "clientcontractsystem.firebasestorage.app",
  messagingSenderId: "230638591429",
  appId: "1:230638591429:web:59affaae9528cf46e67fac"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };