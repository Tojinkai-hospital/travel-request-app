// ===== 1. ユーザー情報の取得（ログイン後、氏名・所属を自動入力） =====
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


// ===== 2. 出張申請送信処理（ファイル→データの2ステップ構成） =====

// アップロード先エンドポイント
const uploadURL = "https://script.google.com/macros/s/AKfycbzSrEWsN_lX59leWe2Eq4D5UoiQNyjvIa0qCC-DPYRH9KrwPuY5qwZuZkM0o6qzV4ns/exec";
// データ保存先エンドポイント
const submitURL = "https://script.google.com/macros/s/AKfycbyYfxl1TAfYyuQiT89xuzr77UqTgMsLcveexRkwm2qvRl239MaC3jTbC6Gpomz8qSWC/exec";

document.getElementById("request-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const userId = localStorage.getItem("user_id") || "未ログイン";
  formData.set("user_id", userId);

  // ===== ① ファイルアップロード処理（base64） =====
  const fileInputs = ["file1", "file2", "file3"];
  const fileBlobs = [];

  for (let name of fileInputs) {
    const file = form.querySelector(`input[name="${name}"]`).files[0];
    if (file) {
      const base64 = await toBase64(file);
      fileBlobs.push({
        name: file.name,
        mimeType: file.type,
        content: base64
      });
    }
  }

  let fileUrls = [];
  if (fileBlobs.length > 0) {
    try {
      const uploadRes = await fetch(uploadURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `blobs=${encodeURIComponent(JSON.stringify(fileBlobs))}`
      });
      const uploadJson = await uploadRes.json();
      fileUrls = uploadJson.urls || [];
    } catch (err) {
      alert("❌ 添付ファイルのアップロードに失敗しました。");
      console.error("Upload error:", err);
      return;
    }
  }

  // ===== ② スプレッドシートへの申請データ送信 =====
  formData.set("file_urls", fileUrls.join(", "));

  try {
    const submitRes = await fetch(submitURL, {
      method: "POST",
      body: formData
    });

    const result = await submitRes.json();
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


// ===== 3. base64変換ユーティリティ関数 =====
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // base64部分のみ取り出す
    reader.onerror = error => reject(error);
  });
}
