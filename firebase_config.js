// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMZnEusLT5_7Ti9-l5BnKR7s8dfUd-XYM",
  authDomain: "bs-liquor.firebaseapp.com",
  projectId: "bs-liquor",
  storageBucket: "bs-liquor.appspot.com",
  messagingSenderId: "177685160643",
  appId: "1:177685160643:web:ea967275fb0fb102e2f876",
  measurementId: "G-XVPMSVLD3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);