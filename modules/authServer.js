const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

module.exports.authenToken = async (req, res, next) => {
    try {
        const cookies = req.headers.cookie;
        // console.log(cookies);
        const cookiesArray = cookies.split("; ");
        const sessionToken = cookiesArray[2].split("=")[1];
        
        jwt.verify(sessionToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
            console.log(err, decodedData);
            if (err) {
                res.sendStatus(403) //Nếu token không hợp lệ hoặc hết hạn sẽ thông báo lỗi 403 tức người dùng không có quyền truy cập vào route này
            } else {
                
                // Check time stamp token (lưu ý trong product cần loại bỏ phần check time stamp)
                if (decodedData.exp) {
                    const expirationTime = new Date(decodedData.exp * 1000);
                    const currentTime = new Date();
                    if (expirationTime < currentTime) {
                        console.log('Token đã hết hạn');
                    } else {
                        req.user = decodedData
                        console.log('Token còn hiệu lực đến:', expirationTime);
                    }
                } else {
                    console.log('Token không chứa thông tin về thời gian hết hạn');
                }
    
                next(); // Nếu không sẽ next, người dùng sẽ có thể truy cập vào route books
                // Nếu token hợp lệ, bạn có thể kiểm tra thời gian hết hạn của nó
            }
        });
    } catch(error) {
        res.status(401).redirect("/user/login")
    }
}