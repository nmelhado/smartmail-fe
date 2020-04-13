import * as api from '../api.js';

export function get(req, res) {
  api.get(`contacts/${req.session.user.id}`, req.session.token)
  .then(response => {
    if (response.contacts) {
      req.session.contacts = response.contacts
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