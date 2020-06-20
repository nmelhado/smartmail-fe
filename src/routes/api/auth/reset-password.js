import * as api from '../../utils/api.js';

export function post(req, res) {
  const { password, token } = req.body;

  api.post('reset_password', { password }, token)
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    })
    .catch(err => {
      console.error(err);
    });
}