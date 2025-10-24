// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpMUow-RIx05qGbqWZYDBdPVssXavi39g",
  authDomain: "preset-tokengrecia.firebaseapp.com",
  projectId: "preset-tokengrecia",
  storageBucket: "preset-tokengrecia.appspot.com",
  messagingSenderId: "320118265717",
  appId: "1:320118265717:web:82f9ac131419bebbf2253c",
  measurementId: "G-RXKLR9G7MK"
};

// 🚀 Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🧠 Generate ID unik per device
function getDeviceId() {
  const key = "device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

// 🚪 Fungsi login
export async function loginUser(email, password) {
  await setPersistence(auth, browserLocalPersistence);
  const userCred = await signInWithEmailAndPassword(auth, email, password);

  const deviceId = getDeviceId();
  const userRef = doc(db, "users", userCred.user.uid, "devices", deviceId);

  await setDoc(userRef, {
    deviceId,
    email,
    lastLogin: serverTimestamp(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  });

  return userCred.user;
}

// 🔒 Auto redirect kalau sudah login
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "dashboard.html"; // arahkan setelah login
  }
});
