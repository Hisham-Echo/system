// Setup
let saveBtn = document.getElementById("add");
let list = document.getElementById("tasks");

// DATA
let nameInp = document.querySelector(".nameInput");
let numInp = document.querySelector(".numInput");
let deviceInp = document.querySelector(".deviceInput");
let descInp = document.querySelector(".descInput");
let amountInp = document.querySelector(".amountInput");

// Employees
let emps = document.querySelector("select");
let selectedEmp = () => emps.options[emps.selectedIndex].value;
// Accessories
let accessories = document.querySelectorAll(".acs input");

// creating table intial structure
let table = document.createElement("table");
table.innerHTML = `
<thead>
<tr>
<th>Name</th>
<th>Phone Number</th>
<th>Device</th>
<th>Description</th>
<th>Amount</th>
<th>Accessories</th>
<th>Employee</th>
<th>Status</th>
<th>Edit</th>
</tr>
</thead>
<tbody></tbody>`;
list.appendChild(table);

// intialize array of objects
let Tasks = [];

// load tasks in storage to 'Tasks' variable
if (localStorage.getItem("Tasks")) {
    // adding elements from local storage
    try {
        Tasks = JSON.parse(localStorage.getItem("Tasks"));
    } catch (error) {
        console.log(error);
        console.error("INVALID DATA FILE");
        console.warn("PLEASE SELECT A VALID DATA FILE FORMATED IN JSON");
    }
    // adding elements to DOM
    try {
        create();
    } catch (error) {
        console.log(error);
        console.error("INVALID DATA FILE");
        console.warn("PLEASE SELECT A VALID DATA FILE FORMATED IN JSON");
    }
}

saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (nameInp.value && numInp.value && deviceInp.value && descInp.value && amountInp.value) {
        // add new task object to array
        Tasks.push({
            name: `${nameInp.value}`,
            number: `${numInp.value}`,
            device: `${deviceInp.value}`,
            description: `${descInp.value}`,
            accessories: addAccessory(accessories),
            amount: `${amountInp.value}`,
            emp: `${selectedEmp()}`,
            status: "standby" /* rejected - inprogress - delivered */,
            id: new Date().getTime(),
            date: `${new Date().getDate()}-${
                new Date().getMonth() + 1
            }-${new Date().getFullYear()}_${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
        });
        // update local storage
        localStorage.setItem("Tasks", `${JSON.stringify(Tasks)}`);
        // add task to DOM
        create();
        // export data
        exportData();
        // clear input field
        document.forms[0].reset();
    }
});

// FUNCTIONS
function create() {
    // reset
    list.innerHTML = "";
    table.lastElementChild.innerHTML = "";
    list.appendChild(table);

    Tasks.forEach((obj) => showData(obj));
}

// Export DATA
function exportData() {
    let date = `${new Date().getDate()}-${
        new Date().getMonth() + 1
    }-${new Date().getFullYear()}@${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`;

    let localData = localStorage.getItem("Tasks");
    let blob = new Blob([localData], { type: "text/plain" });
    let reader = new FileReader();
    reader.readAsText(blob);
    reader.onloadend = function () {
        let fileContents = reader.result;
        let file = new File([fileContents], `${date}.txt`, {
            type: "text/plain",
        });
        let url = URL.createObjectURL(file);
        let a = document.createElement("a");
        a.href = url;
        a.download = `${date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
}

// Import DATA
function importData(event) {
    // console.log(event, event.target);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const fileContents = event.target.result;
        console.log(fileContents);
        localStorage.setItem("Tasks", fileContents);
        // console.log("FILE IMPORTED !");
    };
    reader.readAsText(file);
    location.reload();
}

const fileInput = document.getElementById("fileInput");
const importButton = document.getElementById("importButton");
fileInput.addEventListener("change", importData);
importButton.addEventListener("click", () => fileInput.click());

//
function showData(obj) {
    // fetching values
    let custName = obj.name;
    let custNum = obj.number;
    let custDevice = obj.device;
    let desc = obj.description;
    let arrAccessories = obj.accessories;
    let emp = obj.emp;
    let custDate = obj.date;
    let amount = obj.amount;
    let status = obj.status;

    // status buttons
    // // deliver
    let deliverBtn = document.createElement("button");
    deliverBtn.classList.add("deliv");
    deliverBtn.innerHTML = "Deliver";
    deliverBtn.addEventListener('click',(e) => {
        let parent = e.target.parentElement.parentElement;
        let check = confirm("Deliver?");
        if(check){
            let cols = parent.children;
            // color
            for( let i = 0; i < cols.length; i++){
                cols[i].style.background = "lightgreen";
            }
            // update value and export
            for (let j = 0; j < Tasks.length; j++) {
                if (Tasks[j].id == parent.getAttribute("id")) {
                    Tasks[j].status = "deliver";
                }
            }
            localStorage.setItem("Tasks", JSON.stringify(Tasks));
            exportData();
        }
    });

    // // progress
    let progressBtn = document.createElement("button");
    progressBtn.classList.add("prog");
    progressBtn.innerHTML = "InProgress";
    progressBtn.addEventListener('click',(e) => {
        let check = confirm("Progress?");
        if(check){
            let parent = e.target.parentElement.parentElement;
            let cols = parent.children;
            // color
            for( let i = 0; i < cols.length; i++){
                cols[i].style.background = "#fff34a";
            }
            // update value and export
            for (let j = 0; j < Tasks.length; j++) {
                if (Tasks[j].id == parent.getAttribute("id")) {
                    Tasks[j].status = "progress";
                }
            }
            localStorage.setItem("Tasks", JSON.stringify(Tasks));
            exportData();
        }
    })
    // // reject
    let rejectBtn = document.createElement("button");
    rejectBtn.classList.add("rej");
    rejectBtn.innerHTML = "Reject";
    rejectBtn.addEventListener('click',(e) => {
        let check = confirm("reject?");
        if(check){
            let parent = e.target.parentElement.parentElement;
            let cols = parent.children;
            // color
            for( let i = 0; i < cols.length; i++){
                cols[i].style.background = "lightcoral";
            }
            // update value and export
            for (let j = 0; j < Tasks.length; j++) {
                if (Tasks[j].id == parent.getAttribute("id")) {
                    Tasks[j].status = "reject";
                }
            }
            localStorage.setItem("Tasks", JSON.stringify(Tasks));
            exportData();
        }
    }) 

    // create delete btn
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("del");
    deleteBtn.innerHTML = "Delete";
    // DELETE()
    deleteBtn.addEventListener("click", (e) => {
        let check = confirm("Confirm to delete data ?");
        if(check){
            //! let pass = prompt("Please enter your password")
            //! if(pass)
            //? remove task from "Tasks"
        Tasks = Tasks.filter(
            (task) => task.id != e.target.parentElement.parentElement.id
        );
        // update storage
        localStorage.setItem("Tasks", JSON.stringify(Tasks));
        // delete parent element
        e.target.parentElement.parentElement.remove();
        // export updated
        exportData();
        }
    });

    // create print barcode btn
    let printBtn = document.createElement("button");
    printBtn.classList.add("barcode");
    printBtn.innerHTML = "Print";
    // PRINT()
    printBtn.addEventListener("click", (e) => {
        let parentID = e.target.parentElement.parentElement.id;
        let myData = JSON.parse(localStorage.getItem("Tasks"));

        let custNum = () => {
            for (let i = 0; i < myData.length; i++) {
                if (myData[i].id == parentID) {
                    return myData[i].number;
                }
            }
        };
        let custName = () => {
            for (let i = 0; i < myData.length; i++) {
                if (myData[i].id == parentID) {
                    return myData[i].name;
                }
            }
        };

        let ticketLayout = `
                    <h3 class="logotxt" style="font-size: 15px;line-height:1">HiTecH</h3>
                    <svg id="barcode"></svg>
                    <p class="name" style="font-size: 15px; margin-top: -5px">
                        ${custName()}
                        <br />
                        ${custNum()}
                    </p>
                    `;
        ticket.innerHTML = ticketLayout;

        printBarcode(parentID);
        window.print();
    });

    // create update btn
    let updateBtn = document.createElement("button");
    updateBtn.classList.add("update");
    updateBtn.innerHTML = "Update";
    // UPDATE()
    updateBtn.addEventListener("click", (e) => {
        let parent = e.target.parentElement.parentElement;

        // let cancel = document.createElement("button");
        // cancel.innerHTML = "CANCEL!";
        // cancel.style.background = "lightred";
        // parent.children[7].innerHTML = "";
        // parent.children[7].appendChild(cancel);

        let done = document.createElement("button");
        done.innerHTML = "DONE!";
        done.style.background = "lightgreen";
        parent.children[8].innerHTML = "";
        parent.children[8].appendChild(done);

        for (let i = 0; i < 5; i++) {
            let val = parent.children[i].innerHTML;
            parent.children[i].innerHTML = `<input type='text' value='${val}'>`;
        }

        // done
        done.addEventListener("click", (e) => {
            if (
                parent.children[0].children[0].value &&
                parent.children[1].children[0].value &&
                parent.children[2].children[0].value &&
                parent.children[3].children[0].value &&
                parent.children[4].children[0].value
            ) {
                let check = confirm("Are you sure you want to update?");
                if(check){
                    for (let i = 0; i < 5; i++) {
                        let newval = parent.children[i].children[0].value;
                        // console.log(parent, parent.getAttribute("id"));
                        let eleClass = parent.children[i].getAttribute("class");
                        for (let j = 0; j < Tasks.length; j++) {
                            // console.log(Tasks[i].id);
                            if (Tasks[j].id == parent.getAttribute("id")) {
                                Tasks[j][eleClass] = `${newval}`;
                            }
                        }
                        // update value in array tasks
                        parent.children[i].innerHTML = `${newval}`;
                    }
                    // update value in local storage
                    localStorage.setItem("Tasks", JSON.stringify(Tasks));
                    parent.children[8].innerHTML = "";
                    parent.children[8].appendChild(printBtn);
                    parent.children[8].appendChild(updateBtn);
                    parent.children[8].appendChild(deleteBtn);
                    // export update
                    exportData();
                } else {
                    location.reload();
                }
               
            }
        });
    });

    // layout for displayed data
    let data = `
    <td class="name" title=${custDate}>${custName}</td>
    <td class="number">${custNum}</td>
    <td class="device">${custDevice}</td>
    <td class="description">${desc}</td>
    <td class="amount">${amount}</td>
    <td class="${status}"><ul>${appendAccessory(arrAccessories)}</ul></td>
    <td class="${status}">${emp}</td>
    <td class="status"></td>
    <td class="edit"></td>`;

    // show data
    let newRow = document.createElement("tr");
    newRow.classList.add(`${status}`)
    newRow.id = obj.id;
    newRow.innerHTML = data;
    table.lastChild.appendChild(newRow);

    // show btns
    let showBtn = (btn,position) => newRow.children[newRow.children.length - position].appendChild(btn);
    showBtn(printBtn,1);
    showBtn(updateBtn,1);
    showBtn(deleteBtn,1);
    showBtn(deliverBtn,2);
    showBtn(progressBtn,2);
    showBtn(rejectBtn,2);
}

// accessory include
function addAccessory(arr) {
    let myAccessories = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
            myAccessories.push(arr[i].value);
        } else {
            continue;
        }
    }
    return myAccessories;
}
function appendAccessory(arr) {
    let list = "";
    for (let i = 0; i < arr.length; i++) {
        list += `<li>${arr[i]}</li>`;
    }
    return list;
}

// 
// function searchCust() {}
// function sortCust() {}
