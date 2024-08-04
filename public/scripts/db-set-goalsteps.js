import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const getCurrentUserId = () => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                reject('ユーザーがログインしていません。');
                window.location.href = '../login.html';
            } else {
                resolve(user.uid);
            }
        })
    })
}

const showGoalSteps = async (goalDocs) => {
    try {
        const docSnap = await getDoc(goalDocs);
        if (!docSnap.exists()) return console.log('目標データが存在しません');

        const { firstGoal, secondGoal } = docSnap.data();
        document.querySelectorAll('.goal-steps').forEach((element, index) => {
            element.textContent = `${[firstGoal, secondGoal][index]}歩`;
            element.dataset.value = [firstGoal, secondGoal][index];
        });
    } catch (error) {
        console.error('目標歩数の取得中にエラーが発生しました:', error);
    }
};

const editGoal = (element) => {
    const currentValue = element.dataset.value;
    element.innerHTML = `<input type="number" value="${currentValue}" class="form-control form-control-lg" min="1000" step="100">`;
    const input = element.querySelector('input');
    input.focus();
    return input;
};

const updateGoal = async (element, newValue) => {
    element.textContent = `${newValue}歩`;
    element.dataset.value = newValue;
};

const saveGoal = async (goalDocs, ...goals) => {
    try {
        await setDoc(goalDocs, { firstGoal: goals[0], secondGoal: goals[1] });
        console.log('目標が正常に保存されました');
    } catch (error) {
        console.error('目標の保存中にエラーが発生しました:', error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // Firestoreからデータを取得
    const userId = await getCurrentUserId();
    const goalDocs = await doc(db, 'users', userId);
    // 目標歩数を表示
    showGoalSteps(goalDocs);

    // 目標歩数を編集
    document.addEventListener('click', (event) => {
        const goalSteps = document.querySelectorAll('.goal-steps');
        if (event.target.classList.contains('goal-steps')) {
            const index = Array.from(goalSteps).indexOf(event.target);
            const input = editGoal(goalSteps[index]);
            input.addEventListener('blur', async () => {
                // 目標歩数を更新
                updateGoal(goalSteps[index], input.value);
                // firestoreにデータを保存
                saveGoal(goalDocs, ...Array.from(goalSteps, el => parseInt(el.dataset.value)));
            });
        }
    });
});
