export function post(req, res) {
	delete req.session.user;
	delete req.session.addresses;
	delete req.session.token;
	delete req.session.expires;
	res.end(JSON.stringify({ ok: true }));
}