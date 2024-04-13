
$(document).ready(function () {

    function deleteSupplier(index, supplierName) {
        console.log(supplierName);
        // Prompt the user for confirmation
        var confirmation = confirm(
            "Are you sure you want to delete this device?"
        );
        // If the user confirms the deletion
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
                    alert('Xóa nhà cung cấp thành công')
                    window.location.assign(window.location.origin + '/suppliers/detail');
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    }

    window.deleteSupplier = deleteSupplier; // Define deleteSupplier globally

    const supplierTableBody = $("#supplierTableBody");
    mockData.forEach((supplier, index) => {
        const row = `
            <tr>
                <td>${supplier.name}</td>
                <td>${supplier.address}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.email}</td>
                <td><button class="btn btn-primary" onclick="showSupplierDetails(${index})">Details</button></td>
                <td><button class="btn btn-danger" onclick="deleteSupplier(${index}, '${supplier.name}')">Delete</button></td>
            </tr>
        `;
        supplierTableBody.append(row);
    });

    window.showSupplierDetails = function (index) {
        const supplier = mockData[index];
        $("#name-holder").val(supplier.name);
        $("#name").val(supplier.name);
        $("#address").val(supplier.address);
        $("#phone").val(supplier.phone);
        $("#email").val(supplier.email);
        $("#supplierModal").modal("show");
    };

});
