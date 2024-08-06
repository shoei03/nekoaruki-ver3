# ねこあるき

運動不足な人の支援するアプリ
ターゲット：歩きたいがその一歩を踏み出せない人

アプリ概要
歩く習慣をつけながら新しい猫と出会えるウォーキングアプリ
毎日、アプリ内の猫と出会うために目標移動距離を設けて歩き続け、
習慣化させることを目指す。そして「歩く動機付け」を提供することを目的とする。


## 目次

- [使用方法](#使用方法)
- [ディレクトリ構造](#ディレクトリ構造)
- [連絡先](#連絡先)


## 使用方法

こちらのURLにアクセス
https://nekoaruki-ver3.web.app

URLにアクセスすると、ログイン画面へ強制的に遷移する。
ログイン or サインアップが完了するとホーム画面へ遷移する。
ログインすると、歩数をカウント、歩数の設定、写真の撮影が行えるようになる。

##ディレクトリ構造
└─.firebase
└─node_modules
└─public
    │  404.html
    │  collection.html
    │  goal-setting.html
    │  index.html
    │  login.html
    │  manifest.json
    │  notification-setting.html
    │  walking.html
    │
    ├─scripts
    │      auth.js
    │      db-collection.js
    │      db-get-notification.js
    │      db-set-goalsteps.js
    │      db-set-notification.js
    │      displayTodaysCat.js
    │      firebase-config.js
    │      getCurrentUserId.js
    │      hamburger.js
    │      movePicture.js
    │      pedometer.js
    │      permission.js
    │      takePicture.js
    │
    ├─src
    │      add.png
    │      arrow_back.png
    │      arrow_forward.png
    │      backspace.png
    │      camera.png
    │      change.png
    │      delete.png
    │      edit.png
    │      haikei_reiyasita.png
    │      haikei_reiyaue.png
    │      nekoaruki_haiiro_amae.png
    │      nekoaruki_haiiro_aruki.png
    │      nekoaruki_haiiro_ikari.png
    │      nekoaruki_haiiro_nobi.png
    │      nekoaruki_haiiro_tobi.png
    │      nekoaruki_haiiro_tsukami.png
    │      nekoaruki_logo.png
    │      nekoaruki_mike_nekorobi.png
    │      nekoaruki_siro_tobi.png
    │      photo_camera.png
    │      わだにゃん.png
    │
    └─styles
            setting.css
            style.css
    .firebaserc
    .gitignore
    firebase.json
    package-lock.json
    package.json
    README.md


##　連絡先
学生番号   :60276296
氏名      :吉田 将衛
メールアドレス :s276296@wakayama-u.ac.jp