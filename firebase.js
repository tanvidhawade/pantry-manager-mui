// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCLkHpi1-xMKVAo4aVnpediOAr9swWVpc",
  authDomain: "pantry-management-923b2.firebaseapp.com",
  projectId: "pantry-management-923b2",
  storageBucket: "pantry-management-923b2.appspot.com",
  messagingSenderId: "551587980511",
  appId: "1:551587980511:web:2f60f18320659ac8e2356a",
  measurementId: "G-QPDJ49FVL2"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };