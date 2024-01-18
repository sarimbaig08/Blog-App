import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC99zAm27XlsQ90ZOy0srsX42bZUcanH6U",
  authDomain: "crud-34b2c.firebaseapp.com",
  projectId: "crud-34b2c",
  storageBucket: "crud-34b2c.appspot.com",
  messagingSenderId: "711724837473",
  appId: "1:711724837473:web:a6729d904215d809021820",
};
var app = initializeApp(firebaseConfig);
// console.log(app);
var db = getFirestore(app);
// console.log(db);
var auth = getAuth(app);

const storage = getStorage();

export {
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  db,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  getStorage,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
};
