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

const autoMessage = '\n\nThanks for your interest in Smartmail! Your message got safely to us, and we are looking into it, we will get back to you within 24 hours. Until then, you can give us a call anytime at (347)638-4191 or email info@smartmail.co.\n\n- Smartmail'

const autoHtmlMessageOne = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n <head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <title>Smartmail - Auto-Reply</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n</head>\n  <body>\n    <p>\n      	Hi ';
const autoHtmlMessageTwo = ',\n    </p>\n    <p style="margin: 1.5em 0 0.5em;">\n      Thanks for your interest in Smartmail! Your message got safely to us, and we are looking into it, we will get back to you within 24 hours.\n    </p>\n    <p style="margin: 0 0 1.5em;">\n      Until then, you can give us a call anytime at <a href="tel:+1347-638-4191">(347)638-4191</a> or email us at <a href="mailto:info@smartmail.co?Subject=Reaching%20Out" target="_top">info@smartmail.co</a>!\n    </p>\n    <a href="https://smartmail.co"><img src="https://storage.googleapis.com/smartmail-public/smartmail-logo.png" /></a>\n\n<br>\n<hr style="margin: 10px 0 5px;  border-color: #ededed;" />\n<p style="margin: 0; text-align: center; color: #ddd;">\n  -- Your message below --\n</p>\n<hr style="margin: 5px 0 25px;  border-color: #ededed;" /><p style="font-style: italic; color:  #888;">';
const autoHtmlMessageThree = '</p>  </body>';
export function post(req, res) {
  const { contact } = req.body;

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: `${contact.firstName} ${contact.lastName} - Reaching Out`,
    text: contact.message,
    replyTo: contact.replyTo
  }

  const mailOptionsAuto = {
    from: process.env.MAIL_FROM,
    to: contact.replyTo,
    subject: 'Smartmail - Auto-Reply',
    html: `${autoHtmlMessageOne}${contact.firstName}${autoHtmlMessageTwo}${contact.message.replace(/(\r\n|\n|\r)/gm,"<br>")}${autoHtmlMessageThree}`,
    text: `Dear ${contact.firstName},${autoMessage}`,
    replyTo: process.env.MAIL_TO
  }

  transporter.sendMail(mailOptionsAuto, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.setHeader('Content-Type', 'application/json');
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.end(JSON.stringify(error));
    } else {
      res.end(JSON.stringify(info));
      console.log('Email sent: ' + info.response);
    }
  });
}