import { storage } from "./firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getCurrentUserId } from "./getCurrentUserId.js";

document.addEventListener('DOMContentLoaded', async () => {
    const userId = await getCurrentUserId();
    const photo = document.getElementById('photo');
    const takePhotoButton = document.getElementById('takePhotoButton');

    // 写真を撮る
    takePhotoButton.addEventListener('click', async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        // photo.setAttribute('src', dataUrl);

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
});

jQuery(($) => {
	$('.js-start').click(videoStart);
	$('.js-stop').click(videoStop);
	$('.js-change').click(videoChangeCamera);

	let cur = null;

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
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(setting).then((stream) => {
                const video = document.getElementById('video');
                cur = stream;
                video.srcObject = stream;
                video.play();
                $('.js-camera #video').show(); // カメラ画面を表示
            }).catch((error) => {
                if (error.name === 'OverconstrainedError') {
                    console.log('OverconstrainedError: Trying with facingMode: "user"');
                    setting.video.facingMode = 'user';
                    navigator.mediaDevices.getUserMedia(setting).then((stream) => {
                        const video = document.getElementById('video');
                        cur = stream;
                        video.srcObject = stream;
                        video.play();
                        $('.js-camera #video').show(); // カメラ画面を表示
                    }).catch((err) => {
                        console.log('Cannot use camera: ' + err);
                    });
                } else {
                    console.log('Cannot use camera: ' + error);
                }
            });
        }
    }

	function videoStop() {
		if (cur !== null) {
			cur.getVideoTracks().forEach((camera) => {
				camera.stop();
			});
			cur = null;
            $('.js-camera #video').hide(); // カメラ画面を非表示
		}
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
});