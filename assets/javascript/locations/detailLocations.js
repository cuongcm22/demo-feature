
$(document).ready(function () {
    $("#spinner").hide();
    const tableBody = $("#locationTableBody");
    const pagination = $("#pagination");
    const itemsPerPage = 5;
    let currentPage = 1;
    let filteredData = mockData.slice(); // Tạo một bản sao của dữ liệu để tìm kiếm

    function renderTable(page) {
        tableBody.html("");
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        paginatedData.forEach((location, index) => {
            const row = `
                <tr>
                    <td>${startIndex + index + 1}</td>
                    <td>${location.name}</td>
                    <td>${location.description}</td>
                    <td>${location.address}</td>
                    <td>
                        <button class="btn badge bg-primary" onclick="showModal('${location.name}')">Sửa</button>
                        <button class="btn badge bg-danger" onclick="deleteLocations('${location.name}')">Xóa</button>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });

        document.getElementById(
            "showingInfo"
        ).textContent = `Showing ${paginatedData.length} of ${filteredData.length} total Locations`;
    }

    function renderPagination() {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const maxVisiblePages = 5; // Maximum number of visible page links
        const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
        let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        if (currentPage > halfMaxVisiblePages + 1) {
            pagination.appendChild(createPaginationLink(1, "First"));
            pagination.appendChild(createPaginationEllipsis());
        }
        for (let i = startPage; i <= endPage; i++) {
            pagination.appendChild(
                createPaginationLink(i, i.toString(), i === currentPage)
            );
        }
        if (totalPages - endPage > 1) {
            pagination.appendChild(createPaginationEllipsis());
            pagination.appendChild(createPaginationLink(totalPages, "Last"));
        }
    }
    function createPaginationLink(pageNumber, text, isActive = false) {
        const li = document.createElement("li");
        li.className = "page-item";
        if (isActive) {
            li.classList.add("active");
        }
        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = text;
        a.addEventListener("click", () => {
            currentPage = pageNumber;
            renderTable(currentPage);
            renderPagination();
        });
        li.appendChild(a);
        return li;
    }
    function createPaginationEllipsis() {
        const li = document.createElement("li");
        li.className = "page-item disabled";
        const span = document.createElement("span");
        span.className = "page-link";
        span.textContent = "...";
        li.appendChild(span);
        return li;
    }

    function goToPage() {
        const pageInput = document.getElementById('pageInput').value;
        if (pageInput >= 1 && pageInput <= Math.ceil(filteredData.length / itemsPerPage)) {
            currentPage = parseInt(pageInput);
            renderTable(currentPage);
            renderPagination();
        } else {
            alert('Trang không tồn tại');
        }
    }

    window.goToPage = goToPage

    function highlightCurrentPage() {
        const pages = pagination.find(".page-item");
        pages.removeClass("active");
        pages.eq(currentPage - 1).addClass("active");
    }

    function deleteLocations(locationName) {
        var confirmation = confirm("Are you sure you want to delete this location?");
        if (confirmation) {
            handleDelete(locationName);
        }
    }

    window.deleteLocations = deleteLocations

    function handleDelete(locationName) {
        $.ajax({
            url: "/locations/delete",
            method: "POST",
            data: {
                locationName: locationName,
            },
            success: function (res) {
                if (res) {
                    alert("Location deleted successfully");
                    window.location.assign(window.location.origin + "/locations/detail");
                }
            },
            error: function (err) {
                console.error(err);
            },
        });
    }

    window.showModal = function (locationName) {
        const location = filteredData.find((loc) => loc.name === locationName);
        $("#locationName-holder").val(location.name);
        $("#locationName").val(location.name);
        $("#locationDescription").val(location.description);
        $("#locationAddress").val(location.address);
        const modal = new bootstrap.Modal($("#locationModal"));
        modal.show();
    };

    function searchFunction() {
        const input = $("#searchInput").val().trim().toLowerCase();
        filteredData = mockData.filter(location =>
            location.name.toLowerCase().includes(input) ||
            location.description.toLowerCase().includes(input) ||
            location.address.toLowerCase().includes(input)
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
            retrieveLocationsData();
        } else {
            // If not checked, do something else
            mockData = tempMockData;
            searchFunction();
        }
    });

    function retrieveLocationsData(callback) {
        $("#spinner").show();
        $.ajax({
            url: "/locations/retrieve",
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
