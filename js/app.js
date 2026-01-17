import { user_logged_in } from "./storage.js";

if (!user_logged_in) {
  window.location.href = "login.html";
}

const logOutBtn = document.getElementById("logOutBtn");


logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("logIn");
  window.location.href = "login.html";
});