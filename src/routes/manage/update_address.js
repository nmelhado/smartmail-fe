import * as api from '../api.js';

export function put(req, res) {
  const submittedAddress = req.body.address;
  const address = {
    nickname: submittedAddress.nickname,
    delivery_instructions: submittedAddress.delivery_instructions
  }
  const start_date = submittedAddress.start_date;
  const end_date = submittedAddress.end_date ? new Date(submittedAddress.end_date).toISOString() : null;
  const id = submittedAddress.id;

  api.put(`address/${id}`, { address, start_date, end_date }, req.session.token)
  .then(response => {
    if (response.addresses) {
      req.session.addresses = response.addresses;
    } else {
      console.log(response)
    }

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(response));
  })
  .catch(err => {
    console.log(err);
  });
}