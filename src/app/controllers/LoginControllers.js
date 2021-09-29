class LoginControllers {
    
    facebook(req, res, next){
        res.send("login with facebook");
    }
    google(req, res, next) {
        res.send("login with google");
    }
    check(req, res, next) {
        res.send("check login");
    }
}

module.exports = new LoginControllers();
