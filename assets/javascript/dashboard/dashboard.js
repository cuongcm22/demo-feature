$(document).ready(function() {
    // Ensure the knob plugin is loaded before attempting to use it
    if ($.fn.knob) {
      // Initialize the knob
      $(".dial").knob();
    } else {
      console.error("jQuery Knob plugin not loaded properly.");
    }
  });

Chart.defaults.global.defaultFontFamily = "Poppins";
let ctx = document.querySelector("#revenueChart");
ctx.height = 53;

let revChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "Sept 1",
      "Sept 3",
      "Sept 6",
      "Sept 9",
      "Sept 12",
      "Sept 15",
      "Sept 18",
      "Sept 21",
      "Sept 24",
      "Sept 27",
      "Sept 30"
    ],
    datasets: [
      {
        label: "Views",
        borderColor: "green",
        backgroundColor: "rgba(235, 247, 245, 0.5)",
        data: [0, 30, 60, 25, 60, 25, 50, 10, 50, 90, 120]
      },
      {
        label: "Watch time",
        borderColor: "blue",
        backgroundColor: "rgba(233, 238, 253, 0.5)",
        data: [0, 60, 25, 100, 20, 75, 30, 55, 20, 60, 20]
      }
    ]
  },
  options: {
    responsive: true,
    tooltips: {
      intersect: false,
      node: "index"
    }
  }
});

// Render table

function renderUserList() {
  var userList = document.getElementById('table1-body');
  userList.innerHTML = ''; // Clear previous content

  arrUserIdsNotReturned.forEach(function(userObj) {
    var user = userObj.user;
    var numDevice = userObj.numDevice;
    var row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.fullname}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td style="display: flex; align-items: center;">
      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" style="width: 12px;"><!-- !Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#0d6efd" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path></svg>
      <a style="text-decoration: none; margin-left: 10px;" href="tel:${user.phone}">${user.phone}</a>
      </td>
      <td>${numDevice}</td>
    `;
    userList.appendChild(row);
  });
}

// Call the function to render user list on page load
renderUserList();

function renderLoanList() {
  var loanList = document.getElementById('loan-list');
  loanList.innerHTML = ''; // Clear previous content

  arrDeviceIdsDue.forEach(function(loan) {
    var row = document.createElement('tr');
    row.innerHTML = `
      <td>${loan.fullname}</td>
      <td>${loan.borrower}</td>
      <td>${loan.device}</td>
      <td style="display: flex; align-items: center;">
      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" style="width: 12px;"><!-- !Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#0d6efd" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path></svg>
      <a style="text-decoration: none; margin-left: 10px;" href="tel:${loan.phone}">${loan.phone}</a>
      </td>
      <td>${new Date(loan.borrowedAt).toLocaleString()}</td>
      <td>${new Date(loan.expectedReturnDate).toLocaleDateString()}</td>
    `;
    loanList.appendChild(row);
  });
}

// Call the function to render device loan list on page load
renderLoanList();