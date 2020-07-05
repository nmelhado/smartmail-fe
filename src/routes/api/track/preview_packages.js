import * as api from '../../utils/api.js';

export function get(req, res) {
  api.get(`preview_packages/${req.session.user.id}`, req.session.token)
  .then(response => {
    if (!response.success) {
      console.error(response)
    }

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(response));
  })
  .catch(err => {
    console.error(err);
  });
}