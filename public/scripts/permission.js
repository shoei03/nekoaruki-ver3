async function requestPermissions() {
  try {
    // カメラへのアクセス権限を要求
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("カメラへのアクセスが許可されました。");
  } catch (err) {
    console.error("カメラへのアクセスが拒否されました:", err);
  }
}

// ページが読み込まれたときに権限を要求
document.addEventListener("DOMContentLoaded", () => {
  requestPermissions();
});
