export function get(req, res) {
  if (!req.session || !req.session.user) {
    delete req.session.user;
    delete req.session.addresses;
    delete req.session.token;
    delete req.session.expires;
  	res.end(JSON.stringify({ ok: false }));
  } else {
    res.end(JSON.stringify({ ok: true }));
  }
}