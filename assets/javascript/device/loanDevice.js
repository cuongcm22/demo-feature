// Populate device select options
var deviceSelect = document.getElementById("deviceSelect");
var deviceInfo = document.getElementById("deviceInfo");
data.forEach(function (device) {
    var option = document.createElement("option");
    option.value = device.deviceID;
    option.textContent = device.deviceName;
    deviceSelect.appendChild(option);
});
// Function to display device info when selected
deviceSelect.addEventListener("change", function () {
    var selectedDeviceID = deviceSelect.value;
    var selectedDevice = data.find(function (device) {
        return device.deviceID === selectedDeviceID;
    });
    if (selectedDevice) {
        deviceInfo.innerHTML = `
<h4>Device Information:</h4>
<p><strong>Device Name:</strong> ${selectedDevice.deviceName}</p>
<p><strong>Location:</strong> ${selectedDevice.deviceLocation}</p>
<p><strong>Supplier:</strong> ${selectedDevice.deviceSupplier}</p>
${
    selectedDevice.deviceImage
        ? `<img class="w-100" src="../../${selectedDevice.deviceImage}" alt="Device Image">`
        : ""
}
${
    selectedDevice.deviceVideo
        ? `<video class="w-100" controls><source src="../../${selectedDevice.deviceVideo}" type="video/mp4"></video>`
        : ""
}
`;
    } else {
        deviceInfo.innerHTML = ""; // Clear device info if no device selected
    }
});
