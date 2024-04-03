// Thêm dữ liệu từ mockData vào bảng
const dataBody = document.getElementById("dataBody");
mockData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
<td>${item.username}</td>
<td>${item.deviceID}</td>
<td>${item.borrowedAt.toLocaleString()}</td>
<td>${item.returnedAt.toLocaleString()}</td>
<td>${item.status}</td>
<td>${item.notes ? `${item.notes}` : ""}</td>
`;
    dataBody.appendChild(row);
});

const searchInput = document.getElementById("searchInput");

function search() {
    const searchText = searchInput.value.toLowerCase();
    const filteredData = mockData.filter((item) => {
        return (
            item.username.toLowerCase().includes(searchText) ||
            item.deviceID.toLowerCase().includes(searchText)
        );
    });
    renderTable(filteredData);
}

function renderTable(data) {
    dataBody.innerHTML = "";
    data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
<td>${item.username}</td>
<td>${item.deviceID}</td>
<td>${item.borrowedAt.toLocaleString()}</td>
<td>${item.returnedAt.toLocaleString()}</td>
<td>${item.status}</td>
<td>${item.notes}</td>
`;
        dataBody.appendChild(row);
    });
}
searchInput.addEventListener("input", search);
// Hiển thị bảng với dữ liệu mặc định ban đầu
renderTable(mockData);
