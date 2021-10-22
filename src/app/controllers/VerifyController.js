const Account = require('../models/account');
const mailgun = require("mailgun-js");
const { mongooseToObject } = require('../../util/mongoose');
const { mulMgToObject } = require('../../util/mongoose');
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const SECRET_KEY_EMAIL = process.env.SECRET_SEND_EMAIL;
//
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
//
class VerifyControllers {
    async sendEmail(req, res){
        // console.log(req.protocol);
        // res.send('url: '+ req.protocol+'://'+req.get('host')+'/verifyMail');
        var date = new Date();
        console.log(req.body.email);
        var mail = {
            "email": req.body.email,
            "created": date.toString()
        }
        const token_mail_verification = jwt.sign(mail, SECRET_KEY_EMAIL, { expiresIn: '1d' });

        var url = req.protocol + '://' + req.get('host') + "/verify/email?id=" + token_mail_verification;
        //
        if(req.get('host')=='localhost:3443'){
            const EMAIL_USER_NAME= process.env.EMAIL_USER_NAME;
            const EMAIL_PASSWORD= process.env.EMAIL_PASSWORD;
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL_USER_NAME,
                    pass: EMAIL_PASSWORD
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: EMAIL_USER_NAME, // sender address
                to: req.body.email, // list of receivers seperated by comma
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
        }
        else{
            //mailgun
            const DOMAIN = process.env.DOMAIN_MAILGUN;
            var api_key =process.env.API_KEY_MAILGUN;
            const mg = mailgun({apiKey: api_key, domain: DOMAIN});
            const data = {
                from: 'AloApp <admin@aloapp.software>',
                to: req.body.email,
                subject: 'Xác minh để hoàn tất tạo tài khoản',
                html: "<html><p>Để hoàn thành việc kích hoạt tài khoản hãy nhấn <a href='" +url+ "'" +">Vào đây</a></p></html>",
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
            //
        }
        
        res.send('ok');
    }
    async sendEmailForgotPassword(req, res){
        // res.send('url: '+ req.protocol+'://'+req.get('host')+'/verifyMail');

        var date = new Date();
        try{
            var acc = await Account.findOne(req.body);
            if(acc){
                var mail = {
                    "username": req.body.username,
                    "email": req.body.email,
                    "created": date.toString()
                }
                const token_mail_verification = jwt.sign(mail, SECRET_KEY_EMAIL, { expiresIn: '1d' });
        
                var url = req.protocol + '://' + req.get('host') + "/forgotPassword?id=" + token_mail_verification;
                //
                if(req.get('host')=='localhost:3443'){
                    const EMAIL_USER_NAME= process.env.EMAIL_USER_NAME;
                    const EMAIL_PASSWORD= process.env.EMAIL_PASSWORD;
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: EMAIL_USER_NAME,
                            pass: EMAIL_PASSWORD
                        },
                    });
        
                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                        from: EMAIL_USER_NAME, // sender address
                        to: req.body.email, // list of receivers seperated by comma
                        subject: "Thay đổi mật khẩu tài khoản "+req.body.username, // Subject line
                        text: "Nhấn vào liên kết để tạo mật khẩu mới cho tài khoản của bạn:" + url, // plain text body
                    }, (error, info) => {
        
                        if (error) {
                            console.log(error)
                            return;
                        }
                        console.log('Message sent successfully!');
                        console.log(info);
                        transporter.close();
                    });
                }
                else{
                    //mailgun
                    const DOMAIN = process.env.DOMAIN_MAILGUN;
                    var api_key =process.env.API_KEY_MAILGUN;
                    const mg = mailgun({apiKey: api_key, domain: DOMAIN});
                    const data = {
                        from: 'AloApp <admin@aloapp.software>',
                        to: req.body.email,
                        subject: "Thay đổi mật khẩu tài khoản "+req.body.username,
                        html: "<html><p>Để hoàn thành việc tạo mật khẩu mới cho tài khoản của bạn hãy nhấn <a href='" +url+ "'" +">Vào đây</a></p></html>",
                    };
                    mg.messages().send(data, function (error, body) {
                        console.log(body);
                    });
                    //
                }
                res.send('thanhcong');
            }
            else{
                res.send('not found');
            }
        }
        catch{
            res.send('thatbai')
        }
    }
    sendSMS(req, res) {
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
                        var email = decoded.email;
                        //Update your database here with whatever the verification flag you are using 
                        Account.findOneAndUpdate({email: email}, { isVerified: true })
                            .then(() => {
                                
                                res.send('Xác thực email thành công!');
                            })
                            .catch(err => {
                                res.send('Có lỗi xảy ra khi xác thực email');
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
}

module.exports = new VerifyControllers();