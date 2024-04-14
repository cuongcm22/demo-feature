$(document).ready(function () {
    $("#spinner").hide();
    const tableBody = $("#deviceTypesTableBody");
    const pagination = $("#pagination");
    const itemsPerPage = 5;
    let currentPage = 1;
    let filteredData = mockData.slice(); // Tạo một bản sao của dữ liệu để tìm kiếm

    function renderTable(page) {
        tableBody.html("");
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

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
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const li = $(`<li class="page-item"><a class="page-link" href="#">${i}</a></li>`);
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
        var confirmation = confirm("Are you sure you want to delete this device type?");
        if (confirmation) {
            handleDelete(deviceTypeName);
        }
    }

    window.deleteDeviceType = deleteDeviceType

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
                    window.location.assign(window.location.origin + "/devicetypes/detail");
                }
            },
            error: function (err) {
                console.error(err);
            },
        });
    }

    window.showDeviceTypeDetails = function (deviceTypeName) {
        const deviceType = filteredData.find((dt) => dt.name === deviceTypeName);
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

    function searchFunction() {
        const input = $("#searchInput").val().trim().toLowerCase();
        filteredData = mockData.filter(deviceType =>
            deviceType.name.toLowerCase().includes(input) ||
            deviceType.description.toLowerCase().includes(input)
        );
        currentPage = 1;
        renderTable(currentPage);
        renderPagination();
    }

    renderTable(currentPage);
    renderPagination();

    // Sự kiện tìm kiếm khi nhập vào ô tìm kiếm
    // $("#searchInput").on("input", searchFunction);
    $('#searchButton').on('click', searchFunction);
    const tempMockData = mockData;
    $(".switchRetrieveAllData").change(function () {
        // Check if the checkbox is checked
        if ($(this).is(":checked")) {
            // If checked, do something
            retrieveDeviceTypesData();
        } else {
            // If not checked, do something else
            mockData = tempMockData;
            searchFunction();
        }
    });

    function retrieveDeviceTypesData(callback) {
        $("#spinner").show();
        $.ajax({
            url: "/devicetypes/retrieve",
            method: "GET",
            success: function (data) {
                mockData = data.data;
                $("#spinner").hide();
                searchFunction();
            },
            error: function (xhr, status, error) {
                // Xử lý lỗi
                console.error("Error:", status, error);
            },
        });
    }
});
