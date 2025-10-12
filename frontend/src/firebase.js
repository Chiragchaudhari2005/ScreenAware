// src/firebase.js
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Copy your config object from the Firebase page and paste it here
const firebaseConfig = {
  apiKey: "AIzaSyBVfU1IMI0ncYd4rpu7g28WI-SmLl_S0rA",
  authDomain: "screen-aware-bf9b9.firebaseapp.com",
  projectId: "screen-aware-bf9b9",
  storageBucket: "screen-aware-bf9b9.firebasestorage.app",
  messagingSenderId: "167160180425",
  appId: "1:167160180425:web:a95b95411d2ecb6844a718",
  measurementId: "G-RR5DLG8F66"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);