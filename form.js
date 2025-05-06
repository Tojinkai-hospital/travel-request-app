// フォーム読み込み時：氏名・所属を GAS 経由で取得
window.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    alert("ログイン情報が見つかりません。ログイン画面からやり直してください。");
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbxtMugJd-xzSto6mMtINRSYtbfG7g6l6i10EoWvHSkVmp4_BrBSjHPZAd_uqO9Khamu/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `id=${userId}`
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("name-display").value = data.name || "未登録";
      document.querySelector('input[name="department"]').value = data.department || "";
    })
    .catch(err => {
      console.error("GAS通信エラー:", err);
    });
});

// フォーム送信時：FormDataを使って送信（ファイル添付対応）
document.getElementById("request-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form); // フォーム要素全体をFormDataに変換

  // ログインユーザーIDを追加（localStorageから）
  formData.append("user_id", localStorage.getItem("user_id") || "未ログイン");

  // Google Apps Scriptへ送信
  fetch("https://script.google.com/macros/s/＜ここに本番GASのURL＞/exec", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      console.log("GASからの応答:", result);
      alert("✅ 申請が送信されました！");
    })
    .catch((err) => {
      console.error("送信エラー:", err);
      alert("❌ 送信中にエラーが発生しました");
    });
});
