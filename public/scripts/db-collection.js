import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { db, storage } from "./firebase-config.js";
import { getCurrentUserId } from "./getCurrentUserId.js";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // 月を2桁に0埋め
const day = String(today.getDate()).padStart(2, '0'); // 日を2桁に0埋め
const yymm = document.getElementById("year-month");

document.addEventListener("DOMContentLoaded", async () => {
    yymm.textContent = `${year}-${month}`;
    renderCalendarDays(year, month, day);
});

document.querySelector(".prev").addEventListener("click", () => upDateMonthYear(-1));
document.querySelector(".next").addEventListener("click", () => upDateMonthYear(1));

function upDateMonthYear(direction) {
    let [year, month] = yymm.textContent.split("-").map(Number);
    month += direction;
    if (month === 0) {
        year -= 1;
        month = 12;
    } else if (month === 13) {
        year += 1;
        month = 1;
    }
    yymm.textContent = `${year}-${month}`;
    removeAllChildren();
    renderCalendarDays(year, month, day);
}

// .calendarの子要素を削除する関数
function removeAllChildren() {
    const calendarElement = document.querySelector(".calendar");
    while (calendarElement.firstChild) {
        calendarElement.removeChild(calendarElement.firstChild);
    }
}

async function renderCalendarDays(year, month, day) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const calendarElement = document.querySelector(".calendar");
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.className = "day";
        const formattedDay = String(day).padStart(2, '0');
        dayElement.dataset.day = `${year}-${formattedMonth}-${formattedDay}`;

        // 動的に::before擬似要素のcontentを設定
        const style = document.createElement("style");
        style.textContent = `.day[data-day="${year}-${formattedMonth}-${formattedDay}"]::before { content: "${day}"; }`;
        document.head.appendChild(style);

        calendarElement.appendChild(dayElement);
    }

    const userId = await getCurrentUserId();
    // Firestoreからデータを取得
    const catsDocs = await getDocs(collection(db, `users/${userId}/cats`));
    showCatCollection(catsDocs);
    // firestorageから画像を取得
    const imagesRef = ref(storage, `photos/${userId}/`);
    getImagesFromStorage(imagesRef);

    // カレンダーの日付をクリックしたときの処理
    addClickEventToCalendarDays();
}

// データを取得してカレンダーに表示する関数
const showCatCollection = (catsDocs) => {
    catsDocs.forEach((catsdoc) => {
        const data = catsdoc.data();
        const date = catsdoc.id;
        const catImageURL = data.catImageURL;

        const dayElement = document.querySelector(`.calendar .day[data-day="${date}"]`);
        if (dayElement) {
            // 画像を追加
            const catImg = document.createElement("img");
            catImg.src = catImageURL;
            catImg.className = "cat-icon";
            dayElement.appendChild(catImg);
        }
    });
};

function addClickEventToCalendarDays() {
    const calendarDays = document.querySelectorAll(".day");
    calendarDays.forEach(day => {
        day.addEventListener("click", (event) => {
            const activeDay = document.querySelector(".day.enlarge");
            if (activeDay && activeDay !== day) {
                activeDay.classList.remove("enlarge");
            }
            day.classList.toggle("enlarge");
            if (day.classList.contains("enlarge")) {
                day.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }
        });
    });
}


// Firebase Storageから画像を取得して表示する関数
async function getImagesFromStorage(imagesRef) {
    try {
        const result = await listAll(imagesRef);
        if (result.items.length === 0) {
            console.log("No images found in the photos folder.");
            return;
        }
        result.items.forEach(async (imageRef) => {
            const photoImageUrl = await getDownloadURL(imageRef);
            const yyyymmdd = extractDate(photoImageUrl);
            const calendarDay = document.querySelector(`.calendar .day[data-day="${yyyymmdd}"]`);
            calendarDay.style.backgroundImage = `url(${photoImageUrl})`;
        });
    } catch (error) {
        console.error("Error fetching images:", error);
    }
}

function extractDate(url) {
    // 正規表現を使って日付部分を抽出
    const datePattern = /(\d{4})-(\d{2})-(\d{2})T/;
    const match = url.match(datePattern);

    if (match) {
        const year = match[1];
        const month = match[2];
        const day = match[3];

        return `${year}-${month}-${day}`;
    } else {
        throw new Error("日付が含まれていないURLです。");
    }
}