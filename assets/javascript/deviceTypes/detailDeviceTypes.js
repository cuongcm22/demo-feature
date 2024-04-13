// function deleteDeviceType(index, deviceTypeName) {
//     console.log(deviceTypeName);
//     // Prompt the user for confirmation
//     var confirmation = confirm(
//         "Are you sure you want to delete this device type?"
//     );
//     // If the user confirms the deletion
//     if (confirmation) {
//         handleDelete(deviceTypeName);
//     }
// }

// function handleDelete(deviceTypeName) {
//     $.ajax({
//         url: "/devicetypes/delete",
//         method: "POST",
//         data: {
//             deviceTypeName: deviceTypeName,
//         },
//         success: function (res) {
//             if (res) {
//                 alert('Xóa nhà cung cấp thành công')
//                 window.location.assign(window.location.origin + '/devicetypes/detail');
//             }
//         },
//         error: function (err) {
//             console.error(err);
//         }
//     });
// }

// // Function to render device types table
// function renderDeviceTypesTable() {
//     const tableBody = document.getElementById("deviceTypesTableBody");
//     tableBody.innerHTML = "";
//     mockData.forEach((deviceType, index) => {
//         const row = `<tr>
//     <td>${deviceType.name}</td>
//     <td>${deviceType.description}</td>
//     <td><button type="button" class="btn btn-primary" onclick="showDeviceTypeDetails(${index})">Sửa</button></td>
//     <td><button type="button" class="btn btn-danger" onclick="deleteDeviceType(${index}, '${deviceType.name}')">Xóa</button></td>
//     </tr>`;
//         tableBody.innerHTML += row;
//     });
// }
// // Function to show device type details in modal
// function showDeviceTypeDetails(index) {
//     const deviceType = mockData[index];
//     const modalBody = document.querySelector("#deviceTypeModal .modal-body");
//     modalBody.innerHTML = `<form id="deviceTypeForm" action="/devicetypes/update" method="post">
//     <div class="mb-3">
//     <input name="nameholder" type="text" class="form-control" hidden readonly="" value="${deviceType.name}" required>
//     <label for="nameInput" class="form-label">Tên</label>
//     <input name="name" type="text" class="form-control" id="nameInput" value="${deviceType.name}" required>
//     </div>
//     <div class="mb-3">
//     <label for="descriptionInput" class="form-label">Mô tả</label>
//     <textarea name="description" class="form-control" id="descriptionInput">${deviceType.description}</textarea>
//     </div>
//     <button class="btn btn-primary" type="submit">Submit</button>
//     </form>`;
//     $("#deviceTypeModal").modal("show");
// }
// // Initial rendering of device types table
// renderDeviceTypesTable();

const tableBody = $("#deviceTypesTableBody");
const pagination = $("#pagination");
const itemsPerPage = 5;
let currentPage = 1;

function renderTable(page) {
    tableBody.html("");
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = mockData.slice(startIndex, endIndex);

    paginatedData.forEach((deviceType, index) => {
        const row = `
        <tr>
            <td>${startIndex + index + 1}</td>
            <td>${deviceType.name}</td>
            <td>${deviceType.description}</td>
            <td>
            <button class="btn badge bg-primary" onclick="showDeviceTypeDetails('${deviceType.name}')">Sửa</button>
            <button class="btn badge bg-danger" onclick="deleteDeviceType('${deviceType.name}')">Xóa</button>
            </td>
        </tr>
        `;
        tableBody.append(row);
    });
}

function renderPagination() {
    pagination.html("");
    const totalPages = Math.ceil(mockData.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const li = $(
            `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
        );
        li.click(() => {
            currentPage = i;
            renderTable(currentPage);
            highlightCurrentPage();
        });
        pagination.append(li);
    }
    highlightCurrentPage();
}

function highlightCurrentPage() {
    const pages = pagination.find(".page-item");
    pages.removeClass("active");
    pages.eq(currentPage - 1).addClass("active");
}

function deleteDeviceType(deviceTypeName) {
    var confirmation = confirm(
        "Are you sure you want to delete this device type?"
    );
    if (confirmation) {
        handleDelete(deviceTypeName);
    }
}

function handleDelete(deviceTypeName) {
    $.ajax({
        url: "/devicetypes/delete",
        method: "POST",
        data: {
            deviceTypeName: deviceTypeName,
        },
        success: function (res) {
            if (res) {
                alert("Device type deleted successfully");
                window.location.assign(
                    window.location.origin + "/devicetypes/detail"
                );
            }
        },
        error: function (err) {
            console.error(err);
        },
    });
}

window.showDeviceTypeDetails = function (deviceTypeName) {
    const deviceType = mockData.find((dt) => dt.name === deviceTypeName);
    const modalBody = $("#deviceTypeModal .modal-body");
    modalBody.html(`
        <form id="deviceTypeForm" action="/devicetypes/update" method="post">
        <div class="mb-3">
            <input name="nameholder" type="text" class="form-control" hidden readonly value="${deviceType.name}" required>
            <label for="nameInput" class="form-label">Name</label>
            <input name="name" type="text" class="form-control" id="nameInput" value="${deviceType.name}" required>
        </div>
        <div class="mb-3">
            <label for="descriptionInput" class="form-label">Description</label>
            <textarea name="description" class="form-control" id="descriptionInput">${deviceType.description}</textarea>
        </div>
        <button class="btn btn-primary" type="submit">Submit</button>
        </form>
    `);
    $("#deviceTypeModal").modal("show");
};

renderTable(currentPage);
renderPagination();
