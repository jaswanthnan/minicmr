import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCq7ngdQgA1_zAE6kDKE3AYeTUOULfQvdc",
    authDomain: "mini-6fe16.firebaseapp.com",
    projectId: "mini-6fe16",
    storageBucket: "mini-6fe16.firebasestorage.app",
    messagingSenderId: "917753571714",
    appId: "1:917753571714:web:7c1a622d58d4b0c993879b",
    measurementId: "G-FFY9MJ1ECY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);