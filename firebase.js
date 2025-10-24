// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

// 🚪 Fungsi login dan pencatatan token
export async function loginUser(email, password) {
  await setPersistence(auth, browserLocalPersistence);
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  
  const user = userCred.user;
  const deviceId = getDeviceId();
  
  // 🔥 Buat token unik dari UID + device
  const token = `${user.uid}_${deviceId}`;
  
  // 🗃️ Simpan ke Firestore pada collection "tokens"
  const docRef = doc(db, "tokens", token);
  await setDoc(docRef, {
    token,
    uid: user.uid,
    email: user.email,
    deviceId,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    lastLogin: serverTimestamp()
  }, { merge: true });
  
  return token;
}

// 🔒 Redirect otomatis setelah login
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "dashboard.html"; // nanti bisa kamu ubah jadi link khusus
  }
});
