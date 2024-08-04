// 画像ファイルのパスを含む配列
const catImages = [
  'src/わだにゃん.png',
  'src/nekoaruki_haiiro_ikari.png',
  'src/nekoaruki_haiiro_tobi.png',
  'src/nekoaruki_haiiro_amae.png',
  'src/nekoaruki_haiiro_nobi.png',
  'src/nekoaruki_mike_nekorobi.png',
  'src/nekoaruki_siro_tobi.png',
  // 他の画像ファイルのパスを追加
];
export { catImages };

let catImageURL = '';
// 画像をランダムに表示する
document.addEventListener('DOMContentLoaded', async () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;
  // 年月日を基にしたシード値を生成
  const seed = yyyy * 10000 + (mm + 1) * 100 + dd;
  // シード値を基にして乱数を生成（疑似的な方法）
  const pseudoRandom = Math.abs(Math.sin(seed)) * 10000 % 1;
  // 乱数を基にして配列のインデックスを決定
  const index = Math.floor(pseudoRandom * catImages.length);
  const selectedImage = catImages[index];

  // ねこを画面に表示する
  const catImageElement = document.querySelector('.todays-cat img');
  if (catImageElement) {
    catImageElement.src = selectedImage;
  }

  catImageURL = selectedImage;
});

export { catImageURL };
