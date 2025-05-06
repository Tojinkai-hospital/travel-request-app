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

// ===== 2. fetch + FormData で送信処理 =====
document.getElementById("request-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // デフォルト送信をブロック

  const form = e.target;
  const formData = new FormData(form);

  // user_id を手動でFormDataに追加
  const userId = localStorage.getItem("user_id") || "未ログイン";
  formData.set("user_id", userId);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxbTA8qdimwfRCfe7Xo9pUKEB9AZXQC8TsyiwG5xdVDDYr1qOSvNyT6cWSCIQDFd-C7/exec", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    if (result.status === "success") {
      alert(`✅ 申請が送信されました！ID: ${result.id}`);
      form.reset();
    } else {
      alert("❗️送信に失敗しました：" + JSON.stringify(result));
    }

  } catch (error) {
    console.error("送信エラー:", error);
    alert("❌ 通信に失敗しました。再度お試しください。");
  }
});
