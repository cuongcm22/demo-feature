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
      <td>${user.phone}</td>
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
      <td>${new Date(loan.borrowedAt).toLocaleString()}</td>
      <td>${new Date(loan.expectedReturnDate).toLocaleDateString()}</td>
    `;
    loanList.appendChild(row);
  });
}

// Call the function to render device loan list on page load
renderLoanList();