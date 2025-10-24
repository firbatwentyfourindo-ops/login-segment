import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyDpMUow-RIx05qGbqWZYDBdPVssXavi39g",
  authDomain: "preset-tokengrecia.firebaseapp.com",
  projectId: "preset-tokengrecia",
  storageBucket: "preset-tokengrecia.appspot.com",
  messagingSenderId: "320118265717",
  appId: "1:320118265717:web:82f9ac131419bebbf2253c",
  measurementId: "G-RXKLR9G7MK"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔍 Fungsi validasi token
export async function validateToken(token) {
  const docRef = doc(db, "tokens", token);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.valid === true) {
      console.log("Token valid:", data);
      return true;
    }
  }
  console.warn("Token tidak ditemukan:", token);
  return false;
}
