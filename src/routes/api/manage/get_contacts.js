import * as api from '../../utils/api.js';

export function get(req, res) {
  const { limit, page, sort, search } = req.query;
  const searchString = search && search.trim() != "" ? `&search=${search.trim()}` : "";
  api.get(`contacts/${req.session.user.id}?limit=${limit}&page=${page}&sort=${sort}${searchString}`, req.session.token)
  .then(response => {
    if (!response.contacts) {
      console.error(response)
    }

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(response));
  })
  .catch(err => {
    console.log(err);
  });
}