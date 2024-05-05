// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


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

document.addEventListener('DOMContentLoaded', function () {
    const signInButton = document.getElementById("signInButton");
    const signOutButton = document.getElementById("signOutButton");
    const message = document.getElementById("message");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    onAuthStateChanged(auth, (user) => {
        const signInButton = document.getElementById("signInButton");
        const signOutButton = document.getElementById("signOutButton");
        const userImage = document.getElementById("userImage"); // Ensure this ID matches the HTML
        const userNameSpan = document.getElementById("userName"); // This will display the user's name
    
        if (user) {
            signInButton.style.display = "none";
            signOutButton.style.display = "block";
            userImage.src = user.photoURL; // Set the image source to the user's photo URL
            userImage.style.display = "block"; // Make the image visible
            userNameSpan.textContent = user.displayName || user.email; // Display the user's name
            document.getElementById("message").style.display = "block"; // Optional: display additional message
        } else {
            signInButton.style.display = "block";
            signOutButton.style.display = "none";
            userImage.style.display = "none"; // Hide the image when not signed in
            userNameSpan.textContent = ""; // Clear the user's name
            document.getElementById("message").style.display = "none"; // Hide the message
        }
    });

    signInButton.addEventListener('click', () => {
        signInWithPopup(auth, provider).catch((error) => {
            alert("Error during sign in: " + error.message);
        });
    });

    signOutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            alert("Signed out successfully");
        }).catch((error) => {
            alert("Error signing out: " + error.message);
        });
    });
});
