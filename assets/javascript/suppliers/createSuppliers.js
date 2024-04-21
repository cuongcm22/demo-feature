

document.addEventListener("DOMContentLoaded", function() {
    const checkBtn = document.getElementById("checkBtn");
    const nameInput = document.getElementById("name");
    const nameCheck = document.getElementById("nameCheck");

    checkBtn.addEventListener("click", function() {
        const inputName = nameInput.value.trim();
        const found = suppliers.includes(inputName);
        if (found) {
            nameCheck.textContent = "Nhà cung cấp đã tồn tại.";
            nameCheck.classList.remove("text-success");
            nameCheck.classList.add("text-danger");
        } else {
            nameCheck.textContent = "Bạn có thể sử dụng tên nhà cung cấp này.";
            nameCheck.classList.remove("text-danger");
            nameCheck.classList.add("text-success");
        }
    });
});


(function () {
    'use strict'

    var form = document.getElementById('supplierForm')

    form.addEventListener('submit', function (event) {
      if (!form.checkValidity() || !validatePhone() || !validateEmail()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    })

    function validatePhone() {
      var phoneInput = document.getElementById('phone')
      var phoneRegex = /^\d{10}$/
      return phoneRegex.test(phoneInput.value)
    }

    function validateEmail() {
      var emailInput = document.getElementById('email')
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(emailInput.value)
    }
  })()