import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

const getCurrentUserId = () => {
  return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
          if (!user) {
              reject('ユーザーがログインしていません。');
              window.location.href = './login.html';
          } else {
              resolve(user.uid);
          }
      })
  })
}

export { getCurrentUserId };