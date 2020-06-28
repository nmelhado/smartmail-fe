import * as api from '../../utils/api.js';

export function put(req, res) {
  const { tracking, delivered_on } = req.body;
  api.put(`package`, { tracking, delivered_on, delivered: true, user_id: req.session.user.id }, req.session.token)
  .then(response => {
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(response));
  })
  .catch(err => {
    console.log(err);
  });
}