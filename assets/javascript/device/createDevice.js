var resultContainer = document.getElementById("qr-reader-results");
var lastResult,
    countResults = 0;

function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
        // Handle on success condition with the decoded message.
        // console.log(`Scan result ${decodedText}`, decodedResult);
        document.getElementById("serialNumber").value = decodedText;
    }
}
var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
    fps: 10,
    qrbox: 250,
});
html5QrcodeScanner.render(onScanSuccess);

// Function to populate the dropdown with options
function populateDropdown() {
    var dropdown = document.getElementById("imageSelect");
    // Clear existing options
    dropdown.innerHTML = "";
    // Add a default option
    var defaultOption = document.createElement("option");
    defaultOption.text = "--Chọn ảnh--";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.add(defaultOption);
    // Add options for each image URL
    data.imageUrl.forEach(function (image, index) {
        var option = document.createElement("option");
        option.value = image;
        option.text = "Ảnh " + (index + 1);
        dropdown.add(option);
    });
}
// Call the function to populate the dropdown when the page loads
window.onload = function () {
    populateDropdown();
};
// Function to change the displayed image when a different option is selected
function changeImage(selectElement) {
    // console.log(selectElement)
    var selectedImage = selectElement.value;
    var imageRender = document.getElementById("imageRender");
    // Set the src of the img tag to display the selected image
    imageRender.src = selectedImage;
}

function renderVideo(input) {
    var videoRender = document.getElementById("videoRender");
    var file = input.files[0];
    var videoURL = URL.createObjectURL(file);
    // Thiết lập src của thẻ video để hiển thị video
    videoRender.src = videoURL;
    // Hiển thị thẻ video
    videoRender.style.display = "block";
    // Tự động phát video sau khi được tải lên
    videoRender.autoplay = true;
}

function convertToBase64AndLog() {
    // Lấy element select và option được chọn
    var selectElement = document.getElementById("imageSelect");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    console.log(selectedOption);
    // Kiểm tra xem option đã chọn có giá trị không
    if (selectedOption.value) {
        // Tạo một XMLHttpRequest để tải ảnh từ URL
        var xhr = new XMLHttpRequest();
        xhr.open('GET', selectedOption.value, true);
        xhr.responseType = 'blob';
  
        // Xử lý khi tải xong
        xhr.onload = function(event) {
          var blob = xhr.response;
          
          // Tạo một FileReader để đọc file blob
          var reader = new FileReader();
  
          // Xử lý khi đọc file hoàn thành
          reader.onload = function() {
            // Lấy dữ liệu base64 từ file đã chọn
            var base64Image = reader.result;
  
            // Log dữ liệu base64 ra console
            // console.log("Base64 image data:", base64Image);

            // Tạo URL đối tượng blob
            var blobUrl = URL.createObjectURL(blob);

            // Log URL đối tượng blob ra console
            console.log("Blob URL:", blobUrl);


            document.querySelector('#imageRender').src = blobUrl
          };
  
          // Đọc file dưới dạng base64
          reader.readAsDataURL(blob);
        };
  
        // Bắt đầu tải ảnh
        xhr.send();
    }
  }