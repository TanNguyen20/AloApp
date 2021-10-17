const passport = require('passport');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const User = require('../models/user');
const md5 = require('md5');
const Account = require('../models/account');
const { mongooseToObject } = require('../../util/mongoose');
const { mulMgToObject } = require('../../util/mongoose');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const client = require('twilio')(accountSid, authToken);
const SECRET_KEY_EMAIL = process.env.SECRET_SEND_EMAIL;
//
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
//
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET,
});
//
class RegisterControllers {
    upload(req, res) {
        var dir = './src/public/assets/images/background2.jpg';
        cloudinary.uploader.upload(
            dir,
            {
                resource_type: "auto",
            },
            function (error, result) {
                console.log(result, error);
                res.json(result);
            });
    }
    registerDefault(req,res){
        const formData = req.body;
        formData.password = md5(formData.password);
        const account = new Account(formData);
        account.save()
        .then(() =>{
            res.send('thanhcong');
        })
        .catch(error =>{
            res.send('error');
        });
    }

    itOk(req, res, next) {
        res.json(req.user);
    }
    //kiem tra co ton tai tai khoan nay hay chua moi cho dang ki
    async checkUserName(req, res, next) {
        const checkUserName = req.body.checkUserName;
        try{
            var account = await Account.findOne({ username: checkUserName });
            if (account) {
                res.send('1');
            }
            else{
                res.send('0');
            }
        
        }
        catch(err){
            res.json('Có lỗi xảy ra!');
        }
        
    }
    async checkEmail(req, res, next) {
        const checkEmail = req.body.checkEmail;
        try{
            var email = await Account.findOne({ email: checkEmail });
            if (email) {
                res.send('1');
            }
            else{
                res.send('0');
            }
        
        }
        catch(err){
            res.json('Có lỗi xảy ra!');
        }
    }
}

module.exports = new RegisterControllers();
