import * as api from '../api.js';

export function del(req, res) {
	const { address } = req.body;

  api.del(`address/${address.id}`, req.session.token)
  .then(response => {
    if (response.addresses) {
      req.session.addresses = response.addresses
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