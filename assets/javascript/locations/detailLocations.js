$(document).ready(function () {

    function deleteLocations(locationName) {
        console.log(locationName);
        // Prompt the user for confirmation
        var confirmation = confirm(
            "Are you sure you want to delete this location?"
        );
        // If the user confirms the deletion
        if (confirmation) {
            handleDelete(locationName);
        }
    }

    function handleDelete(locationName) {
        $.ajax({
            url: "/locations/delete",
            method: "POST",
            data: {
                locationName: locationName,
            },
            success: function (res) {
                if (res) {
                    alert('Xóa vị trí thành công');
                    window.location.assign(window.location.origin + '/locations/detail');
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    }

    window.deleteLocations = deleteLocations; // Define deleteLocations globally

    const locationTableBody = $("#locationTableBody");
    // Loop through mockdata and populate table
    mockdata.forEach((location) => {
        const row = `
            <tr>
                <td>${location.name}</td>
                <td>${location.description}</td>
                <td>${location.address}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="showModal('${location.name}')">Detail</button>
                </td>
                <td><button class="btn btn-danger" onclick="deleteLocations('${location.name}')">Delete</button></td>
            </tr>
        `;
        locationTableBody.append(row);
    });

    window.showModal = function (locationName) {
        // Find the location object in mockdata
        const location = mockdata.find((loc) => loc.name === locationName);
        // Populate modal with location information
        $("#locationName-holder").val(location.name);
        $("#locationName").val(location.name);
        $("#locationDescription").val(location.description);
        $("#locationAddress").val(location.address);
        // Show the modal
        const modal = new bootstrap.Modal($("#supplierModal"));
        modal.show();
    };

});
