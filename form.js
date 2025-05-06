// フォーム読み込み時：氏名・所属を GAS 経由で取得
window.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    alert("ログイン情報が見つかりません。ログイン画面からやり直してください。");
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbzIiymkLd-xEGqaHOXUwGd2EEvuPNMEkyaQF2GKxCy0Ie0zTbOe3T_SZRKf2riDSXY/exec", {
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

// フォーム送信時：FormData を使って GAS にPOST（ファイル付き）
document.getElementById("request-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // ログインユーザーIDを付加
  formData.append("user_id", localStorage.getItem("user_id") || "未ログイン");

  fetch("https://script.google.com/macros/s/AKfycbyeU7W7r5MbDOzJg1annd-sZj2JiDmBPqSACKqVoTZMOf01Fii9r-m0mNtTA-8BSKY/exec", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      console.log("📦 GAS応答:", data);
      alert("✅ 申請が送信されました！申請ID: " + data.id);
      form.reset(); // 入力リセット
    })
    .catch(err => {
      console.error("❌ 送信エラー:", err);
      alert("送信に失敗しました。GASのURLやネットワークを確認してください。");
    });
});
