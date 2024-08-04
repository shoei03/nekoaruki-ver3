import { doc, getDoc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { db } from "./firebase-config.js";
import { getCurrentUserId } from "./getCurrentUserId.js";
import { catImageURL } from "./displayTodaysCat.js";

// 定数
const GRAVITY_MIN = 9.8;
const GRAVITY_MAX = 12.0;

// グローバル変数
let firstGoal, secondGoal;

// DOM要素
const elements = {
  goalCount: document.getElementById("goalCount"),
  goalMessage: document.getElementById("goal-message"),
  filteredCat: document.querySelector(".filtered-cat"),
  message: document.querySelector(".message"),
  stepCount: document.getElementById("stepCount")
};

// 初期化関数
function initializeApp() {
  document.addEventListener('DOMContentLoaded', loadUserGoals);
  window.addEventListener("devicemotion", handleDeviceMotion);
  window.addEventListener("beforeunload", saveStepsToFirestore); // ページ離脱時に歩数を保存
}

// ユーザーの目標をロードする
let steps = 0;
async function loadUserGoals() {
  const userId = await getCurrentUserId();
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    const catsDocs = await getDocs(collection(db, `users/${userId}/cats`));
    catsDocs.forEach((catsdoc) => {
      const data = catsdoc.data();
      steps = data.steps;
    });

    if (docSnap.exists()) {
      ({ firstGoal, secondGoal } = docSnap.data()); // 更新
      console.log('ユーザーデータが取得されました:', docSnap.data());
      updateGoalCount(steps, firstGoal, secondGoal); // 初期歩数を0として更新
    } else {
      console.log('ユーザーデータが存在しません');
    }
  } catch (error) {
    console.error('歩数の取得中にエラーが発生しました:', error);
  }
}

// 歩数と目標を更新する
function updateGoalCount(steps, firstGoal, secondGoal) {
  elements.stepCount.textContent = steps;
  if (steps >= secondGoal) {
    elements.message.innerHTML = "おめでとう！<br>ねこをコレクションできました！";
    elements.filteredCat.style.filter = 'blur(0)';
    saveStepsToFirestore(true);
  } else if (steps >= firstGoal) {
    elements.goalMessage.innerHTML = "歩で<br>ねこをコレクションできるよ～";
    elements.filteredCat.style.filter = 'blur(0)';
    elements.goalCount.textContent = secondGoal - steps;
    saveStepsToFirestore(false);
  } else {
    elements.goalCount.textContent = firstGoal - steps;
  }
}

// デバイスの動きを処理する
function handleDeviceMotion(e) {
  e.preventDefault();
  const acc = calculateAcceleration(e.accelerationIncludingGravity);
  processStepDetection(acc);
}

// 加速度を計算する
function calculateAcceleration(ag) {
  return Math.sqrt(ag.x ** 2 + ag.y ** 2 + ag.z ** 2);
}

// 歩数検出を処理する
let isWalking = false;
function processStepDetection(acc) {
  if (isWalking) {
    if (acc < GRAVITY_MIN) {
      steps++;
      isWalking = false;
      updateGoalCount(steps, firstGoal, secondGoal);
    }
  } else {
    if (acc > GRAVITY_MAX) {
      isWalking = true;
    }
  }
}

// 歩数をFirestoreに保存する
async function saveStepsToFirestore(isSaved) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;

  const userId = await getCurrentUserId();
  setDoc(doc(db, `users/${userId}/cats`, date), {
      catImageURL: catImageURL,
      steps: steps,
      isSaved: isSaved,
  });
}

initializeApp();