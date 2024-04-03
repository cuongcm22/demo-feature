
// Function to populate device loan table
function populateTable(devices) {
    var tableBody = document.getElementById("deviceLoanTableBody");
    tableBody.innerHTML = ""; // Clear previous content
    devices.forEach(function(device, index) {
        var row = document.createElement("tr");
        row.innerHTML = `
<td>${device.name}</td>
<td>${device.type}</td>
<td>${device.initStatus === 'used' ? 'Đã mượn' : 'Chưa mượn'}</td>
<td>${device.location}</td>
<td>${device.purchaseDate}</td>
<td>${device.warrantyExpiry}</td>
<td>
<button class="btn btn-primary" onclick="detailDevice(event, ${index})">Detail</button>
<button class="btn btn-success" onclick="updateDevice(event, ${index})">Update</button>
<button class="btn btn-danger" onclick="deleteDevice(event, ${index}, '${device.id}')">Delete</button>
</td>
`;
        tableBody.appendChild(row);
    });
}
// Initial population of table
populateTable(mockData.devices);
// Detail function
function detailDevice(event, index) {
    const openModalBtn = document.getElementById('openModalBtn');
    const deviceModal = new bootstrap.Modal(document.getElementById('deviceModal'));
    // Sample device information
    populateModal(mockData.devices[index]); // Populate modal with device information
    deviceModal.show(); // Show modal
    // Event listener to close modal when clicked outside
    deviceModal._element.addEventListener('click', function(event) {
        if (event.target === deviceModal._element) {
            deviceModal.hide();
        }
    });
}
// Function to populate modal with device information
function populateModal(deviceInfo) {
    const modalBody = document.getElementById('modalBody');
    // Construct HTML to display device information
    modalBody.innerHTML = `
<div class="row">
<div class="col-md-6">
<div class="video-container">
<h2>Hình ảnh</h2>
<img style="max-width: 100%;" id="deviceImage" src="${deviceInfo.imageUrl ? deviceInfo.imageUrl : './images/image_placeholder.jpg'}" alt="Tivi Image">
</div>
</div>
<div class="col-md-6">
<div class="device-info">
<h2>Thông tin thiết bị</h2>
<ul>
<li><strong>Tên:</strong> ${deviceInfo.name}</li>
<li><strong>Loại:</strong> ${deviceInfo.type}</li>
<li><strong>ID:</strong> ${deviceInfo.id}</li>
<li><strong>Tình trạng:</strong> ${deviceInfo.status}</li>
<li><strong>Tình trạng ban đầu:</strong> ${deviceInfo.initStatus}</li>
<li><strong>Vị trí:</strong> ${deviceInfo.location}</li>
<li><strong>Nhà cung cấp:</strong> ${deviceInfo.supplier}</li>
<li><strong>Lịch sử:</strong> ${deviceInfo.history}</li>
<li><strong>Ngày mua:</strong> ${deviceInfo.purchaseDate}</li>
<li><strong>Hết hạn bảo hành:</strong> ${deviceInfo.warrantyExpiry}</li>
<li><strong>Ngày mượn:</strong> ${deviceInfo.createDate}</li>
<li><strong>Ngày trả:</strong> ${deviceInfo.updateDate}</li>
</ul>
</div>
</div>
<div class="col-md-12 text-center">
${deviceInfo.videoUrl ? `
<video style="max-width: 100%;" id="deviceVideo" controls style="display: none;">
<source src="${deviceInfo.videoUrl}" type="video/mp4">
Your browser does not support the video tag.
</video>
` : ''}
</div>
</div>
`;
}
// Update function
function updateDevice(event, index) {
    console.log(mockData.devices[index]);
    const openModalBtn = document.getElementById('openModalBtn');
    const deviceModal = new bootstrap.Modal(document.getElementById('deviceModal'));
    updateRenderDevice(mockData.devices[index]); // Populate modal with device information
    deviceModal.show(); // Show modal
    // Event listener to close modal when clicked outside
    deviceModal._element.addEventListener('click', function(event) {
        if (event.target === deviceModal._element) {
            deviceModal.hide();
        }
    });
}

