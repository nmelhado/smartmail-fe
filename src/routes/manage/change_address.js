import * as api from '../api.js';

export function post(req, res) {
	const { address, status, start_date, end_date } = req.body;

  api.post('address', { user: req.session.user, user_id: req.session.user.id, address, status, start_date, end_date }, req.session.token)
  .then(response => {
    if (response.address) {
      if (response.address.address_type == "permanent") {
        req.session.addresses = req.session.addresses.map( address => {
          if (address.address_type == "permanent" && !address.end_date) {
            let newEndDate = new Date(response.address.start_date.split("T")[0])
            newEndDate.setDate(newEndDate.getDate() - 1);
            address.end_date = newEndDate.toISOString()
          }
          return address;
        })
      }
      req.session.addresses.push(response.address)
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