$(document).ready(function () {
    $("#spinner").hide();
    const loanTableBody = $("#loanTableBody");
    const pagination = $("#pagination");
    const itemsPerPage = 5;
    let currentPage = 1;
    let filteredData = mockData.slice(); // Create a copy of mockData for searching
    function renderTable(page) {
        loanTableBody.html("");
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        paginatedData.forEach((record, index) => {
            const row = `
            <tr>
            <td>${startIndex + index + 1}</td>
            <td>${record.device}</td>
            <td>${record.username}</td>
            <td>${record.borrowedAt}</td>
            <td>${record.expectedReturnDate}</td>
            <td>${record.actualReturnDate ? record.actualReturnDate : "-"}</td>
            <td>${record.transactionStatus}</td>
            </tr>
            `;
            loanTableBody.append(row);
        });

        document.getElementById(
            "showingInfo"
        ).textContent = `Showing ${paginatedData.length} of ${filteredData.length} total Devices`;
    }

    function renderPagination() {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const maxVisiblePages = 3; // Maximum number of visible page links
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
        const pageInput = document.getElementById("pageInput").value;
        if (
            pageInput >= 1 &&
            pageInput <= Math.ceil(filteredData.length / itemsPerPage)
        ) {
            currentPage = parseInt(pageInput);
            renderTable(currentPage);
            renderPagination();
        } else {
            alert("Trang không tồn tại");
        }
    }

    window.goToPage = goToPage;
    function highlightCurrentPage() {
        const pages = pagination.find(".page-item");
        pages.removeClass("active");
        pages.eq(currentPage - 1).addClass("active");
    }

    function searchFunction() {
        const input = $("#searchInput").val().trim().toLowerCase();
        filteredData = mockData.filter(
            (record) =>
                record.device.toLowerCase().includes(input) ||
                record.username.toLowerCase().includes(input) ||
                record.borrowedAt.toLowerCase().includes(input) ||
                (record.actualReturnDate &&
                    record.actualReturnDate.toLowerCase().includes(input)) ||
                record.transactionStatus.toLowerCase().includes(input)
        );
        currentPage = 1; // Reset to the first page after each search
        renderTable(currentPage);
        renderPagination();
    }

    renderTable(currentPage);
    renderPagination();

    $("#searchButton").on("click", searchFunction);

    var tempMockData = mockData;
    $(".switchRetrieveAllData").change(function () {
        // Check if the checkbox is checked
        if ($(this).is(":checked")) {
            // If checked, do something
            retrieveSupplierData();
        } else {
            // If not checked, do something else
            mockData = tempMockData;
            searchFunction();
        }
    });

    function retrieveSupplierData(callback) {
        $("#spinner").show();
        $.ajax({
            url: "/record/loan/retrieveall",
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
