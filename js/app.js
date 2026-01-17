// ============================================================================
// IMPORTS SECTION
// ============================================================================

// Import the user_logged_in value from storage.js
// This value is either the stored login state from localStorage or null/undefined if not logged in
import { user_logged_in } from "./storage.js";


// ============================================================================
// AUTHENTICATION CHECK - REDIRECT IF NOT LOGGED IN
// ============================================================================

// Check if the user is NOT logged in
// The ! operator negates the value, so if user_logged_in is null, undefined, or false, this runs
if (!user_logged_in) {
  // Redirect the user to the login page
  // This prevents unauthorized access to protected pages
  // When this executes, the browser navigates to login.html
  window.location.href = "login.html";
}
// NOTE: If user IS logged in, this block is skipped and the page loads normally


// ============================================================================
// LOGOUT FUNCTIONALITY
// ============================================================================

// Get a reference to the logout button element by its ID
// This button is expected to be present in the HTML (e.g., in the sidebar footer)
const logOutBtn = document.getElementById("logOutBtn");

// POTENTIAL ISSUE: If this script runs on a page that doesn't have a logout button,
// logOutBtn will be null, and the next line will cause an error:
// "Cannot read property 'addEventListener' of null"
// Should add a check: if (logOutBtn) { ... }


// Add a click event listener to the logout button
logOutBtn.addEventListener("click", () => {
  // Remove the "logIn" item from localStorage
  // This clears the user's login state, effectively logging them out
  localStorage.removeItem("logIn");

  // Redirect the user to the login page
  // After clearing the login state, send them back to login
  window.location.href = "login.html";
});
// When this event fires: localStorage is cleared → user is redirected to login page