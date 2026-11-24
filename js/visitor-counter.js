// Persistent visitor count for the static site. The count lives in Firestore so
// it is shared by every visitor. Each browser is counted once (localStorage flag).
// The Firebase project's rules must allow read/write to /siteVisits/tetsweb —
// see README.md for the exact rule.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3XJrRZNxx7tyHOugd49k_kEQUhxp2R60",
  authDomain: "tet-s-coffee-roastery.firebaseapp.com",
  projectId: "tet-s-coffee-roastery",
  storageBucket: "tet-s-coffee-roastery.firebasestorage.app",
  messagingSenderId: "68019552831",
  appId: "1:68019552831:web:c4de43407bc7d67c56ae8a",
};

const COUNTED_KEY = "tets-coffee-visitor-counted";
const output = document.getElementById("visitor-count");

async function showVisitorCount() {
  if (!output) return;

  const app = initializeApp(firebaseConfig, "tets-website-visitors");
  const db = getFirestore(app);
  const counter = doc(db, "siteVisits", "tetsweb");

  try {
    if (!localStorage.getItem(COUNTED_KEY)) {
      await setDoc(
        counter,
        { count: increment(1), updatedAt: serverTimestamp() },
        { merge: true },
      );
      localStorage.setItem(COUNTED_KEY, "yes");
    }

    const snapshot = await getDoc(counter);
    const count = snapshot.exists() ? Number(snapshot.data().count) || 0 : 0;
    output.textContent = count.toLocaleString();
  } catch (error) {
    // Never break the page because the counter could not be reached.
    console.warn("Visitor count unavailable:", error);
    output.textContent = "Unavailable";
  }
}

void showVisitorCount();
