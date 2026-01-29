import { SalesData, InventoryData } from "./storage.js";
const ctx = document.getElementById('barChart').getContext('2d');
const ctx2 = document.getElementById('pieChart').getContext('2d');

//  sales data
// // [
//     {
//         "id": 1769086995428,
//         "product": "asd",
//         "quantity": "10",
//         "unitPrice": 200003,

//         "total": 2000030,
//         "currentTimeStamp": "2026-01-22T13:03:15.428Z"
//     }
// ]
const labels = [...new Set(SalesData.map((item) => item.product))];

// console.log(labels);

const value = labels.map(label => {
    return SalesData.filter(item => item.product === label).reduce((acc, item) => acc + item.quantity, 0)
})

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Sales',
            data: value,
            backgroundColor: 'rgba(193, 156, 241, 0.66)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
            borderRadius: 10,
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Sales'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    }
})


//  for pi chart according to inventart category


const category = [...new Set(InventoryData.map((item) => item.productCategory))];


new Chart(ctx2, {
    type: 'pie',
    data: category,
})

