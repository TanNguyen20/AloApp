const passport = require('passport');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const User = require('../models/user')
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
    testENV(req, res) {
        res.send(process.env.CLOUDINARY_KEY);
    }
    facebook(req, res, next) {
        res.send("Register with facebook");
    }
    authendicationGoogle(req, res, next) {
        if (passport.authenticate('google', { failureRedirect: '/' })) {
            next();
        }
        else {
            res.json('that bai');
        }
    }
    async createUserWithGoogle(req, res, next) {
        // console.log(req.protocol);
        // res.send('url: '+ req.protocol+'://'+req.get('host')+'/verifyMail');
        var date = new Date();
        var mail = {
            "id": req.user.googleId,
            "created": date.toString()
        }
        const token_mail_verification = jwt.sign(mail, SECRET_KEY_EMAIL, { expiresIn: '1d' });

        var url = req.protocol + '://' + req.get('host') + "/register/verify?id=" + token_mail_verification;
        //
        const EMAIL_USER_NAME= process.env.EMAIL_USER_NAME;
        const EMAIL_PASSWORD= process.env.EMAIL_PASSWORD;
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER_NAME,
                pass: EMAIL_PASSWORD
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: EMAIL_USER_NAME, // sender address
            to: req.user.email, // list of receivers seperated by comma
            subject: "Xác minh để hoàn tất tạo tài khoản", // Subject line
            text: "Nhấn vào link để hoàn thành việc xác thực tài khoản của bạn:" + url, // plain text body
        }, (error, info) => {

            if (error) {
                console.log(error)
                return;
            }
            console.log('Message sent successfully!');
            console.log(info);
            transporter.close();
        });
        res.json('Đã gửi mail xác thực vui lòng kiểm tra hộp thư');
    }
    verifySMS(req, res) {
        const NUMBER_PHONE_SEND = process.env.TWILIO_NUMBER_PHONE;
        const MESSAGING_SERVICE_SID =process.env.TWILIO_MESSAGING_SERVICE_SID;
        client.messages
            .create({
                body: 'Chao mung ban den voi AloApp',
                messagingServiceSid: MESSAGING_SERVICE_SID,
                from: NUMBER_PHONE_SEND,
                to: '+84912813450'
            })
            .then(message => {
                res.send('Tin nhan da duoc gui den: ' + message.to);
            })
            .done();
    }
    verifyMail(req, res) {
        var token = req.query.id;
        if (token) {
            try {
                jwt.verify(token, SECRET_KEY_EMAIL, (e, decoded) => {
                    if (e) {
                        console.log(e)
                        return res.sendStatus(403);
                    } else {
                        var id = decoded.id;
                        //Update your database here with whatever the verification flag you are using 
                        User.findOneAndUpdate({ googleId: id }, { isVerified: true })
                            .then(() => {
                                res.json('xac thuc email thanh cong');
                            })
                            .catch(err => {
                                res.json('co loi xay ra khi xac thuc email');
                            })

                    }

                });
            } catch (err) {
                console.log(err);
                return res.sendStatus(403);
            }
        } else {
            res.json('khong ton tai token');
            return res.sendStatus(403).redirect('/');

        }
    }
    ensureAuth(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.json('ban chua dang nhap, dang nhap de xem inforWithGoogle');
        }
    }
    ensureGuest(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/product/samsung-galaxy-s20');
        }
    }
    inforWithGoogle(req, res, next) {
        res.render('home', {
            info: mongooseToObject(req.user)
        });
    }
    inforWithFacebook(req, res, next) {
        res.json(req.user);
    }
    itOk(req, res, next) {
        res.json(req.user);
    }
    checkUserName(req, res, next) {
        const checkUserName = req.body.checkUserName;
        res.send('1');
    }
    // logout facebook google
    logout(req, res) {
        req.logout();
        res.redirect('/');
    }

}

module.exports = new RegisterControllers();
