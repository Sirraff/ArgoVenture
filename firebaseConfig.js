const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

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

firebase.initializeApp(firebaseConfig);

// Firebase services
const db = firebase.firestore();
const auth = firebase.auth();

module.exports = { db, auth };
