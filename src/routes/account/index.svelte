<script>
	import { goto, stores } from '@sapper/app';
	import { post, standardizeDates } from '../utils.js';
	import Calendar from '../../components/Calendar.svelte'; 
  import IconButton, {Icon} from '@smui/icon-button';

  const { session } = stores();

	async function logout(event) {
		await post(`auth/logout`);
    $session.user = null;
    $session.addresses = null;
    goto('/');
  }

  if (!$session.user || !$session.user.first_name || $session.user.first_name == "") {
    logout();
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
  $session.currentDate = standardizeDates(new Date())
  const todaysAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= $session.currentDate);
  let todaysAddress = todaysAddresses[0];
  if (todaysAddresses.length > 1) {
    todaysAddress = todaysAddresses.filter( address => address.address_type == "temporary")[0];
  }

  function processTodaysAddresses() {
    const todaysAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= $session.currentDate);
    if (todaysAddresses.length < 1) {
      todaysAddress = null;
    } else {
      todaysAddress = todaysAddresses[0];
      if (todaysAddresses.length > 1) {
        todaysAddress = todaysAddresses.filter( address => address.address_type == "temporary")[0];
      }
    }
  }

  const pinTitle = todaysAddress.nickname ? todaysAddress.nickname : todaysAddress.line_one;
  const phone = formatPhoneNumber(todaysAddress.phone)

	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let now = standardizeDates(new Date());
  let year = now.getFullYear();
  let month = now.getMonth();

  let headerStatement = 'Your mail and packages are currently going to:';

  function processHeaderStatement() {
    if ($session.currentDate.getDate() != now.getDate()
        || $session.currentDate.getMonth() != now.getMonth()
        || $session.currentDate.getFullYear() != now.getFullYear()) {
        if ($session.currentDate < now) {
          headerStatement = `On ${monthNames[$session.currentDate.getMonth()]} ${$session.currentDate.getDate()}, ${$session.currentDate.getFullYear()} your mail and packages were going to:`;
        } else {
          headerStatement = `On ${monthNames[$session.currentDate.getMonth()]} ${$session.currentDate.getDate()}, ${$session.currentDate.getFullYear()} your mail and packages will go to:`;
        }
    } else {
      headerStatement = 'Your mail and packages are currently going to:';
    }
  }

  let currentMonthAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
  let items = currentMonthAddresses.map( address => {
    let endDate = ""
    if (typeof address.end_date != "undefined" && address.end_date != "") {
      endDate = standardizeDates(address.end_date)
    }
    return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "long_term" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "long_term")}
  })
	function processNewMonth() {
    currentMonthAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
    items = currentMonthAddresses.map( address => {
      let endDate = ""
      if (typeof address.end_date != "undefined" && address.end_date != "") {
        endDate = standardizeDates(address.end_date)
      }
      return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "long_term" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "long_term")}
    })
	}
	function next(period="month") {
    if (period === "year") {
      year++;
    } else {
      month++;
      if (month == 12) {
        year++;
        month=0;
      }
    }
    processNewMonth();
    processTodaysAddresses();
	}
	function prev(period="month") {
    if (period === "year") {
      year--;
    } else {
      if (month==0) {
        month=11;
        year--;
      } else {
        month--;
      }
    }
    processNewMonth();
    processTodaysAddresses();
	}
	function itemClick(e) {
    console.log(e)
	}
	function dayClick(e) {
    $session.currentDate = e.date;
    processHeaderStatement();
    processTodaysAddresses();
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
    width: 94%;
    margin: 0 auto;
    box-shadow: 0 0 20px 0 var(--lightGray);
  }

  #currentAddress {
    flex-grow: 2;
    display: table;
    min-width: 300px;
    border: 1px solid var(--lightGray);
    background-color: var(--veryLightGray);
    border-right: 0;
    border-left: 0;
    height: 450px;
  }

  #leftPanel {
    display: table-cell;
    vertical-align: middle;
    margin: 0 auto;
  }

  #map {
    flex-grow: 3;
    height: 450px;
    min-width: 300px;
    border: 1px solid var(--lightGray);
  }
  
  .calendar-container {
    min-width: 300px;
    max-width: 500px;
    flex-grow: 3;
    text-align: center;
    border: 1px solid var(--lightGray);
  }
  
  .calendar-header {
    width: 100%;
    height: 50px;
  }
  
  .calendar-header-h2 {
    font-size: 28px;
  }
</style>

<svelte:head>
  {#if $session.user}
	  <title>smartmail - {$session.user.first_name}'s Account</title>
    {#if todaysAddress != null}
      {@html `<script>
        // Initialize and add the map
        var marker;
        function initMap() {
          // The map, centered at Uluru
          var map = new google.maps.Map(
              document.getElementById('map'), {
                zoom: 15,
                center: {lat:${todaysAddress.latitude}, lng:${todaysAddress.longitude}},
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
              position: {lat:${todaysAddress.latitude}, lng:${todaysAddress.longitude}},
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
  {/if}
</svelte:head>


{#if $session.user}
  <h1 class="text-xs-center">Hello {$session.user.first_name}!</h1>
  <p id="logOut"class="text-xs-center">
    <a href="/"  on:click|preventDefault={logout}>Log out</a>
  </p>
  <h3>HERE IS YOUR ACCOUNT INFORMATION</h3>
  <h2>your smartID is: <strong>{$session.user.smart_id.substring(0, 4)}  {$session.user.smart_id.substring(4)}</strong></h2>
  <h4>{headerStatement}</h4>
  <div id="addressBox">
    <div class="calendar-container">
      <div class="calendar-header">
        <h2 class="calendar-header-h2">
          <IconButton class="material-icons" on:click={()=>prev("year")}>first_page</IconButton>
          <IconButton class="material-icons" on:click={()=>prev()}>chevron_left</IconButton>
          {monthNames[month]} {year}
          <IconButton class="material-icons" on:click={()=>next()}>chevron_right</IconButton>
          <IconButton class="material-icons" on:click={()=>next("year")}>last_page</IconButton>
        </h2>
      </div>
      <Calendar items={items} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} on:itemClick={(e)=>itemClick(e.detail)} />
    </div>
    <div id="currentAddress">
      <div id="leftPanel">
        {#if todaysAddress != null}
          {#if todaysAddress.nickname}
            <h5>{todaysAddress.nickname}</h5>
          {/if}
          <p>
            {#if todaysAddress.attention_to}
              Attention to: {todaysAddress.attention_to}<br>
            {/if}
            {$session.user.first_name} {$session.user.last_name}<br>
            {#if todaysAddress.attention_to}
              Attention to: {todaysAddress.attention_to}<br>
            {/if}
            {#if todaysAddress.business_name}
              {todaysAddress.business_name}<br>
            {/if}
            {todaysAddress.line_one}<br>
            {#if todaysAddress.line_two}
              {todaysAddress.line_two}<br>
            {/if}
            {#if todaysAddress.unit_number}
              {todaysAddress.unit_number}<br>
            {/if}
            {todaysAddress.city}, {todaysAddress.state}, {todaysAddress.zip_code}<br>
            {todaysAddress.country}<br>
            <a href="tel:{phone}">{phone}</a><br>
          </p>
        {:else}
          <h5>This date was prior to when you signed up for Sartmail</h5>
          <p>
            Who knows where your mail was going during that wild uncivalized time...
          </p>
        {/if}
      </div>
    </div>

    {#if todaysAddress != null}
      <div id="map"></div>
    {/if}
  </div>
{/if}