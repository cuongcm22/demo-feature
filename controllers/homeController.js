module.exports.homePage = async (req, res, next) => {
    try {
        res.render("contents/home/home");
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