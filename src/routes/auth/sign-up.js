import * as api from '../api.js';

export function post(req, res) {
	const { user, address, status, start_date } = req.body;

  api.post('signup', { user, address, status, start_date })
    .then(response => {
      if (response.user) {
        req.session.user = response.user
        req.session.addresses = response.addresses
        req.session.contacts = response.contacts
        req.session.token = response.token
        req.session.expires = response.expires
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