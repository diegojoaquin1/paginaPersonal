import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBJpNrmrUuqjdEALfJ6ly7t232D_JdIKHE",
  authDomain: "goal-temple-2f12a.firebaseapp.com",
  projectId: "goal-temple-2f12a",
  storageBucket: "goal-temple-2f12a.firebasestorage.app",
  messagingSenderId: "1000321025620",
  appId: "1:1000321025620:web:d0e6fd4b074f78bfff4fc1",
  measurementId: "G-JFNHVLKCCW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);