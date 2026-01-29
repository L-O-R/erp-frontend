import { EmployeesData } from "./storage.js";
import Emp_Class from "./classes/emp_classes.js";
// constants
const Role = [
  "Manager",
  "Senior Emplyoee",
  "Software",
  "Product Manager",
  "Senior Manager   ",
];
const Departments = [
  "Engenering",
  "Sales",
  "Product",
  "Marketing",
];

// dom targets
const addEmplyoeeBtn = document.getElementById(
  "addEmplyoeeBtn",
);
const dialog_Emp = document.getElementById("dialog_Emp");
const emp_role = document.getElementById("emp_role");
const emp_department = document.getElementById(
  "emp_department",
);

addEmplyoeeBtn.addEventListener("click", () => {
  dialog_Emp.showModal();
});

function addOPtions(ary, selectTag) {
  ary.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.toLowerCase();
    option.innerText = item.toUpperCase();

    selectTag.appendChild(option);
  });
}

addOPtions(Role, emp_role);
addOPtions(Departments, emp_department);

// ----------------------------------------add Emplyoee Data----------

document
  .getElementById("emp_add_form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const emp_id = new Date().toLocaleString();
    const emp_name = event.target[0].value;
    const emp_email = event.target[1].value;
    const emp_role = event.target[2].value;
    const emp_department = event.target[3].value;
    const emp_joinDate = event.target[4].value;
    const emp_status = event.target[5].value;

    const new_emp = new Emp_Class(
      emp_id,
      emp_name,
      emp_email,
      emp_role,
      emp_department,
      emp_joinDate,
      emp_status,
    );

    EmployeesData.push(new_emp);

    localStorage.setItem(
      "EmployeesData",
      JSON.stringify(EmployeesData),
    );
  });
