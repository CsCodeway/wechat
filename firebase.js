import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRfmZ2Qzg8HtmHybplj5w1RNZPZoKBaQk",
  authDomain: "wechat-ae27b.firebaseapp.com",
  projectId: "wechat-ae27b",
  storageBucket: "wechat-ae27b.appspot.com",
  messagingSenderId: "765800791288",
  appId: "1:765800791288:web:987a93f34ab5ebffb50f0d",
  measurementId: "G-HZ18753P85"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

// Use these for db & auth
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = app.storage();

export { auth, db, provider, storage };