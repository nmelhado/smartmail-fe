import * as api from '../../utils/api.js';
import * as nodemailer from 'nodemailer'; 
import dotenv from 'dotenv'

dotenv.config();

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }
});

export function post(req, res) {
  const { email } = req.body;

  api.post('forgot_password', { email })
    .then(response => {
      let clientResponse;
      if (response.email) {
        sendResetEmail(response)
          .then( success => {
            if (success) {
              clientResponse = {
                success: true,
                name: response.name 
              }
            } else {
              clientResponse = {
                error: `Something went wrong. Please try again.`
              }
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(clientResponse));
          }
        )
        .catch(err => {
          console.error(err);
        });
      } else {
        console.warn(response);
        if (response.error == "record not found") {
          clientResponse = {
            error: `No user found with email: ${email}`
          }
        } else {
          clientResponse = response
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(clientResponse));
      }
    })
    .catch(err => {
      console.error(err);
    });
}

const sendResetEmail = (user) => {

  const autoMessage = `Forgot your password?
  
  Don't worry ${user.name}. We're here to help.

  Here's your password reset link: https://smartmail.co/reset-password?token=${user.token}
  
  If you have any problems, you can email us anytime at info@smartmail.co!`;
  
  const autoHtmlMessage = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n <head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <title>Smartmail - Forgot Password</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n   <style>\n   	body {\n     	color: #333;\n     	text-align: center;\n     }\n     a {\n     	color: #1AC8ED;\n     }\n     h2 {\n     	font-size: 1.7em;{\n     	color: #1AC8ED;\n     }\n     #reset:hover {\n     	background-color: #1AC8ED;\n     }\n   </style>\n</head>\n<body style="text-align: center;">\n  <a href="https://www.smartmail.co" target="_blank" id="banner"><img src="https://storage.googleapis.com/smartmail-public/smartmail-logo.png" /></a>\n  <h2>Forgot your password?</h2>\n  <h2>Don't worry ${user.name}. We're here to help.</h2>\n  <p>\n      Make a new one that's at least 8 characters within 1 hour of receiving this email. \n  </p>\n  <br><a href="https://smartmail.co/reset-password?token=${user.token}" onmouseover="this.style.backgroundColor='#1AC8ED'" onmouseout="this.style.backgroundColor='#1BE7FF'" style="background-color: #1BE7FF; color: #fefefe; font-weight: 600; padding: 15px; font-size: 1.5em; border-radius: 6px; text-decoration: none;">Reset Password</a>\n  <br>\n  <br>\n  \n  <p style="font-size: 0.9em; color: #777; font-style: italic;">\n      If you didn't ask to reset your password, please ignore this email. \n  </p><br><br>\n</body>`;
  
  const mailOptionsAuto = {
    from: process.env.MAIL_FROM,
    to: user.email,
    subject: 'Smartmail - Forgot Your Password',
    html: autoHtmlMessage,
    text: autoMessage,
    replyTo: process.env.MAIL_TO
  }

  return new Promise( (resolve, reject) => {
    transporter.sendMail(mailOptionsAuto, function(error, info){
      if (error) {
        console.error(error);
        resolve( false )
      } else {
        console.log('Email sent: ' + info.response);
        resolve( true )
      }
    })
  })
  
}