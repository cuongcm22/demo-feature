function deleteDeviceType(index, deviceTypeName) {
    console.log(deviceTypeName);
    // Prompt the user for confirmation
    var confirmation = confirm(
        "Are you sure you want to delete this device type?"
    );
    // If the user confirms the deletion
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
                alert('Xóa nhà cung cấp thành công')
                window.location.assign(window.location.origin + '/devicetypes/detail');
            }
        },
        error: function (err) {
            console.error(err);
        }
    });
}

// Function to render device types table
function renderDeviceTypesTable() {
    const tableBody = document.getElementById("deviceTypesTableBody");
    tableBody.innerHTML = "";
    mockData.forEach((deviceType, index) => {
        const row = `<tr>
    <td>${deviceType.name}</td>
    <td>${deviceType.description}</td>
    <td><button type="button" class="btn btn-primary" onclick="showDeviceTypeDetails(${index})">Detail</button></td>
    <td><button type="button" class="btn btn-danger" onclick="deleteDeviceType(${index}, '${deviceType.name}')">Delete</button></td>
    </tr>`;
        tableBody.innerHTML += row;
    });
}
// Function to show device type details in modal
function showDeviceTypeDetails(index) {
    const deviceType = mockData[index];
    const modalBody = document.querySelector("#deviceTypeModal .modal-body");
    modalBody.innerHTML = `<form id="deviceTypeForm" action="/devicetypes/update" method="post">
    <div class="mb-3">
    <input name="nameholder" type="text" class="form-control" hidden readonly="" value="${deviceType.name}" required>
    <label for="nameInput" class="form-label">Name</label>
    <input name="name" type="text" class="form-control" id="nameInput" value="${deviceType.name}" required>
    </div>
    <div class="mb-3">
    <label for="descriptionInput" class="form-label">Description</label>
    <textarea name="description" class="form-control" id="descriptionInput">${deviceType.description}</textarea>
    </div>
    <button class="btn btn-primary" type="submit">Submit</button>
    </form>`;
    $("#deviceTypeModal").modal("show");
}
// Initial rendering of device types table
renderDeviceTypesTable();
