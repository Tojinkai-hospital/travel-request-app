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

// フォーム送信時：iframe 経由でGASにPOST（CORS回避）
document.getElementById("request-form").addEventListener("submit", function (e) {
  const userId = localStorage.getItem("user_id") || "未ログイン";
  document.getElementById("user-id-hidden").value = userId;

  // 通信完了を検知するための監視処理
  const iframe = document.getElementById("hidden_iframe");
  iframe.onload = function () {
    alert("✅ 申請が送信されました！");
    e.target.reset();
    iframe.onload = null; // 重複防止
  };
});
