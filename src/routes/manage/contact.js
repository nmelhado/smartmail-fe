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
	const { contact } = req.body;

  const mailOptions = {
    from: process.env.MAIL_FROM,
    // from: 'n.melhado@gmail.com',
    to: process.env.MAIL_TO,
    // to: 'info@smartmail.co',
    subject: `${contact.firstName} ${contact.lastName} - Reaching Out`,
    text: `${contact.message}`,
    replyTo: `${contact.replyTo}`
  }

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