import * as api from '../../utils/api.js';

export function post(req, res) {
	const { contact } = req.body;

  api.post('contacts', { user_id: req.session.user.id, contact }, req.session.token)
  .then(response => {
    if (!response.contact) {
      console.error(response)
    }

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(response));
  })
  .catch(err => {
    console.error(err);
  });
}