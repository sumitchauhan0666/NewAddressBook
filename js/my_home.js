let AddressBookApp;

window.addEventListener('DOMContentLoaded', (event) => {
    if (site_properties.use_local_storage.match("true")) {
        getDataFromLocalStorage();
    } else
        getPayrollDataFromServer();
})

function processEmployeePayrollDataResponse() {
    //Create another method for response because this should implement after we get response from server
    document.querySelector('.emp-count').textContent = AddressBookApp.length;
    createInnerHtml();
    localStorage.removeItem("edit-emp");
}

const getDataFromLocalStorage = () => {
    AddressBookApp = localStorage.getItem('AddressBookApp') ?
        JSON.parse(localStorage.getItem('AddressBookApp')) : [];
    processEmployeePayrollDataResponse();
}

const getPayrollDataFromServer = () => {

    makeServiceCall("GET", site_properties.server_url, true)
        .then(response => {
            AddressBookApp = JSON.parse(response);
            processEmployeePayrollDataResponse();
        })
        .catch(error => {
            console.log("Get Error Status : " + JSON.stringify(error));
            AddressBookApp = [];
            processEmployeePayrollDataResponse();
        })
}

function handleSelectChange(event) {
    var filter = event.target.value;
    table = document.getElementById("display");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
    
}
function handleStateChange(event) {
    var filter = event.target.value;
    table = document.getElementById("display");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
    
}

const createInnerHtml = () => {
    const headerHtml = "<tr><th>Name</th><th>Phone Number</th>" +
        "<th>City</th><th>State</th><th>Address</th><th>Actions</th></tr>";
    let innerHtml = `${headerHtml}`;
    for (let empPayrollData of AddressBookApp) {
        innerHtml = `${innerHtml}
            <tr>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._phone}</td>
            <td>${empPayrollData._city}</td>
            <td>${empPayrollData._state}</td>
            <td>${empPayrollData._address}</td>
            <td>
                <img id ="${empPayrollData.id}" src="../assets/icons/delete-black-18dp.svg" alt="Delete" onClick=remove(this)>
                <img id ="${empPayrollData.id}" src="../assets/icons/create-black-18dp.svg" alt="Edit" onClick=update(this)>
            </td>
        </tr>`
            ;
    }
    document.querySelector('#display').innerHTML = innerHtml;
}



const remove = (data) => {

    let employeeData = AddressBookApp.find(empData => empData.id == data.id);
    if (!employeeData) {
        return;
    }
    const index = AddressBookApp.map(empData => empData.id).indexOf(employeeData.id);
    if (site_properties.use_local_storage.match("true")) {
        AddressBookApp.splice(index, 1);
        localStorage.setItem('AddressBookApp', JSON.stringify(AddressBookApp));
        document.querySelector('.emp-count').textContent = AddressBookApp.length;
        createInnerHtml();
    } else {
        const deleteUrl = site_properties.server_url + employeeData.id.toString();
        makeServiceCall("DELETE", deleteUrl, true)
            .then(response => {
                console.log(response)
                document.querySelector(".emp-count").textContent = AddressBookApp.length;
                createInnerHtml();
            })
            .catch(error => {
                alert("Error while deleting " + error)
            })
    }

}

const update = (data) => {

    let employeeData = AddressBookApp.find(empData => empData.id == data.id);
    if (!employeeData) {
        return;
    }
    localStorage.setItem('edit-emp', JSON.stringify(employeeData));
    window.location.replace(site_properties.add_employee_page);
}