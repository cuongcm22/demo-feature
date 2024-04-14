
// const tableBody = $("#locationTableBody");
// const pagination = $("#pagination");
// const itemsPerPage = 5;
// let currentPage = 1;

// function renderTable(page) {
//     tableBody.html("");
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const paginatedData = mockData.slice(startIndex, endIndex);

//     paginatedData.forEach((location, index) => {
//         const row = `
//             <tr>
//             <td>${startIndex + index + 1}</td>
//               <td>${location.name}</td>
//               <td>${location.description}</td>
//               <td>${location.address}</td>
//               <td>
//                 <button class="btn badge bg-primary" onclick="showModal('${
//                     location.name
//                 }')">Sửa</button>
//                 <button class="btn badge bg-danger" onclick="deleteLocations('${
//                     location.name
//                 }')">Xóa</button>
//               </td>
//             </tr>
//           `;
//         tableBody.append(row);
//     });
// }

// function renderPagination() {
//     pagination.html("");
//     const totalPages = Math.ceil(mockData.length / itemsPerPage);
//     for (let i = 1; i <= totalPages; i++) {
//         const li = $(
//             `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
//         );
//         li.click(() => {
//             currentPage = i;
//             renderTable(currentPage);
//             highlightCurrentPage();
//         });
//         pagination.append(li);
//     }
//     highlightCurrentPage();
// }

// function highlightCurrentPage() {
//     const pages = pagination.find(".page-item");
//     pages.removeClass("active");
//     pages.eq(currentPage - 1).addClass("active");
// }

// function deleteLocations(locationName) {
//     var confirmation = confirm(
//         "Are you sure you want to delete this location?"
//     );
//     if (confirmation) {
//         handleDelete(locationName);
//     }
// }

// function handleDelete(locationName) {
//     $.ajax({
//         url: "/locations/delete",
//         method: "POST",
//         data: {
//             locationName: locationName,
//         },
//         success: function (res) {
//             if (res) {
//                 alert("Location deleted successfully");
//                 window.location.assign(
//                     window.location.origin + "/locations/detail"
//                 );
//             }
//         },
//         error: function (err) {
//             console.error(err);
//         },
//     });
// }

// window.showModal = function (locationName) {
//     const location = mockData.find((loc) => loc.name === locationName);
//     $("#locationName-holder").val(location.name);
//     $("#locationName").val(location.name);
//     $("#locationDescription").val(location.description);
//     $("#locationAddress").val(location.address);
//     const modal = new bootstrap.Modal($("#locationModal"));
//     modal.show();
// };

// renderTable(currentPage);
// renderPagination();

$(document).ready(function () {
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

    $('#searchInput').on('input', searchFunction);

    renderTable(currentPage);
    renderPagination();
});
