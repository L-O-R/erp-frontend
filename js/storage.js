// login logic

export const user_logged_in = localStorage.getItem("logIn")

// inventory logic
export let InventoryData = JSON.parse(localStorage.getItem("InventoryData")) || [];

export let SalesData = JSON.parse(localStorage.getItem("SalesData")) || [];