function updateRenderDevice(deviceInfo) {
    const modalBody = document.getElementById('modalBody');
    var purchaseDateParts = deviceInfo.purchaseDate.split('/'); // Split the date string into parts
    var purchaseDate = purchaseDateParts[2] + '-' + purchaseDateParts[1] + '-' + purchaseDateParts[0];
    var warrantyExpiryParts = deviceInfo.warrantyExpiry.split('/'); // Split the date string into parts
    var warrantyExpiry = warrantyExpiryParts[2] + '-' + warrantyExpiryParts[1] + '-' + warrantyExpiryParts[0];
    var createDateParts = deviceInfo.createDate.split('/'); // Split the date string into parts
    var createDate = createDateParts[2] + '-' + createDateParts[1] + '-' + createDateParts[0];
    var updateDateParts = deviceInfo.updateDate.split('/'); // Split the date string into parts
    var updateDate = updateDateParts[2] + '-' + updateDateParts[1] + '-' + updateDateParts[0];
    modalBody.innerHTML = `
<h1>Update Device</h1>
<form action="/device/update" method="post" enctype="application/json" id="updateDeviceForm">
<div class="mb-3">
<input value="${deviceInfo.id}" name="id" hidden>
<label for="name" class="form-label">Name</label>
<input value="${deviceInfo.name}" type="text" class="form-control" id="name" name="name" placeholder="Enter device name">
</div>
<div class="mb-3">
<label for="type" class="form-label">Type</label>
<input value="${deviceInfo.type}" type="text" class="form-control" id="type" name="type" placeholder="Enter device type">
</div>
<div class="mb-3">
<label for="deviceStatus" class="form-label">Trạng thái thiết bị: (devices.status)</label>
<select class="form-select" id="deviceStatus" name="status" required>
    <option value="new" ${deviceInfo.status === 'new' ? 'selected' : ''}>Mới</option>
    <option value="likenew" ${deviceInfo.status === 'likenew' ? 'selected' : ''}>Hàng đã qua sử dụng</option>
</select>
</div>
<div class="mb-3">
<label for="deviceInitStatus" class="form-label">Trạng thái: (devices.initStatus)</label>
<select class="form-select" id="deviceInitStatus" name="initStatus" required>
    <option value="used" ${deviceInfo.initStatus === 'used' ? 'selected' : ''}>Đã mượn</option>
    <option value="notused" ${deviceInfo.initStatus === 'notused' ? 'selected' : ''}>Chưa mượn</option>
</select>
</div>
<div class="mb-3">
<label for="location" class="form-label">Location</label>
<input value="${deviceInfo.location}" type="text" class="form-control" id="location" name="location" placeholder="Enter device location">
</div>
<div class="mb-3">
<label for="supplier" class="form-label">Supplier</label>
<input value="${deviceInfo.supplier}" type="text" class="form-control" id="supplier" name="supplier" placeholder="Enter device supplier">
</div>
<div class="mb-3">
<label for="purchaseDate" class="form-label">Purchase Date</label>
<input value="${purchaseDate}" type="date" class="form-control" name="purchaseDate" id="purchaseDate">
</div>
<div class="mb-3">
<label for="warrantyExpire" class="form-label">Warranty Expire</label>
<input value="${warrantyExpiry}" type="date" class="form-control" name="warrantyExpiry" id="warrantyExpire">
</div>
<div class="mb-3">
<label for="createDate" class="form-label">Loan Date</label>
<input value="${createDate}" type="date" class="form-control" name="createDate" id="createDate">
</div>
<div class="mb-3">
<label for="updateDate" class="form-label">Return Date</label>
<input value="${updateDate}" type="date" class="form-control" name="updateDate" id="updateDate">
</div>
<button type="submit" class="btn btn-primary">Update</button>
</form>
`
}
// Delete function
async function deleteDevice(event, index, id) {
    // Prompt the user for confirmation
    var confirmation = confirm("Are you sure you want to delete this device?");
    // If the user confirms the deletion
    if (confirmation) {

        handleDelete(id, index)

    }
}

function handleDelete(idDevice, index) {
    axios.post('/device/delete', {
        id: `${idDevice}`
    }).then(res => {
        console.log(res)
        if (!res.data.success) {
            alert('Không thể xóa thiết bị đã có người mượn')
        } else {
            /*
            Tham số đầu tiên (1) là chỉ mục của phần tử bạn muốn bắt đầu xóa.
            Tham số thứ hai (1) là số lượng phần tử bạn muốn xóa từ chỉ mục đã chỉ định.
            */
            mockData.devices.splice(index, 1);
            // Rerender table
            populateTable(mockData.devices);

            alert('Xóa thiết bị thành công')
        }
    })
}
// Search function
document.getElementById("searchInput").addEventListener("keyup", function() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0]; // Search based on device name (first column)
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // Show row if search matches
            } else {
                tr[i].style.display = "none"; // Hide row if search does not match
            }
        }
    }
});