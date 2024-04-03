async function handleLogin(event) {
    await axios.post('/user/login', {
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value,
    }).then(result => {
        console.log(result)
        if (result.data.success) {
            alert('Đăng nhập thành công!')
            window.location.assign(window.location.origin + '/');
        }

    }).catch(err => {
        console.log(err)
        if (!err.response.data.success) {
            alert('Đăng nhập thất bại, vui lòng kiểm tra lại tên người dùng hoặc mật khẩu')
        }
    })
}