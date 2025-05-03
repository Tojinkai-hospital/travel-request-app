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

// フォーム送信時：全データをまとめてコンソールに出力（仮送信）
document.getElementById("request-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {};
  const form = e.target;

  for (let element of form.elements) {
    if (element.name) {
      if (element.type === "checkbox") {
        // チェックボックスで name に [] が付いているものを配列として収集
        const baseName = element.name.replace(/\[\]$/, "");
        if (!data[baseName]) data[baseName] = [];
        if (element.checked) data[baseName].push(element.value);
      } else {
        data[element.name] = element.value;
      }
    }
  }

  data["user_id"] = localStorage.getItem("user_id") || "未ログイン";

  console.log("申請データ：", data);
  alert("✅ 申請データをコンソールに出力しました（仮送信）");
});
