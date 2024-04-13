
// $(document).ready(function () {

//     function deleteSupplier(index, supplierName) {
//         console.log(supplierName);
//         // Prompt the user for confirmation
//         var confirmation = confirm(
//             "Are you sure you want to delete this device?"
//         );
//         // If the user confirms the deletion
//         if (confirmation) {
//             handleDelete(supplierName);
//         }
//     }

//     function handleDelete(supplierName) {
//         $.ajax({
//             url: "/suppliers/delete",
//             method: "POST",
//             data: {
//                 supplierName: supplierName,
//             },
//             success: function (res) {
//                 if (res) {
//                     alert('Xóa nhà cung cấp thành công')
//                     window.location.assign(window.location.origin + '/suppliers/detail');
//                 }
//             },
//             error: function (err) {
//                 console.error(err);
//             }
//         });
//     }

//     window.deleteSupplier = deleteSupplier; // Define deleteSupplier globally

//     const supplierTableBody = $("#supplierTableBody");
//     mockData.forEach((supplier, index) => {
//         const row = `
//             <tr>
//                 <td>${index}</td>
//                 <td>${supplier.name}</td>
//                 <td>${supplier.address}</td>
//                 <td>${supplier.phone}</td>
//                 <td>${supplier.email}</td>
//                 <td><button class="btn btn-primary" onclick="showSupplierDetails(${index})">Cập nhật</button></td>
//                 <td><button class="btn btn-danger" onclick="deleteSupplier(${index}, '${supplier.name}')">Xóa</button></td>
//             </tr>
//         `;
//         supplierTableBody.append(row);
//     });

//     window.showSupplierDetails = function (index) {
//         const supplier = mockData[index];
//         $("#name-holder").val(supplier.name);
//         $("#name").val(supplier.name);
//         $("#address").val(supplier.address);
//         $("#phone").val(supplier.phone);
//         $("#email").val(supplier.email);
//         $("#supplierModal").modal("show");
//     };

// });

$(document).ready(function () {

    const supplierTableBody = $("#supplierTableBody");
    const pagination = $("#pagination");
    const itemsPerPage = 5;
    let currentPage = 1;

    function renderTable(page) {
      supplierTableBody.html("");
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockData.slice(startIndex, endIndex);

      paginatedData.forEach((supplier, index) => {
        const row = `
          <tr>
            <td>${startIndex + index + 1}</td>
            <td>${supplier.name}</td>
            <td>${supplier.address}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.email}</td>
            <td>
              <button class="btn badge bg-primary" onclick="showSupplierDetails(${startIndex + index})">Sửa</button>
              <button class="btn badge bg-danger" onclick="deleteSupplier(${startIndex + index}, '${supplier.name}')">Xóa</button>
            </td>
          </tr>
        `;
        supplierTableBody.append(row);
      });
    }

    function renderPagination() {
      pagination.html("");
      const totalPages = Math.ceil(mockData.length / itemsPerPage);
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

    function deleteSupplier(index, supplierName) {
      console.log(supplierName);
      var confirmation = confirm("Are you sure you want to delete this supplier?");
      if (confirmation) {
        handleDelete(supplierName);
      }
    }

    function handleDelete(supplierName) {
      $.ajax({
        url: "/suppliers/delete",
        method: "POST",
        data: {
          supplierName: supplierName,
        },
        success: function (res) {
          if (res) {
            alert('Supplier deleted successfully');
            window.location.assign(window.location.origin + '/suppliers/detail');
          }
        },
        error: function (err) {
          console.error(err);
        }
      });
    }

    window.deleteSupplier = deleteSupplier;

    window.showSupplierDetails = function (index) {
      const supplier = mockData[index];
      $("#name-holder").val(supplier.name);
      $("#name").val(supplier.name);
      $("#address").val(supplier.address);
      $("#phone").val(supplier.phone);
      $("#email").val(supplier.email);
      $("#supplierModal").modal("show");
    };

    renderTable(currentPage);
    renderPagination();
  });