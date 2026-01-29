import { SalesData, InventoryData, EmployeesData } from "./storage.js";

// DOM Elements for Stats
const totalSalesValue = document.getElementById('total_sales_value');
const totalSalesCount = document.getElementById('total_sales_count');
const totalProductsValue = document.getElementById('total_products_value');
const lowStockValue = document.getElementById('low_stock_value');
const activeEmployeesValue = document.getElementById('active_employees_value');

// Charts Context
const ctx = document.getElementById('barChart');
const ctx2 = document.getElementById('pieChart');



/**
 * Render Bar Chart showing Sales Quantity by Product
 */
function renderSalesChart() {
    if (!ctx) return;

    const labels = [...new Set(SalesData.map((item) => item.product))];
    const values = labels.map(label => {
        return SalesData.filter(item => item.product === label).reduce((acc, item) => acc + (parseFloat(item.quantity) || 0), 0)
    });

    // Check if labels/values exist to avoid empty chart issues
    if (labels.length === 0) {
        ctx.parentElement.innerHTML = "<p style='text-align:center; padding: 20px; color: #64748b;'>No sales data available</p>";
        return;
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantity Sold',
                data: values,
                backgroundColor: '#38bdf8',
                borderRadius: 8,
                barThickness: 'flex',
                maxBarThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: { color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });
}



// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderSalesChart();
});
