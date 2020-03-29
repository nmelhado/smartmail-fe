import * as api from '../api.js';

export function post(req, res) {
	const { user, address, status, start_date } = req.body;

  api.post('address', { user, address, status, start_date }, req.session.token)
    .then(response => {
      if (response.address) {
        req.session.addresses.push(response.address)
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