/**
 * Inventory Management Module
 * This script handles the CRUD operations for the product inventory, including
 * adding, editing, deleting, and searching products. It persists data to localStorage.
 */

// ============================================================================
// IMPORTS
// ============================================================================

import Inventory from "./classes/inventoryClasses.js";
import { InventoryData } from "./storage.js";

// ============================================================================
// DOM ELEMENT REFERENCES
// ============================================================================

const addProductBtn = document.getElementById("addProductBtn");
const addProductDialog = document.getElementById("addProductDialog");
const closeAddProductDialog = document.getElementById("closeAddProductDialog");
const addProductForm = document.getElementById("addProductForm");
const inventory_tableBody = document.getElementById("inventory_tableBody");
const inventory_summary = document.getElementById("inventory_summary");
const table_template = document.getElementById("table_template");
const searchInput = document.getElementById("search");
const emptyState = document.getElementById("emptyState");
const exportCsvBtn = document.querySelector(".dashboard_main__inventory__header button:first-child");

// Tracking current edit state to prevent multiple simultaneous edits
let currentEditingRow = null;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates product status based on quantity
 * @param {number} quantity - The current quantity of the product
 * @returns {string} - The status string (In Stock, Low Stock, or Out of Stock)
 */
function getProductStatus(quantity) {
    const qty = parseInt(quantity);
    if (qty > 10) return "In Stock";
    if (qty >= 1) return "Low Stock";
    return "Out of Stock";
}

/**
 * Maps status strings to CSS classes for styling badges
 * @param {string} status - The status string
 * @returns {string} - The relevant CSS class name
 */
function getStatusClass(status) {
    const map = {
        "In Stock": "status-in-stock",
        "Low Stock": "status-low-stock",
        "Out of Stock": "status-out-of-stock"
    };
    return map[status] || "";
}

// ============================================================================
// CORE LOGIC - DATA RENDERING
// ============================================================================

/**
 * Renders the inventory table based on the provided data array
 * @param {Array} data - The array of inventory objects to display
 */
function renderInventory(data) {
    // Clear the current table body
    inventory_tableBody.innerHTML = "";

    // Toggle empty state visibility
    if (data.length === 0) {
        emptyState.style.display = "flex";
    } else {
        emptyState.style.display = "none";
    }

    // Populate rows from data
    data.forEach((inventory) => {
        const table_row = table_template.content.cloneNode(true);
        const tr = table_row.querySelector("tr");
        tr.setAttribute("data-id", inventory.id);

        const td = table_row.querySelectorAll("td");

        // Populate table cells with product details
        td[0].textContent = inventory.productName;
        td[1].textContent = inventory.productCategory;
        td[2].textContent = `${inventory.productPrice}`;
        td[3].textContent = inventory.productQuantity;

        // Render status as a stylized badge
        const statusClass = getStatusClass(inventory.productStatus);
        td[4].innerHTML = `<span class="status-badge ${statusClass}">${inventory.productStatus}</span>`;

        // Action buttons container
        td[5].innerHTML = `
            <button id='edit_${inventory.id}' class="action-btn-edit">Edit</button>
            <button id ="delete_${inventory.id}" class="action-btn-delete">Delete</button>
        `;

        inventory_tableBody.appendChild(table_row);

        // Attach event listeners to newly created action buttons
        document.getElementById(`edit_${inventory.id}`).addEventListener("click", () => editProduct(inventory.id));
        document.getElementById(`delete_${inventory.id}`).addEventListener("click", () => deleteProduct(inventory.id));
    });

    // Update the results summary text
    inventory_summary.textContent = `Showing ${data.length} of ${InventoryData.length} products`;
}

// ============================================================================
// PRODUCT CRUD OPERATIONS
// ============================================================================

/**
 * Handles the creation of a new product from the form submission
 */
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect data using FormData for robustness
    const formData = new FormData(addProductForm);
    const productName = document.getElementById("productName").value;
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const quantity = document.getElementById("quantity").value;

    const id = Date.now();
    const status = getProductStatus(quantity);
    const timestamp = new Date();

    const newInventoryItem = new Inventory(
        id,
        productName,
        category,
        parseFloat(price),
        parseInt(quantity),
        status,
        timestamp
    );

    // Update data source and persistence
    InventoryData.push(newInventoryItem);
    localStorage.setItem("InventoryData", JSON.stringify(InventoryData));

    // UI Cleanup
    addProductDialog.close();
    addProductForm.reset();
    renderInventory(InventoryData);
});

/**
 * Initiates the inline edit mode for a specific product row
 * @param {number} id - The unique ID of the product to edit
 */
