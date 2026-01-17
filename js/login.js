import { user_logged_in } from "./storage.js"

const username = 'admin'
const password = 'admin123'

if (user_logged_in) {
    window.location.href = 'index.html'
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm')
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const given_username = e.target[0].value
        const given_password = e.target[1].value
        if (given_username === username && given_password === password) {
            localStorage.setItem('logIn', true)
            window.location.href = 'index.html'
        } else {
            alert('Invalid username or password')
        }
    })
})
