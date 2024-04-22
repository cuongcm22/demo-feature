var modalBody = document.getElementById("modalBody");

// Function to create device card
function createDeviceCard(device, index) {
    const card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
    <div class="card h-100">
    <p class="idDevice" hidden>${device._id}</p>
    <img style="height: 200px; object-fit: cover" src="${device.imageUrl ? device.imageUrl : '/public/images/image_placeholder.jpg'}" class="card-img-top" alt="Device Image">
    <div class="card-body">
    <h5 class="card-title">${device.name}</h5>
    <p class="card-text">Description: ${device.description}</p>
    <p class="card-text">Purchase Date: ${new Date(
        device.purchaseDate
    ).toLocaleDateString()}</p>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"  onclick="populateTable(event)">Mượn thiết bị</button>
    </div>
    </div>
    `;
    return card;
}
// Function to render device cards
function renderDeviceCards(data) {
    const container = document.getElementById("deviceContainer");
    container.innerHTML = "";
    data.forEach((device, index) => {
        const card = createDeviceCard(device, index);
        container.appendChild(card);
    });
}
// Function to create sidebar with device types
function createDeviceTypeList(types) {
    const list = document.querySelectorAll("#deviceTypeList");
    list.forEach((i) => {
        i.innerHTML = "";
        types.forEach((type) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = type;
            listItem.addEventListener("click", () => filterDevicesByType(type));
            i.appendChild(listItem);
        });
    });
}
// Filter devices based on selected device type
function filterDevicesByType(type) {
    if (type === "All") {
        renderDeviceCards(mockData);
    } else {
        const filteredDevices = mockData.filter(
            (device) => device.deviceType === type
        );
        renderDeviceCards(filteredDevices);
    }
}
// Render all device types and devices on page load
window.onload = function () {
    createDeviceTypeList(["All", ...deviceTypes]); // Include 'all' option
    renderDeviceCards(mockData);
};

// Function to populate device loan table
function populateTable(event) {
    const id = event.target.parentElement.parentElement.querySelector(".idDevice").textContent
    const device = mockData.find(item => item._id === id);
    modalBody.innerHTML = `
    <h3 class="card-title">${device.name}</h3>
    <img style="width: 100%; height: 220px; object-fit: contain;" id="deviceImage" src="${device.imageUrl ? device.imageUrl : '/public/images/image_placeholder.jpg'}" alt="Tivi Image">
    <video style="width: 100%; height: 220px; object-fit: contain;" id="deviceVideo" controls ${device.videoUrl ? '' : 'hidden'}>
    <source src="${device.videoUrl}" type="video/mp4">
    Your browser does not support the video tag.
    </video>
    <p class="card-text"><strong>Loại:</strong> ${device.deviceType}</p>
    <p class="card-text"><strong>Vị trí:</strong> ${device.location}</p>
    <p class="card-text"><strong>Nhà cung cấp:</strong> ${device.supplier}</p>
    <p class="card-text"><strong>Mô tả:</strong> ${device.description}</p>
    <p class="card-text"><strong>Ngày mua:</strong> ${new Date(
        device.purchaseDate
    ).toLocaleDateString()}</p>
    <div class="mb-3">
    <label class="form-label" for="expectedReturnDate">Ngày trả dự kiến</label>
    <input
        class="form-control"
        id="expectedReturnDate"
        type="date"
        name="expectedReturnDate"
        required=""
        />
    </div>
    <div class="d-flex justify-content-end"> <!-- Flex container for buttons -->
      <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
      <button type="button" class="btn btn-primary" onclick="confirmLoan('${device.serialNumber}')">Mượn thiết bị</button>
    </div>
    `;
}

// Function to confirm loan
function confirmLoan(deviceId) {
    // Get a reference to your modal
    var cancelButton = document.querySelector('.btn-secondary[data-bs-dismiss="modal"]');

    const confirmed = confirm("Xác nhận bạn muốn trả thiết bị này?");
    if (confirmed) {
        // Gửi sự kiện click tới nút "Hủy"
        cancelButton.click();
        // Send device ID to loan route
        axios
            .post("/device/return", { 
                deviceId: deviceId
             })
            .then((response) => {
                if (response.data.success) {
                    alert("Trả thiết bị thành công!");

                    const deviceToDelete = mockData.find(
                        (device) => device.serialNumber == deviceId
                    );
                    const index = mockData.indexOf(deviceToDelete);
                    mockData.splice(index, 1);

                    renderDeviceCards(mockData);
                } else {
                    alert(
                        "Trả thiết bị không thành công, vui lòng liên hệ admin để giải quyết vấn đề."
                    );
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}


$(document).ready(function () {
    const deviceContainer = $("#deviceContainer");
    const pagination = $("#pagination");
    const itemsPerPage = 12;
    let currentPage = 1;
    let filteredData = mockData.slice(); // Create a copy of mockData for searching

    // Function to render device cards
    function renderDeviceCards(data) {
        deviceContainer.html("");
        data.forEach((device, index) => {
            const card = createDeviceCard(device, index);
            deviceContainer.append(card);
        });
    }

    // Function to render pagination
    function renderPagination() {
        pagination.html("");
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const li = $(`<li class="page-item"><a class="page-link" href="#">${i}</a></li>`);
            li.click(() => {
                currentPage = i;
                renderDeviceCards(getCurrentPageData());
                highlightCurrentPage();
            });
            pagination.append(li);
        }
        highlightCurrentPage();
    }

    // Function to highlight current page in pagination
    function highlightCurrentPage() {
        const pages = pagination.find(".page-item");
        pages.removeClass("active");
        pages.eq(currentPage - 1).addClass("active");
    }

    // Function to filter devices based on search input
    function searchFunction() {
        const input = $("#searchInput").val().trim().toLowerCase();
        filteredData = mockData.filter(
            (device) =>
            device.name.toLowerCase().includes(input) ||
            device.description.toLowerCase().includes(input) ||
            device.purchaseDate.toLowerCase().includes(input) ||
            device.deviceType.toLowerCase().includes(input) ||
            device.location.toLowerCase().includes(input) ||
            device.supplier.toLowerCase().includes(input)
        );
        currentPage = 1; // Reset to the first page after each search
        renderDeviceCards(getCurrentPageData());
        renderPagination();
    }

    // Function to get data for the current page
    function getCurrentPageData() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }

    // Event listener for search button click
    $("#searchButton").on("click", searchFunction);

    // Initial render
    renderDeviceCards(getCurrentPageData());
    renderPagination();
});