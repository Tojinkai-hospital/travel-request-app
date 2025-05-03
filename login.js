const commonPassword = "Tojinkai2025!";

document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = e.target.id.value;
  const password = e.target.password.value;

  if (password === commonPassword) {
    localStorage.setItem("user_id", id);
    window.location.href = "form.html";
  } else {
    document.getElementById("error").textContent = "パスワードが違います";
  }
});
