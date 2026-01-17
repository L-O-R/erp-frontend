// ============================================================================
// IMPORTS SECTION
// ============================================================================

// Import the Inventory class from the classes folder to create new inventory objects
import Inventory from "./classes/inventoryClasses.js";

// Import the InventoryData array from storage.js which holds all inventory items
// NOTE: This is imported as a regular import, which creates a reference to the exported value
import { InventoryData } from "./storage.js";


// ============================================================================
// DOM ELEMENT REFERENCES
// ============================================================================

// Get reference to the "Add Product" button that opens the dialog
const addProductBtn = document.getElementById("addProductBtn");

// Get reference to the dialog element (modal) that contains the add/edit product form
const addProductDialog = document.getElementById("addProductDialog");

// Get reference to the button that closes the add product dialog (the X button)
const closeAddProductDialog = document.getElementById("closeAddProductDialog");

// Get reference to the form element inside the dialog for adding products
const addProductForm = document.getElementById("addProductForm");

// Get reference to the table body where inventory rows will be inserted
const inventory_tableBody = document.getElementById("inventory_tableBody");

// Get reference to the HTML template element that contains the table row structure
const table_template = document.getElementById("table_template");


// ============================================================================
// EVENT LISTENERS FOR DIALOG CONTROLS
// ============================================================================

// Add click event listener to the "Add Product" button
addProductBtn.addEventListener("click", () => {
    // Open the dialog as a modal (blocking the rest of the page)
    addProductDialog.showModal();
});

// Add click event listener to the close button (X) in the dialog
closeAddProductDialog.addEventListener("click", () => {
    // Close the dialog modal
    addProductDialog.close();
});


// ============================================================================
// FORM SUBMISSION HANDLER - ADD NEW PRODUCT
// ============================================================================

// Add submit event listener to the product form
addProductForm.addEventListener('submit', (e) => {
    // Prevent the default form submission behavior (page reload)
    e.preventDefault();

    // Generate a unique ID using current timestamp in milliseconds
    const id = new Date().getTime();

    // Get product name from the first form input using array index
    // POTENTIAL ISSUE: Using array indices is fragile - if form order changes, this breaks
    const productName = e.target[0].value;

    // Get product category from the second form input (dropdown/select)
    const productCategory = e.target[1].value;

    // Get product price from the third form input
    // ISSUE: This is stored as a STRING, not a NUMBER - should use parseFloat() or Number()
    const productPrice = e.target[2].value;

    // Get product quantity from the fourth form input
    // ISSUE: This is stored as a STRING, not a NUMBER - should use parseInt() or Number()
    const productQuantity = e.target[3].value;

    // Initialize product status with default value
    let productStatus = "In Stock";

    // Determine product status based on quantity
    // MAJOR ISSUE: productQuantity is a STRING, so comparison with numbers will have unexpected behavior
    // For example: "5" > 10 is false (correct), but "100" > 10 is also true (works by accident)
    if (productQuantity > 10) {
        productStatus = "In Stock";
    } else if (productQuantity >= 1 && productQuantity < 10) {
        // This condition checks if quantity is between 1 and 9
        productStatus = "Low Stock";
    }
    else {
        // If quantity is 0 or less (or invalid)
        productStatus = "Out of Stock";
    }

    // Create a new Date object to store when this product was added
    // MISSING SEMICOLON at the end of this line
    const currentTimeStamp = new Date()

    // Create a new Inventory object using the collected data
    const inventory = new Inventory(id, productName, productCategory, productPrice, productQuantity, productStatus, currentTimeStamp);

    // Add the new inventory object to the InventoryData array
    // This modifies the array in memory
    InventoryData.push(inventory);

    // Save the updated InventoryData array to localStorage as a JSON string
    // This persists the data across browser sessions
    localStorage.setItem("InventoryData", JSON.stringify(InventoryData));

    // Close the dialog after successfully adding the product
    addProductDialog.close();

    // Re-render the entire inventory table to show the new product
    // NOTE: Function name has typo "rendenter" instead of "render"
    // MISSING SEMICOLON at the end of this line
    rendenter_inventory_data(InventoryData)

    // Reset the form fields to empty values for next use
    addProductForm.reset();
}) // MISSING SEMICOLON at the end of this event listener


