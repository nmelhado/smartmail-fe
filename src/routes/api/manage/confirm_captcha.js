import * as api from '../../utils/api.js';
import dotenv from 'dotenv'

dotenv.config();

export function post(req, res) {
  const { key } = req.body;

  api.externalGet("https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.CAPTCHA_SECRET + "&response=" + key)
  .then(response => {
    if (!response.success) {
      console.log(response)
    }

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(response));
  });
}