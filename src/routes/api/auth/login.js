import * as api from '../../utils/api.js';

export function post(req, res) {
  const {email, password} = req.body;

  api.post('login', { email, password })
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