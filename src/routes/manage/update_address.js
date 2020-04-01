import * as api from '../api.js';

export function put(req, res) {
	const { address, status, start_date, end_date } = req.body;

  api.put('address', { user: req.session.user, user_id: req.session.user.id, address, status, start_date, end_date }, req.session.token)
  .then(response => {
    if (response.address) {
      req.session.addresses = response.addresses
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