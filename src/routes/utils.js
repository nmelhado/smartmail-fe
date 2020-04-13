const { NODE_ENV } = process.env;
const prod = NODE_ENV === 'production';

let base = 'http://localhost:3000';
if(prod) {
  base = 'https://www.smartmail.co';
}

import fetch from 'cross-fetch';

export function post(endpoint, data) {
	return fetch(new URL(endpoint, base), {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
  })
  .then(r => r.json())
  .catch(e => console.log(e));
}

export function put(endpoint, data) {
	return fetch(new URL(endpoint, base), {
		method: 'PUT',
		credentials: 'include',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(r => r.json())
  .catch(e => console.log(e));
}

export function get(endpoint) {
	return fetch(new URL(endpoint, base), {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(r => r.json())
  .catch(e => console.log(e));
}

export function del(endpoint, data) {
	return fetch(new URL(endpoint, base), {
		method: 'DELETE',
    credentials: 'include',
    body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(r => r.json())
  .catch(e => console.log(e));
}

export function standardizeDates(date) {
  return new Date(new Date(date).toDateString())
}

export function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}
