import * as api from '../../utils/api.js';

export function put(req, res) {
  const { id, description } = req.body;
  api.put(`package/description`, { id, description, user_id: req.session.user.id }, req.session.token)
  .then(response => {
    if (response.success) {
      console.log(response)
    } else {
      console.error(response)
    }

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(response));
  })
  .catch(err => {
    console.log(err);
  });
}