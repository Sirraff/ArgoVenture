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

document.addEventListener('DOMContentLoaded', async () => {
    const signInButton = document.getElementById("signInButton");
    const signOutButton = document.getElementById("signOutButton");
    const userImage = document.getElementById("userImage");
    const userNameSpan = document.getElementById("userName");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in.
            signInButton.style.display = "none";
            signOutButton.style.display = "block";
            userImage.src = user.photoURL || 'path_to_default_image'; // Use a default image if none is available.
            userImage.style.display = "block";
            userNameSpan.textContent = user.displayName || user.email;
            userNameSpan.style.display = "block";
            addProjectLink.style.display = "block"
            // Ensure session is set on the server without reloading the page
            user.getIdToken().then((idToken) => {
                fetch('/sessionLogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idToken })
                }).then(response => response.json())
                .then(data => {
                    console.log('Session status:', data.status);
                });
            });
        } else {
            // User is signed out.
            addProjectLink.style.display ="none"
            signInButton.style.display = "block";
            signOutButton.style.display = "none";
            userImage.style.display = "none";
            userNameSpan.style.display = "none";
        }
    });

    signInButton.addEventListener('click', () => {
        signInWithPopup(auth, provider).catch((error) => {
            console.error("Sign-in error:", error);
        });
    });

    signOutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            fetch('/logout', { method: 'POST' });
            console.log("Signed out successfully.");
        }).catch((error) => {
            console.error("Sign-out error:", error);
        });
    });
});