<script>
	import { goto, stores } from '@sapper/app';
	import { post } from '../utils.js';
	import Calendar from '../../components/Calendar.svelte'; 

  const { session } = stores();

  const pinTitle = $session.addresses[0].nickname ? $session.addresses[0].nickname : $session.addresses[0].line_one;

  if (!$session.user || !$session.user.first_name || $session.user.first_name == "") {
    goto('login');
  }

	async function logout(event) {
		await post(`auth/logout`);
    $session.user = null;
    $session.addresses = null;
    goto('/');
	}
  console.log($session.user)
  console.log($session.addresses)
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '')
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return null
  }
  const todaysAddresses = $session.addresses.filter( address => Date.parse(address.start_date) < new Date());
  let today = todaysAddresses[0];
  if (todaysAddresses.length > 1) {
    today = todaysAddresses.filter( address => address.address_type == "temporary")[0];
  }
  const phone = formatPhoneNumber($session.addresses[0].phone)

	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let currentMonthAddresses = $session.addresses.filter( address => Date.parse(address.start_date) < new Date(year, month + 1, 0) && (typeof address.end_date == "undefined" || address.end_date == "" || Date.parse(address.end_date) > new Date(year, month, 1) ));
  let items = currentMonthAddresses.map( address => {
    let endDate = ""
    if (typeof address.end_date != "undefined" && address.end_date != "") {
      endDate = address.end_date.split('T')[0]
    }
    return {startDate: address.start_date.split('T')[0], endDate, className:`${address.address_type == "long_term" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "long_term")}
  })
	function processNewMonth() {
    currentMonthAddresses = $session.addresses.filter( address => Date.parse(address.start_date) < new Date(year, month + 1, 0) && (typeof address.end_date == "undefined" || address.end_date == "" || Date.parse(address.end_date) > new Date(year, month, 1) ));
    items = currentMonthAddresses.map( address => {
      let endDate = ""
      if (typeof address.end_date != "undefined" && address.end_date != "") {
        endDate = address.end_date.split('T')[0]
      }
      return {startDate: address.start_date.split('T')[0], endDate, className:`${address.address_type == "long_term" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "long_term")}
    })
	}
	function next() {
		month++;
		if (month == 12) {
			year++;
			month=0;
    }
    processNewMonth();
	}
	function prev() {
		if (month==0) {
			month=11;
			year--;
		} else {
			month--;
    }
    processNewMonth();
	}
</script>

<style>
  h1 {
    margin-bottom: 0px;
  }

  h2 {
    color: var(--primaryAccent);
    margin: 0;
    font-size: 1.8em;
  }

  h3 {
    font-size: 1.8em;
    text-align: center;
    color: var(--darkGray);
  }

  h4 {
    font-size: 1.6em;
    text-align: center;
    color: var(--gray);
    margin: 0.5em 0 1em;
  }

  h5 {
    font-size: 1.3em;
    color: var(--primary);
    font-weight: 700;
  }
  
  #logOut {
    margin: 0 0 40px;
    text-align: center;
    color: var(--secondaryAccent)
  }

  #addressBox {
    text-align: center;
    display: flex;
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0 0 20px 0 var(--lightGray);
  }

  #currentAddress {
    flex-grow: 1;
    display: table;
    min-width: 300px;
    border: 1px solid var(--lightGray);
    border-right: 0;
    height: 400px;
  }

  #leftPanel {
    display: table-cell;
    vertical-align: middle;
    margin: 0 auto;
  }

  #map {
    flex-grow: 1;
    height: 400px;
    min-width: 300px;
    border: 1px solid var(--lightGray);
  }
  
  .calendar-container {
    max-width: 600px;
    width: 100%;
    margin: 15px auto;
    text-align: center;
  }
  
  .calendar-header {
    width: 100%;
  }
</style>

