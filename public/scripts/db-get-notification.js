import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { db } from "./firebase-config.js";
import { getCurrentUserId } from "./getCurrentUserId.js";

document.addEventListener('DOMContentLoaded', async () => {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.action === 'notify') {
      sendNotification();
    }
  });

  const dayOfTodayJapanese = getDayOfWeekJapanese();
  const userId = await getCurrentUserId();
  const settingDocs = await getDocs(collection(db, `users/${userId}/notificationSettings`));
  // 全ての通知時間の設定を取得
  settingDocs.forEach(doc => {
    const data = doc.data();
    data.days.forEach(day => {
      // 今日の曜日が設定されている曜日の中にあれば通知時刻を取得
      if (day === dayOfTodayJapanese) {
        const notificationTime = generateRandomNotificationTime(data);
        console.log(`通知時刻: ${notificationTime}`);
        // 通知を送信
        scheduleNotification(notificationTime);
        return;
      }
    });
  })
});

function getDayOfWeekJapanese() {
  const now = new Date();
  // 現在の曜日を取得(ex: 0: 日, 1: 月, ...)
  const dayOfToday = now.getDay();
  // 曜日を日本語に変換
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const dayOfTodayJapanese = daysOfWeek[dayOfToday];
  return dayOfTodayJapanese;
}

function generateRandomNotificationTime(data) {
  const startTime = data.startTime.split(':');
  const endTime = data.endTime.split(':');
  const startHour = parseInt(startTime[0]);
  const endHour = parseInt(endTime[0]);
  const randomHour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const startMinute = parseInt(startTime[1]);
  const endMinute = parseInt(endTime[1]);
  const randomMinute = Math.floor(Math.random() * (endMinute - startMinute + 1)) + startMinute;
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${randomHour}:${randomMinute}:00`;
}

function scheduleNotification(time) {
  const now = new Date();
  const notificationTime = new Date(time);
  const delay = notificationTime - now;

  if (delay > 0) {
    setTimeout(() => {
      sendNotification();
    }, delay);
  } else {
    console.log("指定の時刻は過去です。");
  }
}

function sendNotification() {
  Push.create("今すぐ歩かないと！！", {
    body: "散歩の時間です",
    icon: "src/nekoaruki_haiiro1.png",
    tag: "myTag",
    timeout: 12000,
    vibrate: [100, 100, 100],
    onClick: e => console.log("onClick", e),
    onShow: e => console.log("onShow", e),
    onClose: e => console.log("onClose", e),
    onError: e => console.log("onError", e),
  });
}

// ボタンがクリックされると、通知の許可を求める
document.getElementById("my_btn").addEventListener("click", () => {
  if (!Push.Permission.has()) {
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
  } else {
    sendNotification();
  }
});