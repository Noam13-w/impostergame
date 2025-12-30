import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfk5l5ZsmlkFeOKihVE0-_TjAHEhvo6hk",
  authDomain: "imposter-game-a7881.firebaseapp.com",
  projectId: "imposter-game-a7881",
  storageBucket: "imposter-game-a7881.firebasestorage.app",
  messagingSenderId: "954042477728",
  appId: "1:954042477728:web:f678f1e2c78f6e614cadc5",
  measurementId: "G-Z3ZW2N3HXW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);