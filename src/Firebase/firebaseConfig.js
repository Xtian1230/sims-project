import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBUem9-juQBb743_0-7ClEZryQVYYaEbaY",
    authDomain: "sims-angels.firebaseapp.com",
    projectId: "sims-angels",
    storageBucket: "sims-angels.firebasestorage.app",
    messagingSenderId: "771494802853",
    appId: "1:771494802853:web:dc05dc600dd50ea95e644c",
    measurementId: "G-JZMY2DRFBF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, auth, firestore, storage };
export default app;
