import Inventory from "./classes/inventoryClasses.js";
import { InventoryData } from "./storage.js";



const addProductBtn = document.getElementById("addProductBtn");
const addProductDialog = document.getElementById("addProductDialog");
const closeAddProductDialog = document.getElementById("closeAddProductDialog");
const addProductForm = document.getElementById("addProductForm");
const inventory_tableBody = document.getElementById("inventory_tableBody");
const table_template = document.getElementById("table_template");

addProductBtn.addEventListener("click", () => {
    addProductDialog.showModal();
});

closeAddProductDialog.addEventListener("click", () => {
    addProductDialog.close();
});


addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = new Date().getTime();
    const productName = e.target[0].value;
    const productCategory = e.target[1].value;
    const productPrice = e.target[2].value;
    const productQuantity = e.target[3].value;
    let productStatus = "In Stock";
    if (productQuantity > 10) {
        productStatus = "In Stock";
    } else if (productQuantity >= 1 && productQuantity < 10) {
        productStatus = "Low Stock";
    }
    else {
        productStatus = "Out of Stock";
    }
    const currentTimeStamp = new Date()
    const inventory = new Inventory(id, productName, productCategory, productPrice, productQuantity, productStatus, currentTimeStamp);
    InventoryData.push(inventory);
    localStorage.setItem("InventoryData", JSON.stringify(InventoryData));
    addProductDialog.close();
    rendenter_inventory_data(InventoryData)
    addProductForm.reset();
})

//  not lets render the data

function rendenter_inventory_data(data) {
    inventory_tableBody.innerHTML = "";
    data.forEach((inventory) => {
        const table_row = table_template.content.cloneNode(true);
        const td = table_row.querySelectorAll("td");

        td[0].textContent = inventory.productName;
        td[1].textContent = inventory.productCategory;
        td[2].textContent = inventory.productPrice;
        td[3].textContent = inventory.productQuantity;
        td[4].textContent = inventory.productStatus;
        td[5].innerHTML = `<button id='edit_${inventory.id}' ">Edit</button><button id ="delete_${inventory.id}">Delete</button>`;
        inventory_tableBody.appendChild(table_row);
        document.getElementById(`edit_${inventory.id}`).addEventListener("click", () => editProduct(inventory.id));
        document.getElementById(`delete_${inventory.id}`).addEventListener("click", () => deleteProduct(inventory.id));
    })
}

function editProduct(id) {
    const inventory = InventoryData.find((inventory) => inventory.id === id);
    addProductDialog.showModal();
    addProductForm[0].value = inventory.productName;
    addProductForm[1].value = inventory.productCategory;
    addProductForm[2].value = inventory.productPrice;
    addProductForm[3].value = inventory.productQuantity;

    // addProductForm.reset();
}

function deleteProduct(id) {
    alert("Product deleted successfully");
    let newInventoryData = InventoryData.filter((inventory) => inventory.id !== id);
    localStorage.setItem("InventoryData", JSON.stringify(newInventoryData));
    InventoryData = newInventoryData;
    rendenter_inventory_data(newInventoryData);
}


rendenter_inventory_data(InventoryData);
