// Populate device select options
var deviceSelect = document.getElementById("deviceSelect");
mockData.devices.forEach(function(device) {
    var option = document.createElement("option");
    option.text = device;
    deviceSelect.add(option);
});