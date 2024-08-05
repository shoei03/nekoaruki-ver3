// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyBnWk4vXY02RQ8e1k-gDmxOSJtGy0xIr6c",
    authDomain: "nekoaruki-ver3.firebaseapp.com",
    projectId: "nekoaruki-ver3",
    storageBucket: "nekoaruki-ver3.appspot.com",
    messagingSenderId: "1040325830970",
    appId: "1:1040325830970:web:4b7dafea52ffd883eb4803"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './src/nekoaruki_logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
