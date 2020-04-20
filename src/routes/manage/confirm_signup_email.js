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
  const { user } = req.body;

  const autoMessage = `Hi ${user.first_name},

  Thanks for your joining Smartmail! You can now use your SmartID as your address and no longer have to worry about anyone sending mail or pakages to an incorrect or out of date address ever again.
  
  SmartID: ${user.smart_id.substring(0, 4)}  ${user.smart_id.substring(4)}
  
  If you need to make an address change, whether temporary or permanent, simply go to my account and change your address. We'll make sure that shippers always have your most up to date information!
  
  If you have any questions, you can email us anytime at info@smartmail.co!`;
  
  const autoHtmlMessage = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n <head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <title>Smartmail - Auto-Reply</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n   <style>\n   	body {\n     	color: #333;\n     }\n     a {\n     	color: #1AC8ED;\n     }\n   </style>\n</head>\n<body>\n  <p>\n      Hi ${user.first_name},\n  </p>\n  <p style="margin: 1.5em 0 0;">\n    Thanks for your joining Smartmail! You can now use your SmartID as your address and no longer have to worry about anyone sending mail or pakages to an incorrect or out of date address ever again. \n  </p>\n  <p style="margin: 1.0em 0 1.0em; text-align: center; font-size: 2em;"><span style="color: #55D6A4;">Smart</span><span style="margin-right: 0.2em; color: #1BE7FF;">ID:  </span><span style="margin-right: 0.5em">${user.smart_id.substring(0, 4)}</span><span>${user.smart_id.substring(4)}</span>\n  </p>\n  <p style="margin: 0 0 0.5em;">If you need to make an address change, whether temporary or permanent, simply go to my account and change your address. We'll make sure that shippers always have your most up to date information!\n  </p>\n  <p style="margin: 0 0 3.0em;">\n    If you have any questions, you can email us anytime at <a href="mailto:info@smartmail.co?Subject=Reaching%20Out" target="_top">info@smartmail.co</a>!\n  </p>\n  <p>\n  	the Smartmail team \n    <br><a href="https://www.smartmail.co" target="_blank">www.smartmail.co</a>\n    <br><a href="mailto:info@smartmail.co?Subject=Reaching%20Out" target="_top">info@smartmail.co</a>\n    <br><a href="tel:+1347-638-4191">(347)638-4191</a>\n  </p>\n  <a href="https://www.smartmail.co" target="_blank"><img src="https://storage.googleapis.com/smartmail-public/smartmail-logo.png" /></a>\n</body>`;
  
  const mailOptionsAuto = {
    from: process.env.MAIL_FROM,
    to: user.email,
    subject: 'Welcome to the Smartmail family!',
    html: autoHtmlMessage,
    text: autoMessage,
    replyTo: process.env.MAIL_TO
  }

  res.setHeader('Content-Type', 'application/json');
  transporter.sendMail(mailOptionsAuto, function(error, info){
    if (error) {
      console.error(error);
      res.end(JSON.stringify(error));
    } else {
      res.end(JSON.stringify(info));
      console.log('Email sent: ' + info.response);
    }
  });
}