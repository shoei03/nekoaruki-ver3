document.addEventListener('DOMContentLoaded', (event) => {
  const popupButton = document.getElementById('popupButton');
  const closeButton = document.getElementById('closeButton');
  const popup = document.getElementById('popup');
  const popupOverlay = document.getElementById('popupOverlay');

  // ボタンがクリックされたときにポップアップを表示
  popupButton.addEventListener('click', () => {
      closeButton.style.display = 'block';
      popupButton.style.display = 'none';
      popup.style.display = 'block';
      popupOverlay.style.display = 'block';
  });

  // 閉じるボタンがクリックされたときにポップアップを非表示
  closeButton.addEventListener('click', () => {
      popupButton.style.display = 'block';
      closeButton.style.display = 'none';
      popup.style.display = 'none';
      popupOverlay.style.display = 'none';
  });

  // オーバーレイがクリックされたときにポップアップを非表示
  popupOverlay.addEventListener('click', () => {
      popupButton.style.display = 'block';
      closeButton.style.display = 'none';
      popup.style.display = 'none';
      popupOverlay.style.display = 'none';
  });
});
