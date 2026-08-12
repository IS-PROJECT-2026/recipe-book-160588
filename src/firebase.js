// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD4Fq_PrdCB0nI1OTWOlKYvXITP53m5soE",
  authDomain: "recipe-book-web-8fece.firebaseapp.com",
  projectId: "recipe-book-web-8fece",
  storageBucket: "recipe-book-web-8fece.firebasestorage.app",
  messagingSenderId: "414358219503",
  appId: "1:414358219503:web:93a7b5760211f1dabf491a",
  measurementId: "G-RJW9E3T7DF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);