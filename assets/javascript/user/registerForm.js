function handleRegister(event) {
    event.preventDefault();
    if (validateForm()) {
        // Form is valid, proceed with registration
        // You can submit the form or perform other actions here
    }
}

function validateForm() {
    let valid = true;

    // Validate Name
    const nameInput = document.forms["registerForm"]["username"];
    if (nameInput.value.trim() === "") {
        nameInput.classList.add("is-invalid");
        valid = false;
    } else {
        nameInput.classList.remove("is-invalid");
    }

    // Validate Password
    const passwordInput =
        document.forms["registerForm"]["password"];
    if (passwordInput.value.trim() === "") {
        passwordInput.classList.add("is-invalid");
        valid = false;
    } else {
        passwordInput.classList.remove("is-invalid");
    }

    // Validate Email
    const emailInput = document.forms["registerForm"]["email"];
    if (
        emailInput.value.trim() === "" ||
        !isValidEmail(emailInput.value.trim())
    ) {
        emailInput.classList.add("is-invalid");
        valid = false;
    } else {
        emailInput.classList.remove("is-invalid");
    }

    // Validate Phone
    const phoneInput = document.forms["registerForm"]["phone"];
    if (
        phoneInput.value.trim() === "" ||
        !isValidPhoneNumber(phoneInput.value.trim())
    ) {
        phoneInput.classList.add("is-invalid");
        valid = false;
    } else {
        phoneInput.classList.remove("is-invalid");
    }

    return valid;
}

function isValidEmail(email) {
    // You can implement a more sophisticated email validation if needed
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneNumber(phone) {
    // Validate if phone consists of 10 digits
    return /^\d{10}$/.test(phone);
}