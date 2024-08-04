// import { storage } from "./firebase-config.js";
// import { ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

// // Firebase Storageから画像を取得して表示する関数
// async function getImagesFromStorage() {
//   const imagesRef = ref(storage, "photos/");
//   try {
//     const result = await listAll(imagesRef);
//     if (result.items.length === 0) {
//       console.log("No images found in the photos folder.");
//       return;
//     }
//     result.items.forEach(async (imageRef) => {
//       const url = await getDownloadURL(imageRef);
//       const img = document.createElement("img");
//       img.src = url;
//       img.alt = "Firebase Storage Image";
//       img.style.width = "100px"; // 任意のスタイルを設定
//       document.querySelector(".setting-container").appendChild(img); // 画像を表示する場所に合わせて変更
//     });
//   } catch (error) {
//     console.error("Error fetching images:", error);
//   }
// }

// // ページロード時に画像を取得して表示
// document.addEventListener("DOMContentLoaded", async () => {
//   await getImagesFromStorage();
// });
