// firebaseConfig.js
import { initializeApp } from "firebase/app";

// Use the config values from Firebase Console → Project Settings → Web App
const firebaseConfig = {
  apiKey: "AIzaSyBMf-_TBem5SY58NXkJq58YZJqBTOGfN0Q",
  authDomain: "https://cheriecloset-default-rtdb.firebaseio.com",
  projectId: "cheriecloset",
  storageBucket: "cheriecloset.firebasestorage.app",
  messagingSenderId: "1070051081022",
  appId: "1:1070051081022:android:71fa0a66b6207796758a6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;