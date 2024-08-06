import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

// 強力なユーザー入力のサニタイズ
const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
};

// パスワードの強度チェック
const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

// サインアップ機能
const signupButton = document.getElementById('signup-button');
if (signupButton) {
  signupButton.addEventListener('click', async () => {
    const email = sanitizeInput(document.getElementById("signup-email").value);
    const password = sanitizeInput(document.getElementById("signup-password").value);

    if (!isStrongPassword(password)) {
      alert('パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含む必要があります。');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 目標歩数の初期設定
      const userId = userCredential.user.uid;
      const goalDocs = await doc(db, 'users', userId);
      await setDoc(goalDocs, { firstGoal: 1000, secondGoal: 3000 });
      // ホームページにリダイレクト
      window.location.href = "index.html";
    } catch (error) {
      alert('サインアップエラーが発生しました。'); // 一般化されたメッセージを表示
    }
  });
}

// ログイン機能
const loginButton = document.getElementById('login-button');
if (loginButton) {
  loginButton.addEventListener('click', async () => {
    const email = sanitizeInput(document.getElementById("signin-email").value);
    const password = sanitizeInput(document.getElementById("signin-password").value);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (error) {
      alert('ログインエラーが発生しました。'); // 一般化されたメッセージを表示
    }
  });
}

// ログアウト機能
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    try {
      await signOut(auth);
      // ログアウト成功
      window.location.href = "login.html"; // ログインページにリダイレクト
    } catch (error) {
      alart("ログアウトエラー", error);
    }
  });
}

// ユーザーのログイン状態の監視
const authContainer = document.querySelectorAll('.auth-container');
document.addEventListener('DOMContentLoaded', async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      logoutButton.style.display = 'block'; // ログアウトボタンを表示
      authContainer.forEach((container) => {
        container.style.display = 'none'; // ログインフォームを非表示
      });
    } else {
      logoutButton.style.display = 'none'; // ログアウトボタンを非表示
      authContainer.forEach((container) => {
        container.style.display = 'block'; // ログインフォームを表示
      });
    }
  });
});
