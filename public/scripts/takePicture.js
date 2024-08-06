import { storage } from "./firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getCurrentUserId } from "./getCurrentUserId.js";

let canvas = null;

document.addEventListener('DOMContentLoaded', async () => {
    canvas = document.createElement('canvas'); // canvas要素を作成
    document.body.appendChild(canvas); // canvas要素をDOMに追加
    // const photo = document.getElementById('photo');
});

jQuery(($) => {
    const startButton = document.getElementById('js-start');
    const stopButton = document.getElementById('js-stop');
    const changeButton = document.getElementById('js-change');
    const takePhotoButton = document.getElementById('takePhotoButton');
    const returnButton = document.getElementById('returnButton');

    startButton.addEventListener('click', () => {
        videoStart();
    });

    stopButton.addEventListener('click', () => {
        videoStop();
    });

    changeButton.addEventListener('click', () => {
        videoChangeCamera();
    });

    takePhotoButton.addEventListener('click', async () => {
        await captureAndUploadImage();
    });

	let cur = null;
    let isTakingPhoto = false;

	let setting = {
		audio: false,
		video: {
			width: 300,
			height: 600,
			facingMode: {exact: 'environment'},
			// facingMode: 'user',
		},
	};

    $('.js-camera #video').hide(); // カメラ画面を非表示

    function videoStart() {
        videoStop();
        isTakingPhoto = true;
        takePhotoButton.style.display = 'block';
        changeButton.style.display = 'block';
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        returnButton.style.display = 'none';
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(setting).then((stream) => {
                const video = document.getElementById('video');
                cur = stream;
                video.srcObject = stream;
                video.play();
                $('.js-camera #video').show(); // カメラ画面を表示
            }).catch((error) => {
                if (error.name === 'OverconstrainedError') {
                    setting.video.facingMode = 'user';
                    navigator.mediaDevices.getUserMedia(setting).then((stream) => {
                        const video = document.getElementById('video');
                        cur = stream;
                        video.srcObject = stream;
                        video.play();
                        $('.js-camera #video').show(); // カメラ画面を表示
                    }).catch((err) => {
                        console.error('Cannot use camera with facingMode "user":', err);
                        alert('カメラを使用できません: ' + err.message);
                    });
                } else {
                    console.error('Cannot use camera:', error);
                    alert('カメラを使用できません: ' + error.message);
                }
            });
        } else {
            console.error('navigator.mediaDevices.getUserMedia is not supported by this browser.');
        }
    }


    function videoStop() {
        stopButton.style.display = 'none';
        startButton.style.display = 'block';
        takePhotoButton.style.display = 'none';
        changeButton.style.display = 'none';
        returnButton.style.display = 'block';
        if (cur !== null) {
            cur.getVideoTracks().forEach((camera) => {
                camera.stop();
            });
            cur = null;
            $('.js-camera #video').hide(); // カメラ画面を非表示
        } else {
            console.log('cur is null, nothing to stop');
        }
        isTakingPhoto = false;
    }

	function videoChangeCamera() {
		if (setting.video.facingMode == 'user') {
			setting.video.facingMode = {exact: 'environment'};
		} else {
			setting.video.facingMode = 'user';
		}
		if (cur !== null) {
			videoStop();
			videoStart();
		}
	}

    async function captureAndUploadImage() {
        // 画面を光らせる要素を追加
        const flash = document.createElement('div');
        flash.className = 'flash';
        document.body.appendChild(flash);

        // 一定時間後に光を消す
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 500);

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        canvas = null;

        // photo.setAttribute('src', dataUrl);
        const userId = await getCurrentUserId();
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
    }
});
