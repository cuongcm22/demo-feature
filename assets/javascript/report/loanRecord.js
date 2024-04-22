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
    <td>${record.actualReturnDate ? record.actualReturnDate : "-"}</td>
    <td>${record.transactionStatus}</td>
    </tr>
    `;
            loanTableBody.append(row);
        });
    }
    function renderPagination() {
        pagination.html("");
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
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
                console.log(data);
                mockData = data.data;
                console.log(mockData);
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