<svelte:head>
  {#if $session.user}
	  <title>smartmail - {$session.user.first_name}'s Account</title>
    {@html `<script>
      // Initialize and add the map
      var marker;
      function initMap() {
          // The map, centered at Uluru
          var map = new google.maps.Map(
              document.getElementById('map'), {
                zoom: 15,
                center: {lat:${$session.addresses[0].latitude}, lng:${$session.addresses[0].longitude}},
                mapTypeControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#f5f5f5"
                      }
                    ]
                  },
                  {
                    "elementType": "labels.icon",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#616161"
                      }
                    ]
                  },
                  {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "color": "#f5f5f5"
                      }
                    ]
                  },
                  {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#c0c0c0"
                      },
                      {
                        "weight": 0.5
                      }
                    ]
                  },
                  {
                    "featureType": "administrative",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "color": "#e4e4e4"
                      },
                      {
                        "weight": 1
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#eeeeee"
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#757575"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.business",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#e5e5e5"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                      {
                        "color": "#cbded1"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#9e9e9e"
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#ffffff"
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                      {
                        "weight": 1
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "labels.text",
                    "stylers": [
                      {
                        "weight": 1
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#c0c0c0"
                      },
                      {
                        "weight": 1
                      }
                    ]
                  },
                  {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#c0c0c0"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#dadada"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#616161"
                      }
                    ]
                  },
                  {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#c0c0c0"
                      }
                    ]
                  },
                  {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#e5e5e5"
                      }
                    ]
                  },
                  {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#eeeeee"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#c9c9c9"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                      {
                        "color": "#c4d2db"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#9e9e9e"
                      }
                    ]
                  }
                ]
              }
            );

          // The marker
          var image = {
            url: 'smartmail_v2-pin.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(41, 38),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(35, 38)
          };
          marker = new google.maps.Marker({
            position: {lat:${$session.addresses[0].latitude}, lng:${$session.addresses[0].longitude}},
            map: map,
            animation: google.maps.Animation.DROP,
            title:"${pinTitle}",
            icon: image
          });
          marker.addListener('click', toggleBounce);
        }

        function toggleBounce() {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
        };
    </script>`}
    <script>
      function checkMap() {
        if (typeof initMap === 'function') {
          initMap()
        } else {
          setTimeout(() => {
              window.location.reload(true);
          }, 200);
        }
      };
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyARoO29--UJnqVy2U5KcOp9qyrtzNl097c&callback=checkMap"></script>
  {/if}
</svelte:head>


{#if $session.user}
  <h1 class="text-xs-center">Hello {$session.user.first_name}!</h1>
  <p id="logOut"class="text-xs-center">
    <a href="/"  on:click|preventDefault={logout}>Log out</a>
  </p>
  <h3>HERE IS YOUR ACCOUNT INFORMATION</h3>
  <h2>your smartID is: <strong>{$session.user.smart_id}</strong></h2>
  <h4>Your mail and packages are currently going to:</h4>
  <div id="addressBox">
    <div id="currentAddress">
      <div id="leftPanel">
        {#if $session.addresses[0].nickname}
          <h5>{$session.addresses[0].nickname}</h5>
        {/if}
        <p>
          {#if $session.addresses[0].attention_to}
            Attention to: {$session.addresses[0].attention_to}<br>
          {/if}
          {$session.user.first_name} {$session.user.last_name}<br>
          {#if $session.addresses[0].attention_to}
            Attention to: {$session.addresses[0].attention_to}<br>
          {/if}
          {#if $session.addresses[0].business_name}
            {$session.addresses[0].business_name}<br>
          {/if}
          {$session.addresses[0].line_one}<br>
          {#if $session.addresses[0].line_two}
            {$session.addresses[0].line_two}<br>
          {/if}
          {#if $session.addresses[0].unit_number}
            {$session.addresses[0].unit_number}<br>
          {/if}
          {$session.addresses[0].city}, {$session.addresses[0].state}, {$session.addresses[0].zip_code}<br>
          {$session.addresses[0].country}<br>
          <a href="tel:{phone}">{phone}</a><br>
        </p>
      </div>
    </div>

    <div id="map"></div>
  </div>
  <div class="calendar-container">
    <div class="calendar-header">
      <h1>
        <button on:click={()=>year--}>&Lt;</button>
        <button on:click={()=>prev()}>&lt;</button>
        {monthNames[month]} {year}
        <button on:click={()=>next()}>&gt;</button>
        <button on:click={()=>year++}>&Gt;</button>
      </h1>
    </div>
    <Calendar items={items} year={year} month={month} />
    </div>
{/if}