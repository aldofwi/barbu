// Import the functions you need from the SDKs you need
import {    
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbcCVey_sXfBcuc9qQ1rNnrr32oIYCBzo",
  authDomain: "barbu-a3b4c.firebaseapp.com",
  projectId: "barbu-a3b4c",
  storageBucket: "barbu-a3b4c.appspot.com",
  messagingSenderId: "664549950364",
  appId: "1:664549950364:web:f2af01d5a5d2cd9cacfe59",
  measurementId: "G-4368ZKPD0Z"
};

// Initialize Firebase
const app       = initializeApp(firebaseConfig);
const auth      = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export {auth, googleProvider, githubProvider, facebookProvider};