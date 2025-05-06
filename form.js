// ===== 1. 職員情報の取得 =====
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

// ===== 2. 送信処理（iframe経由・状態管理付き） =====
let submissionInProgress = false;

document.getElementById("request-form").addEventListener("submit", function (e) {
  const userId = localStorage.getItem("user_id") || "未ログイン";
  document.getElementById("user-id-hidden").value = userId;

  submissionInProgress = true;
});

// ===== 3. iframeで送信完了を検知 =====
document.getElementById("hidden_iframe").onload = function () {
  if (submissionInProgress) {
    alert("✅ 申請が送信されました！");
    document.getElementById("request-form").reset();
    submissionInProgress = false;
  }
};
