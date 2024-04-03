module.exports.homePage = async (req, res, next) => {
    try {
        res.render("./main", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'User': '/user/login',
                'Device': '/device/report',
                'Record loan': '/device/loanrecord',
            }
        });
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}

module.exports.errorPage = async (req, res, next) => {
    try {
        res.render("error404");
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}