// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ7Z_AOz5OwM1UTt34N8R05HJHtl49sIA",
  authDomain: "challenge-quiz-9be13.firebaseapp.com",
  projectId: "challenge-quiz-9be13",
  storageBucket: "challenge-quiz-9be13.firebasestorage.app",
  messagingSenderId: "802203838806",
  appId: "1:802203838806:web:a6343beca9a4a85b87cef7",
  measurementId: "G-GBHQ4C64PD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app