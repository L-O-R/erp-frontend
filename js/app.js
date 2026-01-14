import { user_logged_in } from "./storage.js";


if (!user_logged_in) {
    window.location.href = 'login.html'
}
