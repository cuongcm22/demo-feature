async function handleRegister(event) {
    await axios.post('/user/register', {
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value,
        studentID: document.querySelector('#id_student').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phoneNumber').value
    }).then(result => {
        console.log(result)
        if (result.data.success) {
            alert('Đăng kí thành công!')
            window.location.assign(window.location.origin + '/user/login');
        }

    }).catch(err => {
        console.log(err)
        if (!err.response.data.success) {
            alert('Đăng kí thất bại, vui lòng thử tên người khác')
        }
    })
}