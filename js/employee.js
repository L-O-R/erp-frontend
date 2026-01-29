import { EmployeesData } from "./storage.js";
import Emp_Class from "./classes/emp_classes.js";

// Constants
const ROLES = ["Manager", "Senior Employee", "Software Engineer", "Product Manager", "UI/UX Designer"];
const DEPARTMENTS = ["Engineering", "Sales", "Product", "Marketing", "HR"];

// DOM Elements
const addEmplyoeeBtn = document.getElementById("addEmplyoeeBtn");
const dialog_Emp = document.getElementById("dialog_Emp");
const dialog_title = document.getElementById("dialog_title");
const emp_add_form = document.getElementById("emp_add_form");
const emp_role = document.getElementById("emp_role");
const emp_department = document.getElementById("emp_department");
const submit_emp_btn = document.getElementById("submit_emp_btn");
const cancel_emp_btn = document.getElementById("cancel_emp_btn");
const edit_emp_id_input = document.getElementById("edit_emp_id");
const employees_list = document.getElementById("employees_list");
const emp_card_template = document.getElementById("emp_card_template");
const employeeSearch = document.getElementById("employeeSearch");

// Info Card Targets
const activeEmp_info = document.getElementById("activeEmp_info");
const inActiveEmp_info = document.getElementById("inActiveEmp_info");
const totalDept_info = document.getElementById("totalDept_info");

// Initialize Options
function populateSelects(items, selectElement) {
  selectElement.innerHTML = "";
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.innerText = item;
    selectElement.appendChild(option);
  });
}

populateSelects(ROLES, emp_role);
populateSelects(DEPARTMENTS, emp_department);

// Handle Modal Open
addEmplyoeeBtn.addEventListener("click", () => {
  dialog_title.innerText = "Add Employee";
  submit_emp_btn.innerText = "Add Employee";
  edit_emp_id_input.value = "";
  emp_add_form.reset();
  dialog_Emp.showModal();
});

// Handle Modal Close
cancel_emp_btn.addEventListener("click", () => {
  dialog_Emp.close();
  emp_add_form.reset();
});

// Update Local Storage & UI
function saveData() {
  localStorage.setItem("EmployeesData", JSON.stringify(EmployeesData));
  updateInfoCards();
  renderEmployees(EmployeesData);
}

// Info Cards Logic
function updateInfoCards() {
  const activeEmp = EmployeesData.filter(emp => emp.emp_status === "active");
  const inActiveEmp = EmployeesData.filter(emp => emp.emp_status === "in_active");
  const departments = new Set(EmployeesData.map(emp => emp.emp_department));

  activeEmp_info.innerText = activeEmp.length;
  inActiveEmp_info.innerText = inActiveEmp.length;
  totalDept_info.innerText = departments.size;
}

// Render Employee List
function renderEmployees(data = EmployeesData) {
  employees_list.innerHTML = "";

  if (data.length === 0) {
    employees_list.innerHTML = "<p class='no-data'>No employees matching your search.</p>";
    return;
  }

  data.forEach(emp => {
    const clone = emp_card_template.content.cloneNode(true);
    const card = clone.querySelector(".emp_card");

    // Fill Data
    clone.querySelector(".emp_name").innerText = emp.emp_name;
    clone.querySelector(".emp_role").innerText = emp.emp_role;
    clone.querySelector(".email").innerText = emp.emp_email;
    clone.querySelector(".emp_department").innerText = emp.emp_department;
    clone.querySelector(".join_date").innerText = `Joined: ${emp.emp_joinDate}`;
    clone.querySelector(".emp_intials").innerText = emp.emp_name[0];

    const statusBadge = clone.querySelector(".emp_status");
    statusBadge.innerText = emp.emp_status;
    statusBadge.classList.add(emp.emp_status === "active" ? "active" : "inactive");

    // Edit Button Logic
    clone.querySelector(".edit_btn").addEventListener("click", () => {
      openEditDialog(emp);
    });

    // Delete Button Logic
    clone.querySelector(".remove_btn").addEventListener("click", () => {
      if (confirm(`Are you sure you want to remove ${emp.emp_name}?`)) {
        const index = EmployeesData.findIndex(e => e.emp_id === emp.emp_id);
        if (index !== -1) {
          EmployeesData.splice(index, 1);
          saveData();
        }
      }
    });

    employees_list.appendChild(clone);
  });
}

// Open Dialog for Editing
function openEditDialog(emp) {
  dialog_title.innerText = "Edit Employee";
  submit_emp_btn.innerText = "Update Employee";
  edit_emp_id_input.value = emp.emp_id;

  // Populate form
  const form = document.getElementById("emp_add_form");
  form.full_name.value = emp.emp_name;
  form.email.value = emp.emp_email;
  form.emp_role.value = emp.emp_role;
  form.emp_department.value = emp.emp_department;
  document.getElementById("join_date").value = emp.emp_joinDate;
  form.emp_status.value = emp.emp_status;

  dialog_Emp.showModal();
}

// Handle Form Submit (Add or Edit)
emp_add_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(emp_add_form);
  const empId = edit_emp_id_input.value;

  const empData = {
    emp_name: formData.get("full_name"),
    emp_email: formData.get("email"),
    emp_role: formData.get("emp_role"),
    emp_department: formData.get("emp_department"),
    emp_joinDate: formData.get("join_date"),
    emp_status: formData.get("emp_status")
  };

  if (empId) {
    // Edit existing
    const index = EmployeesData.findIndex(emp => emp.emp_id === empId);
    if (index !== -1) {
      EmployeesData[index] = { ...EmployeesData[index], ...empData };
    }
  } else {
    // Add new
    const new_emp = new Emp_Class(
      Date.now().toString(), // Unique ID
      empData.emp_name,
      empData.emp_email,
      empData.emp_role,
      empData.emp_department,
      empData.emp_joinDate,
      empData.emp_status
    );
    EmployeesData.push(new_emp);
  }

  saveData();
  dialog_Emp.close();
  emp_add_form.reset();
});

// Search Logic
employeeSearch.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase().trim();
  const filtered = EmployeesData.filter(emp =>
    emp.emp_name.toLowerCase().includes(term) ||
    emp.emp_role.toLowerCase().includes(term) ||
    emp.emp_email.toLowerCase().includes(term)
  );
  renderEmployees(filtered);
});

// Initial Render
updateInfoCards();
renderEmployees();