// ============================================================================
// RENDER FUNCTION - DISPLAY INVENTORY DATA IN TABLE
// ============================================================================

// Comment has typo: "not lets" should be "now lets"
//  not lets render the data

// Function to render inventory data into the table
// NOTE: Function name is misspelled - should be "render_inventory_data" not "rendenter_inventory_data"
function rendenter_inventory_data(data) {
    // Clear all existing rows from the table body (removes old data)
    inventory_tableBody.innerHTML = "";

    // Loop through each inventory item in the data array
    data.forEach((inventory) => {
        // Clone the template content (creates a deep copy of the template structure)
        // The 'true' parameter means deep clone (includes all child nodes)
        const table_row = table_template.content.cloneNode(true);

        // Get all the <td> (table data) elements from the cloned row
        const td = table_row.querySelectorAll("td");

        // Set the text content of each table cell with inventory data
        td[0].textContent = inventory.productName;        // First column: Product Name
        td[1].textContent = inventory.productCategory;    // Second column: Category
        td[2].textContent = inventory.productPrice;       // Third column: Price
        td[3].textContent = inventory.productQuantity;    // Fourth column: Quantity
        td[4].textContent = inventory.productStatus;      // Fifth column: Status

        // Set the HTML content for the actions column with Edit and Delete buttons
        // ISSUE: Invalid HTML - there's an extra quotation mark after the id attribute: id='edit_${inventory.id}' "
        // This creates malformed HTML: <button id='edit_123' "> instead of <button id='edit_123'>
        td[5].innerHTML = `<button id='edit_${inventory.id}' ">Edit</button><button id ="delete_${inventory.id}">Delete</button>`;

        // Append the populated row to the table body (adds it to the DOM)
        inventory_tableBody.appendChild(table_row);

        // Add click event listener to the Edit button for this specific inventory item
        // Gets the button by its dynamically created ID and attaches the editProduct function
        document.getElementById(`edit_${inventory.id}`).addEventListener("click", () => editProduct(inventory.id));

        // Add click event listener to the Delete button for this specific inventory item
        // Gets the button by its dynamically created ID and attaches the deleteProduct function
        document.getElementById(`delete_${inventory.id}`).addEventListener("click", () => deleteProduct(inventory.id));
    })
}


// ============================================================================
// EDIT PRODUCT FUNCTION
// ============================================================================

// Function to edit an existing product by its ID
function editProduct(id) {
    // Find the inventory item with matching ID from the InventoryData array
    const inventory = InventoryData.find((inventory) => inventory.id === id);

    // Open the dialog to show the form
    addProductDialog.showModal();

    // Pre-fill the form fields with existing product data
    addProductForm[0].value = inventory.productName;      // Set product name
    addProductForm[1].value = inventory.productCategory;  // Set category
    addProductForm[2].value = inventory.productPrice;     // Set price
    addProductForm[3].value = inventory.productQuantity;  // Set quantity

    // MAJOR ISSUE: The edit functionality is INCOMPLETE!
}


// ============================================================================
// DELETE PRODUCT FUNCTION
// ============================================================================

// Function to delete a product by its ID
function deleteProduct(id) {
    // Show an alert message to the user
    // ISSUE: No confirmation dialog - product is deleted immediately without asking "Are you sure?"
    alert("Product deleted successfully");

    // Create a new array containing all inventory items EXCEPT the one with matching ID
    // The filter method creates a new array with items where the condition is true
    let newInventoryData = InventoryData.filter((inventory) => inventory.id !== id);

    // Save the filtered array to localStorage (persists the deletion)
    localStorage.setItem("InventoryData", JSON.stringify(newInventoryData));

    // Re-render the table with the updated data (without the deleted item)
    rendenter_inventory_data(newInventoryData);
}


// ============================================================================
// INITIAL RENDER ON PAGE LOAD
// ============================================================================

// Render all inventory data when the page first loads
// This displays any existing inventory items from localStorage
// MISSING SEMICOLON at the end of this line
rendenter_inventory_data(InventoryData);
