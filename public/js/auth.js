// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Add your own Firebase config here
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB043DTyD3be6NJma6zuqAFu5ZCZJSOLAQ",
    authDomain: "argoventure-afa36.firebaseapp.com",
    projectId: "argoventure-afa36",
    storageBucket: "argoventure-afa36.appspot.com",
    messagingSenderId: "29419925395",
    appId: "1:29419925395:web:9c3bc9370902a0b2fc0266",
    measurementId: "G-93F2YZ6R5T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

signOutButton.style.display = "none";
message.style.display = "none";

const userSignIn = async () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        console.log(user);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Error: ${errorMessage}`);
    });
};

const userSignOut = async () => {
    signOut(auth).then(() => {
        alert("You have signed out successfully!");
    }).catch((error) => {
        alert("Error signing out");
    });
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        signOutButton.style.display = "block";
        message.style.display = "block";
        userName.innerHTML = user.displayName;
        userEmail.innerHTML = user.email;
    } else {
        signOutButton.style.display = "none";
        message.style.display = "none";
    }
});

signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);
