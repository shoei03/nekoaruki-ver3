import { collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { db } from "./firebase-config.js";
import { getCurrentUserId } from "./getCurrentUserId.js";
import { catImages } from "./displayTodaysCat.js";

const getRecentDates = (days) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
};

const getRecentCats = async (userId, recentDates) => {
  const catsCollectionRef = collection(db, `users/${userId}/cats`);
  const promises = recentDates.map(async (date) => {
    const catDocRef = doc(catsCollectionRef, date);
    const catDocSnap = await getDoc(catDocRef);
    if (catDocSnap.exists()) {
      return { date, ...catDocSnap.data() };
    } else {
      return null;
    }
  });
  const catsData = await Promise.all(promises);
  return catsData.filter(cat => cat !== null);
};

const displayCatsFromLastFourDays = async () => {
  const userId = await getCurrentUserId();
  if (userId) {
    const recentDates = getRecentDates(4);
    const recentCats = await getRecentCats(userId, recentDates);
    const picture = document.querySelector(".picture");
    recentCats.forEach(cat => {
      picture.innerHTML += `
        <img src="${cat.catImageURL}" id="movableCat">
      `;
    });
  } else {
    console.error('ユーザーIDの取得に失敗しました。');
  }
};

function movePicture() {
  const catImages = document.querySelectorAll('.picture img');
  var isDragging = false;
  var startX, startY, initialX, initialY;

  // 画像のURLを格納した配列
  const imageSources = [
    'src/nekoaruki_haiiro_aruki.png', // translate(0px, 0px) に対応
    'src/nekoaruki_haiiro_aruki.png', // translate(100px, -100px) に対応
    'src/nekoaruki_haiiro_aruki.png', // translate(0px, -200px) に対応
    'src/nekoaruki_haiiro_aruki.png', // translate(-200px, 0px) に対応
    'src/nekoaruki_haiiro_aruki.png', // translate(0px, 200px) に対応
    'src/nekoaruki_haiiro_aruki.png', // translate(100px, 100px) に対応
  ];

  // ウィンドウの大きさを取得
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  catImages.forEach((catImage) => {
    // 初期位置を設定
    var randomLeft = Math.floor(Math.random() * (windowWidth - catImage.offsetWidth));
    var randomTop = Math.floor(Math.random() * (windowHeight - catImage.offsetHeight));
    catImage.style.position = 'absolute';
    catImage.style.left = randomLeft + 'px';
    catImage.style.top = randomTop + 'px';

    let tmpCatImageRef;

    var touchStartHandler = function (e) {
      if (e.touches.length === 1) { // シングルタッチのみを処理
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        // 画像の左上の座標を原点として取得
        initialX = catImage.offsetLeft;
        initialY = catImage.offsetTop;
        catImage.style.cursor = 'grabbing';
        tmpCatImageRef = catImage.getAttribute('src');
        const color = tmpCatImageRef.match(/_(.+)_/)[1];
        catImage.src = `src/nekoaruki_${color}_tsukami.png`;
      }
    };

    var touchMoveHandler = function (e) {
      if (isDragging) {
        // ドラッグ中の座標を取得
        var currentX = e.touches[0].clientX;
        var currentY = e.touches[0].clientY;
        // ドラッグ中の座標と初期座標の差分を取得
        var deltaX = currentX - startX;
        var deltaY = currentY - startY;
        // 画像の新しい座標を計算
        var newLeft = initialX + deltaX;
        var newTop = initialY + deltaY;
        // 画像の座標を更新
        catImage.style.left = newLeft + 'px';
        catImage.style.top = newTop + 'px';

        // 画像がウィンドウの外に出ないように制限
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (windowWidth - 100 < newLeft) newLeft = windowWidth - 100;
        if (windowHeight - 100 < newTop) newTop = windowHeight - 100;
      }
    };

    var touchEndHandler = function () {
      isDragging = false;
      catImage.style.cursor = 'grab';
      catImage.src = tmpCatImageRef;
    };

    // 位置を制限する関数
    function getLimitedTransform(transform) {
      var translateValues = transform.match(/-?\d+px/g);
      if (!translateValues || translateValues.length !== 2) {
        // マッチしなかった場合はデフォルト値を設定
        return transform;
      }

      translateValues = translateValues.map(value => parseInt(value, 10));
      var translateX = translateValues[0];
      var translateY = translateValues[1];

      var limitedX = translateX;
      var limitedY = translateY;

      if (translateX + initialX < 0) limitedX = -initialX;
      if (translateY + initialY < 0) limitedY = -initialY;
      if (translateX + initialX + catImage.offsetWidth > windowWidth) limitedX = windowWidth - catImage.offsetWidth - initialX;
      if (translateY + initialY + catImage.offsetHeight > windowHeight) limitedY = windowHeight - catImage.offsetHeight - initialY;

      return `translate(${limitedX}px, ${limitedY}px)`;
    }

    // 初期位置を取得
    initialX = catImage.offsetLeft;
    initialY = catImage.offsetTop;

    // 画像を左端から動かす
    var keyframes = [
      { transform: getLimitedTransform('translate(0px, 0px)'), offset: 0 },
      { transform: getLimitedTransform('translate(100px, -100px)'), offset: 0.02 },
      { transform: getLimitedTransform('translate(100px, -100px)'), offset: 0.15 },
      { transform: getLimitedTransform('translate(0px, -200px)'), offset: 0.17 },
      { transform: getLimitedTransform('translate(0px, -200px)'), offset: 0.30 },
      { transform: getLimitedTransform('translate(-200px, 0px)'), offset: 0.32 },
      { transform: getLimitedTransform('translate(-200px, 0px)'), offset: 0.45 },
      { transform: getLimitedTransform('translate(0px, 200px)'), offset: 0.47 },
      { transform: getLimitedTransform('translate(0px, 200px)'), offset: 0.60 },
      { transform: getLimitedTransform('translate(100px, 100px)'), offset: 0.62 },
      { transform: getLimitedTransform('translate(100px, 100px)'), offset: 0.75 },
      { transform: getLimitedTransform('translate(0px, 0px)'), offset: 0.77 }
    ];

    const animation = catImage.animate(keyframes,
      {
        fill: 'forwards',
        duration: 200000,
        iterations: Infinity,
      }
    );

    // // アニメーションの進行に応じて画像を変更する関数
    // function updateImage(percentage) {
    //   const imageIndex = Math.floor(percentage * imageSources.length);
    //   console.log(imageIndex);
    //   catImage.src = imageSources[imageIndex];
    // }

    // // アニメーションの進行に応じて画像を更新
    // function updateProgress() {
    //   const currentTime = animation.currentTime;
    //   const duration = animation.effect.getComputedTiming().duration;
    //   let percentage = currentTime / duration;
    //   if (percentage > 1) percentage = 0;
    //   updateImage(percentage);
    // }

    // // アニメーションの進行状況を定期的にチェック
    // setInterval(updateProgress, 100);

    // // アニメーションが開始したときに初期画像を設定
    // updateImage(0);

    catImage.addEventListener('touchstart', touchStartHandler);
    catImage.addEventListener('touchmove', touchMoveHandler);
    catImage.addEventListener('touchend', touchEndHandler);
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  await displayCatsFromLastFourDays();
  movePicture();
});