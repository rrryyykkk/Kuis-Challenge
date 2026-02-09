// Import fungsi yang dibutuhkan dari SDK Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Konfigurasi Firebase Anda
// PENTING: Ganti nilai-nilai di bawah ini dengan konfigurasi dari Firebase Console Anda
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STRORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSANGER_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASURENMENT_ID,
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Authentication
export const auth = getAuth(app);
