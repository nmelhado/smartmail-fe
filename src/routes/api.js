const { NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

let base = 'http://localhost:8080';
if(!dev) {
  base = 'https://api.smartmail.co';
}

function send({ method, path, data, token, external = false }) {
	const fetch = process.browser ? window.fetch : require('node-fetch').default;

	const opts = { method, headers: {} };

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`;
	}
  const url = external ? path : new URL(path, base);
	return fetch(url, opts)
		.then(r => r.text())
		.then(json => {
			try {
				return JSON.parse(json);
			} catch (err) {
				return json;
			}
    })
    .catch(e => {
      console.log(e)
    });
}

export function externalGet(path, token) {
	return send({ method: 'GET', path, token, external: true });
}

export function get(path, token) {
	return send({ method: 'GET', path, token });
}

export function del(path, token) {
	return send({ method: 'DELETE', path, token });
}

export function post(path, data, token) {
	return send({ method: 'POST', path, data, token });
}

export function put(path, data, token) {
	return send({ method: 'PUT', path, data, token });
}