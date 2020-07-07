import * as api from '../../utils/api.js';

export function put(req, res) {
  const { updateInfo } = req.body;
  const user = {...req.session.user};
  user.first_name = updateInfo.first_name;
  user.last_name = updateInfo.last_name;
  user.email = updateInfo.email;
  user.phone = updateInfo.phone;

  api.put(`users/${user.id}`, { ...user }, req.session.token)
  .then(response => {
    if (response.user) {
      req.session.user = response.user;
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