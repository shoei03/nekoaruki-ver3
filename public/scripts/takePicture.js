import { storage } from "./firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getCurrentUserId } from "./getCurrentUserId.js";
// aaa

document.addEventListener('DOMContentLoaded', async () => {
    const userId = await getCurrentUserId();
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const takePhotoButton = document.getElementById('takePhotoButton');
    const startCameraButton = document.getElementById('startCameraButton');
    const picture = document.querySelector('.photo');

    picture.innerHTML = "<button class='btn btn-lg' id='home-button' style='display: none;'><img src='src/backspace.png' alt='return home'></button>";
    const homeButton = document.getElementById('home-button');

    startCameraButton.addEventListener('click', async () => {
        // カメラにアクセス
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block'; // カメラプレビューを表示
            takePhotoButton.style.display = 'block'; // 写真を撮るボタンを表示
            startCameraButton.style.display = 'none'; // カメラを起動ボタンを非表示
            homeButton.style.display = 'block'; // ホームに戻るボタンを表示
        } catch (err) {
            console.error('カメラへのアクセスが拒否されました:', err);
        }
    });

    // 写真を撮る
    takePhotoButton.addEventListener('click', async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        photo.setAttribute('src', dataUrl);

        // 画像をFirebase Storageにアップロード
        try {
            const blob = await (await fetch(dataUrl)).blob();
            const storageRef = ref(storage, `photos/${userId}/` + new Date().toISOString() + '.png');
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            console.log('File available at', downloadURL);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    });

    // ホームに戻るボタンのクリックイベント
    homeButton.addEventListener('click', () => {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        // 全てのトラックを停止
        tracks.forEach(track => track.stop());

        video.srcObject = null;
        video.style.display = 'none'; // カメラプレビューを非表示
        takePhotoButton.style.display = 'none'; // 写真を撮るボタンを非表示
        startCameraButton.style.display = 'block'; // カメラを起動ボタンを表示
        homeButton.style.display = 'none'; // ホームに戻るボタンを非表示
    });
});
