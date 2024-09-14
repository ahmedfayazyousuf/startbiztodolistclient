import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAvDFgi9DYV5BVpYh-DdA-EiW1A7bLi50E",
    authDomain: "startbiz-dcf83.firebaseapp.com",
    projectId: "startbiz-dcf83",
    storageBucket: "startbiz-dcf83.appspot.com",
    messagingSenderId: "213487472641",
    appId: "1:213487472641:web:0ab83ac3ff80813a807000",
    measurementId: "G-9C2GWFWRT5"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export { app, db, storage, auth };