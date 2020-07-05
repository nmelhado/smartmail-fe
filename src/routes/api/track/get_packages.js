import * as api from '../../utils/api.js';

export function get(req, res) {
  const { limit, page, search, type } = req.query;
  const searchString = search  ? search.trim() : "";
  api.get(`packages/${req.session.user.id}?type=${type}&limit=${limit}&page=${page}&search=${searchString}`, req.session.token)
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