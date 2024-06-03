// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf7UZoploXJs5Wc7cPj30R0cAhFNd3FCk",
  authDomain: "airtribebuy.firebaseapp.com",
  projectId: "airtribebuy",
  storageBucket: "airtribebuy.appspot.com",
  messagingSenderId: "850053062400",
  appId: "1:850053062400:web:bb306c3bdc3475fc9a5de5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
