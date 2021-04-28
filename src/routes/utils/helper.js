export function post(endpoint, data) {
	return fetch(endpoint, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
  })
  .then(r => r.json())
  .catch(e => console.error(e));
}

export function put(endpoint, data) {
	return fetch(endpoint, {
		method: 'PUT',
		credentials: 'include',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(r => r.json())
  .catch(e => console.error(e));
}

export function get(endpoint) {
	return fetch(endpoint, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(r => r.json())
  .catch(e => console.error(e));
}

export function del(endpoint, data) {
	return fetch(endpoint, {
		method: 'DELETE',
    credentials: 'include',
    body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(r => r.json())
  .catch(e => console.error(e));
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

export function findTodaysAddress(date, addresses) {
  const todaysAddresses = addresses.filter( address => standardizeDates(address.start_date) <= date && (!address.end_date || standardizeDates(address.end_date) >= date));
  let todaysAddress = null;
  if (todaysAddresses.length > 0) {
    todaysAddress = todaysAddresses[0];
    if (todaysAddresses.length > 1) {
      todaysAddress = todaysAddresses.filter( address => address.address_type == "temporary")[0];
    }
  }
  return todaysAddress;
}

const ups = "UPS";
const usps = "USPS";
const lasership = "Lasership";
const fedex = "FedEx";

export async function trackPackage(carrier, trackingNumber) {
  let additionalInfo = null;
  switch (carrier) {
    case ups:
      additionalInfo = await post(`api/track/ups`, { trackingNumber });
      break;
    case usps:
      additionalInfo = await post(`api/track/usps`, { trackingNumber });
      break;
    case lasership:
      additionalInfo = await post(`api/track/lasership`, { trackingNumber });
      break;
    case fedex:
      additionalInfo = await post(`api/track/fedex`, { trackingNumber });
      break;
    default:
      break;
  }
  return additionalInfo;
}

export function getTrackingLink(carrier, trackingNumber) {
  let trackingLink = "";
  switch (carrier) {
    case ups:
      trackingLink = `https://www.ups.com/track?loc=en_US&tracknum=${trackingNumber}&requester=WT/trackdetails`;
      break;
    case usps:
      trackingLink = `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`;
      break;
    case lasership:
      trackingLink = `https://www.lasership.com/track/${trackingNumber}`;
      break;
    case fedex:
      trackingLink = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
      break;
    default:
      break;
  }
  return trackingLink;
}

export function lazyLoad (node) {
  node.src = node.dataset.src;
  node.classList.remove("lazy");
}

export function lazyLoadBG (node) {
  node.style.backgroundImage = 'url("'+node.dataset.src+'")';
  node.classList.remove("lazyBG");
}