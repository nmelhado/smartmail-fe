import dotenv from 'dotenv'
const USPS = require('usps-webtools-promise').default;

dotenv.config();

const usps = new USPS({
  userId: process.env.USPS_ID,
  // USPS returns ALL CAPS, this boolean turns on Proper Caps for both Address lines and City. This is an optional item.
  properCase: false
});

export function post(req, res) {
  const { line_one, line_two, city, state, zip_code } = req.body;

  usps.verify({
    street1: line_one,
    street2: line_two,
    city: city,
    state: state,
    zip: zip_code
  }).then(address => {
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(address));
  });
}