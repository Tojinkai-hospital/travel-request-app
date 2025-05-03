document.getElementById("request-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {};
  const form = e.target;
  for (let element of form.elements) {
    if (element.name) {
      if (element.type === "checkbox") {
        data[element.name] = element.checked;
      } else {
        data[element.name] = element.value;
      }
    }
  }
  data["user_id"] = localStorage.getItem("user_id") || "未ログイン";
  console.log("申請データ：", data);
  alert("申請データをコンソールに出力しました（仮送信）");
});
