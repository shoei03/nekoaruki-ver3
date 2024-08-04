async function requestPermissions() {
  try {
    // カメラへのアクセス権限を要求
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("カメラへのアクセスが許可されました。");
  } catch (err) {
    console.error("カメラへのアクセスが拒否されました:", err);
  }

  try {
    // 通知の権限を要求
    Push.Permission.request(
      () => {
        console.log("onGranted!!");
        const status = Push.Permission.get(); // Status
        sendNotification();
      },
      () => {
        console.log("onDenied!!");
        const status = Push.Permission.get(); // Status
      }
    );
  } catch (error) {
    console.error("通知の権限の取得に失敗しました:", error);
  }
}

// ページが読み込まれたときに権限を要求
document.addEventListener("DOMContentLoaded", () => {
  requestPermissions();
});
