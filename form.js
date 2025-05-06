// ===== 1. 職員情報の取得 =====
window.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    alert("ログイン情報が見つかりません。ログイン画面からやり直してください。");
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbyERge-EXeB49nYIWg-IVHqqk7O8I8BsumkR--BKkjIyVi96Yu3-dJ4p_u1PBeMCWoa1g/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

// ===== 2. フォーム送信処理（multipart/form-data） =====
document.getElementById("request-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // ユーザーIDを追加
  const userId = localStorage.getItem("user_id") || "未ログイン";
  formData.set("user_id", userId);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbztwRN0T341BfKMccchvYXXiAaYLz-lzopU5XRD3MZEJwSpb9yI9MMiKB9XVyXajD2B/exec", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success") {
      alert(`✅ 申請が送信されました！ID: ${result.id}`);
      form.reset();
    } else {
      alert("❗️送信に失敗しました：" + JSON.stringify(result));
    }
  } catch (err) {
    console.error("❌ 送信エラー:", err);
    alert("❌ 通信に失敗しました。再度お試しください。");
  }
});
