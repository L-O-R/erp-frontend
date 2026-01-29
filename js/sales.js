import Sale from "./classes/salesClasses.js";
import { InventoryData, SalesData } from "./storage.js";

// -------------------------------------------------------
// DOM ELEMENTS
// -------------------------------------------------------

// Table body to display the list of sales transactions
const salesHistoryTbody = document.getElementById(
  "salesHistoryTbody",
);
// Dialog/Modal for adding a new sale
const add_sales_dialog = document.getElementById(
  "add_sales_dialog",
);
// Button to trigger the add sale modal
const addSaleBtn = document.getElementById("addSaleBtn");
// Button to export sales data as CSV
const exportCsvSalesBtn = document.getElementById(
  "exportCsvSalesBtn",
);
// Icon or button to close the modal
const closeAddSalesBtn = document.getElementById(
  "close_add_sales_dialog",
);
// Cancel button within the add sale modal
const cancelAddSalesBtn = document.getElementById(
  "cancel_add_sales_dialog",
);
// Form element used to capture sale details
const add_sales_form = document.getElementById(
  "add_sales_form",
);
// Dropdown for selecting a product from the inventory
const Select_product = document.getElementById("product");
// Input field for entering the quantity to sell
const quantity = document.getElementById("quantity");
// const totol_price_details = document.getElementById("totol_price_details");

// Event listener for the cancel button to close the modal
cancelAddSalesBtn.addEventListener("click", () => {
  clossModal();
});

// Event listener for the close button (often an 'X') to close the modal
closeAddSalesBtn.addEventListener("click", () => {
  clossModal();
});

/**
 * Utility function to hide the Add Sale modal dialog.
 */
function clossModal() {
  add_sales_dialog.close();
}

// Event listener to show the Add Sale modal when the trigger button is clicked
addSaleBtn.addEventListener("click", () => {
  add_sales_dialog.showModal();
});

// -------------------------------------------------------
// PRODUCT DATA POPULATION
// -------------------------------------------------------

/**
 * Populates the product selection dropdown with items currently available in the inventory.
 */
if (InventoryData.length > 0) {
  InventoryData.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    // Text includes product name, price, and current stock level for clarity
    option.textContent = `${item.productName} - (Rs.${item.productPrice}) - ${item.productQuantity} in stock`;
    Select_product.appendChild(option);
  });
}

// -------------------------------------------------------
// PRODUCT SELECTION HANDLING
// -------------------------------------------------------

/**
 * Listens for changes in the product dropdown to update stock availability information.
 */
let selectedProduct = {};
Select_product.addEventListener("input", () => {
  // alert(Select_product.value);
  // Find the product object in InventoryData that matches the selected product ID
  selectedProduct = InventoryData.find(
    (item) => item.id === parseInt(Select_product.value),
  );
  // console.log(selectedProduct)
  if (selectedProduct) {
    // Sets the maximum allowable value for the quantity input based on available stock
    quantity.max = selectedProduct.productQuantity;
  }

  document.getElementById("total_product_cost").innerHTML =
    `
        <table>
            <tbody>
            <tr>
                <td>
                    Unit Price
                </td>
                <td>
                    Rs.${selectedProduct.productPrice}
                </td>
            </tr>
            <tr>
                <td >
                    Quantity
                </td>
                <td>
                    1
                </td>
            </tr>
            </tbody>
            <tfoot>
                
            <tr>
                <td >
                    Total Price
                </td>
                <td>
                    ${1 * selectedProduct.productPrice}
                </td>
            </tr>
            </tfoot
        </table>
  
  `;

  // Updates a label in the UI to show the current available quantity for the selected item
  document.getElementById("product_quantity").innerText =
    `Available Quantity: ${selectedProduct.productQuantity}`;
});

quantity.addEventListener("change", (e) => {
  document.getElementById("total_product_cost").innerHTML =
    `
        <table>
            <tbody>
            <tr>
                <td>
                    Unit Price
                </td>
                <td>
                    Rs.${selectedProduct.productPrice}
                </td>
            </tr>
            <tr>
                <td >
                    Quantity
                </td>
                <td>
                    ${e.target.value}
                </td>
            </tr>
            </tbody>
            <tfoot>
                
            <tr>
                <td >
                    Total Price
                </td>
                <td>
                    ${e.target.value * selectedProduct.productPrice}
                </td>
            </tr>
            </tfoot
        </table>
  
  `;
});

// -------------------------------------------------------
// SALE SUBMISSION PROCESSING
// -------------------------------------------------------

/**
 * Handles the submission of the Add Sale form.
 * Creates a new sale record, updates inventory stock levels, and saves both to localStorage.
 */
add_sales_form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Unique ID for the sale using current timestamp
  const id = Date.now();
  // Gets product ID and quantity from the form fields
  const product = e.target[0].value;
  const quantity = e.target[1].value;
  // Current date and time in ISO format
  const currentTimeStamp = new Date().toISOString();
  // Retrieves the selected product's information
  const selectedProduct = InventoryData.find(
    (item) => item.id === parseInt(product),
  );
  const product_Name = selectedProduct.productName;
  const unitPrice = selectedProduct.productPrice;

  // Creates a new Sale instance and calculates the total price
  const sale = new Sale(
    id,
    product_Name,
    quantity,
    unitPrice,
    quantity * unitPrice,
    currentTimeStamp,
  );
  SalesData.push(sale);

  console.log(sale);
  // Saves the updated sales list to local storage
  localStorage.setItem(
    "SalesData",
    JSON.stringify(SalesData),
  );

  // Decrements the product's quantity in the inventory data
  selectedProduct.productQuantity -= parseInt(quantity);
  if (selectedProduct.productQuantity >= 10) {
    selectedProduct.productStatus = "In Stock";
  } else if (selectedProduct.productQuantity >= 1) {
    selectedProduct.productStatus = "Low Stock";
  } else {
    selectedProduct.productStatus = "Out of Stock";
  }
  // Finds the index of the product to update it in the main InventoryData array
  const index_number = InventoryData.findIndex(
    (item) => item.id === selectedProduct.id,
  );
  if (index_number !== -1) {
    InventoryData[index_number] = selectedProduct;
  }
  // Saves the updated inventory data to local storage
  localStorage.setItem(
    "InventoryData",
    JSON.stringify(InventoryData),
  );

  // UI Cleanup: close the modal and reset the form fields
  add_sales_dialog.close();
  add_sales_form.reset();
  renderSales();
});

/**
 * Renders the sales history table using the template tag defined in HTML.
 */
function renderSales() {
  salesHistoryTbody.innerHTML = "";
  const template = document.getElementById("sales_data_template");

  SalesData.forEach((sale) => {
    const clone = template.content.cloneNode(true);
    const cells = clone.querySelectorAll("td");

    // Format the timestamp to a readable date string
    cells[0].textContent = new Date(sale.currentTimeStamp).toLocaleString();
    cells[1].textContent = sale.product;
    cells[2].textContent = sale.quantity;
    cells[3].textContent = `Rs.${sale.unitPrice}`;
    cells[4].textContent = `Rs.${sale.total}`;

    salesHistoryTbody.appendChild(clone);
  });
}

// Initial render of sales data on page load
renderSales();

