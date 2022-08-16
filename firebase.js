import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDeDxtLTAaqsgfweKEFnWI1vuGYpnXeiSw",
    authDomain: "pocketto-2a284.firebaseapp.com",
    databaseURL: "https://pocketto-2a284-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pocketto-2a284",
    storageBucket: "pocketto-2a284.appspot.com",
    messagingSenderId: "658026197315",
    appId: "1:658026197315:web:0b990806f170f504617ff6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db }