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

const employees_list = document.getElementById("employees_list");
const emp_card_template = document.getElementById("emp_card_template");

addEmplyoeeBtn.addEventListener("click", () => {
  dialog_Emp.showModal();
});

const cancel_emp_btn = document.getElementById("cancel_emp_btn");
cancel_emp_btn.addEventListener("click", () => {
  dialog_Emp.close();
  document.getElementById("emp_add_form").reset();
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

    dialog_Emp.close();
    event.target.reset();
    updateInfoCards();
    renderEmployees(EmployeesData);
  });



// ------------------info cards------------------
const activeEmp_info = document.getElementById("activeEmp_info");
const inActiveEmp_info = document.getElementById("inActiveEmp_info");
const totalDept_info = document.getElementById("totalDept_info");

function updateInfoCards() {
  const activeEmp = EmployeesData.filter(emp => emp.emp_status === "active");
  const inActiveEmp = EmployeesData.filter(emp => emp.emp_status === "in_active");
  const totalDept = new Set(EmployeesData.map(emp => emp.emp_role));


  activeEmp_info.innerText = activeEmp.length;
  inActiveEmp_info.innerText = inActiveEmp.length;
  totalDept_info.innerText = totalDept.size;
}

updateInfoCards();

// ------------------employees list -------------------------------------

function renderEmployees(data) {
  if (data.length <= 0) {
    employees_list.innerHTML = "<p>No employees found</p>";
    return;
  }

  data.forEach(emp => {
    const emp_card = emp_card_template.content.cloneNode(true);
    let emp_name = emp_card.querySelector('.emp_name');
    emp_name.innerText = emp.emp_name;

    const emp_role = emp_card.querySelector('.emp_role');
    emp_role.innerText = emp.emp_role;


    const emp_status = emp_card.querySelector('.emp_status');
    emp_status.innerText = emp.emp_status;

    emp_status.style.color = emp.emp_status === "active" ? "white" : "white";
    emp_status.style.backgroundColor = emp.emp_status === "active" ? "green" : "red";
    emp_status.style.padding = "0.1rem 0.5rem";
    emp_status.style.borderRadius = "5px";

    const emp_joinDate = emp_card.querySelector('.join_date');
    emp_joinDate.innerText = emp.emp_joinDate;

    const emp_department = emp_card.querySelector('.emp_department');
    emp_department.innerText = emp.emp_department;

    const emp_email = emp_card.querySelector('.email');
    emp_email.innerText = emp.emp_email;


    const emp_intials = emp_card.querySelector('.emp_intials');
    emp_intials.innerText = emp.emp_name[0];

    employees_list.appendChild(emp_card);


  })


}


renderEmployees(EmployeesData);


