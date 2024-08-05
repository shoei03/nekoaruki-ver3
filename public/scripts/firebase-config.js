import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js";
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

// 通知許可とトークンの取得
const requestNotificationPermission = async () => {
    try {
        await Notification.requestPermission();
        console.log('Notification permission granted.');

        // Get token
        const currentToken = await getToken(messaging, { vapidKey: "BHG7peduN7O8NcQV8llVJzCDvvVKNLrPUWlDJntuDW3fvUftWSmM1TsJXC_qrNYXpMkbeJ8rcUf3aR1ZyDQifTc" });
        if (currentToken) {
            console.log('Token:', currentToken);
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.log('Unable to get permission to notify.', err);
    }
};

// フォアグラウンドでのメッセージ受信処理
const handleForegroundMessage = () => {
    onMessage(messaging, (payload) => {
        console.log('Message received in foreground. ', payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '../assets/appIcon.png'
        };

        new Notification(notificationTitle, notificationOptions);
    });
};

requestNotificationPermission();
handleForegroundMessage();

export { db, auth, messaging, storage };