function editProduct(id) {
    if (currentEditingRow && currentEditingRow !== id) {
        cancelEdit();
    }

    const inventory = InventoryData.find(item => item.id === id);
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const cells = row.querySelectorAll("td");

    currentEditingRow = id;

    // Transform cells into input fields
    cells[0].innerHTML = `<input type="text" value="${inventory.productName}" id="edit_name_${id}">`;
    cells[1].innerHTML = `
        <select id="edit_category_${id}">
            <option value="electronics" ${inventory.productCategory === "electronics" ? "selected" : ""}>Electronics</option>
            <option value="accessories" ${inventory.productCategory === "accessories" ? "selected" : ""}>Accessories</option>
            <option value="software" ${inventory.productCategory === "software" ? "selected" : ""}>Software</option>
            <option value="hardware" ${inventory.productCategory === "hardware" ? "selected" : ""}>Hardware</option>
            <option value="services" ${inventory.productCategory === "services" ? "selected" : ""}>Services</option>
        </select>
    `;
    cells[2].innerHTML = `<input type="number" step="0.01" value="${inventory.productPrice}" id="edit_price_${id}">`;
    cells[3].innerHTML = `<input type="number" value="${inventory.productQuantity}" id="edit_quantity_${id}">`;
    cells[4].innerHTML = `<input type="text" value="${inventory.productStatus}" disabled id="edit_status_${id}">`;

    // Update action buttons to Save/Cancel
    cells[5].innerHTML = `
        <button id='update_${id}'>Update</button>
        <button id="cancel_${id}">Cancel</button>
    `;

    document.getElementById(`update_${id}`).addEventListener("click", () => updateProduct(id));
    document.getElementById(`cancel_${id}`).addEventListener("click", () => cancelEdit());
}

/**
 * Validates and saves changes made during inline editing
 * @param {number} id - The ID of the product being updated
 */
function updateProduct(id) {
    const newName = document.getElementById(`edit_name_${id}`).value;
    const newCategory = document.getElementById(`edit_category_${id}`).value;
    const newPrice = document.getElementById(`edit_price_${id}`).value;
    const newQuantity = document.getElementById(`edit_quantity_${id}`).value;

    if (!newName || !newPrice || !newQuantity) {
        alert("Please fill in all required fields.");
        return;
    }

    const index = InventoryData.findIndex(item => item.id === id);
    if (index !== -1) {
        InventoryData[index].productName = newName;
        InventoryData[index].productCategory = newCategory;
        InventoryData[index].productPrice = parseFloat(newPrice);
        InventoryData[index].productQuantity = parseInt(newQuantity);
        InventoryData[index].productStatus = getProductStatus(newQuantity);

        localStorage.setItem("InventoryData", JSON.stringify(InventoryData));
        currentEditingRow = null;
        renderInventory(InventoryData);
    }
}

/**
 * Exits edit mode and restores the table state
 */
function cancelEdit() {
    currentEditingRow = null;
    renderInventory(InventoryData);
}

/**
 * Removes a product from the inventory after confirmation
 * @param {number} id - The ID of the product to delete
 */
function deleteProduct(id) {
    const confirmed = confirm("Are you sure you want to delete this product? This action cannot be undone.");

    if (confirmed) {
        const index = InventoryData.findIndex(item => item.id === id);
        if (index !== -1) {
            InventoryData.splice(index, 1);
            localStorage.setItem("InventoryData", JSON.stringify(InventoryData));
            renderInventory(InventoryData);
        }
    }
}

// ============================================================================
// SEARCH AND EXPORT
// ============================================================================

/**
 * Filters the inventory table based on the search query
 */
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredData = InventoryData.filter(item =>
        item.productName.toLowerCase().includes(query) ||
        item.productCategory.toLowerCase().includes(query)
    );
    renderInventory(filteredData);
});

/**
 * Export current inventory data to a CSV file
 */
exportCsvBtn.addEventListener("click", () => {
    if (InventoryData.length === 0) {
        alert("No data available to export.");
        return;
    }

    const headers = ["ID", "Name", "Category", "Price", "Quantity", "Status", "Date Added"];
    const csvContent = [
        headers.join(","),
        ...InventoryData.map(item => [
            item.id,
            `"${item.productName}"`,
            `"${item.productCategory}"`,
            item.productPrice,
            item.productQuantity,
            item.productStatus,
            new Date(item.currentTimeStamp).toLocaleDateString()
        ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// ============================================================================
// DIALOG CONTROLS
// ============================================================================

addProductBtn.addEventListener("click", () => {
    addProductDialog.showModal();
});

closeAddProductDialog.addEventListener("click", () => {
    addProductDialog.close();
});

// Close dialog when clicking on the backdrop
addProductDialog.addEventListener("click", (e) => {
    if (e.target === addProductDialog) {
        addProductDialog.close();
    }
});

// ============================================================================
// INITIALIZATION
// ============================================================================

// Perform initial render on page load
renderInventory(InventoryData);
