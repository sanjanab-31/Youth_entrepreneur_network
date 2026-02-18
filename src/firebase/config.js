
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDSXGxh2LPupMEMS2uwyQmUjVwTx5FdyRQ",
    authDomain: "vangaurd-f0cff.firebaseapp.com",
    projectId: "vangaurd-f0cff",
    storageBucket: "vangaurd-f0cff.firebasestorage.app",
    messagingSenderId: "639864355537",
    appId: "1:639864355537:web:5cd42c2387e77c2c94e3f0",
    measurementId: "G-CKZE36F56G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
