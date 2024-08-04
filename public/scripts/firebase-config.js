import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnWk4vXY02RQ8e1k-gDmxOSJtGy0xIr6c",
  authDomain: "nekoaruki-ver3.firebaseapp.com",
  projectId: "nekoaruki-ver3",
  storageBucket: "nekoaruki-ver3.appspot.com",
  messagingSenderId: "1040325830970",
  appId: "1:1040325830970:web:4b7dafea52ffd883eb4803"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);
const storage = getStorage(app);

export { db, auth, messaging, storage };