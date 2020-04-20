import * as api from '../api.js';

export function post(req, res) {
	const { contact } = req.body;

  api.post('contacts', { user_id: req.session.user.id, contact }, req.session.token)
  .then(response => {
    if (response.contact) {
      if (req.session.contacts) {
        req.session.contacts.push(response.contact)
      } else {
        req.session.contacts = [response.contact]
      }
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