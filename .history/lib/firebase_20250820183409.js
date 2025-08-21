// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkUe_yltznxTGk5WqykDqlcB3HB8Zx1sU",
  authDomain: "atenea-f7093.firebaseapp.com",
  projectId: "atenea-f7093",
  storageBucket: "atenea-f7093.firebasestorage.app",
  messagingSenderId: "691085802860",
  appId: "1:691085802860:web:6a3a9964c7af7d94b60749",
  measurementId: "G-K9QSCKL901",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
