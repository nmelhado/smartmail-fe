<script>
	import { goto, stores } from '@sapper/app';
	import { post } from '../utils.js';
	// import ListErrors from '../../components/ListErrors.svelte';
  // import * as yup from 'yup';
  // import Textfield from '@smui/textfield'
  // import Icon from '@smui/textfield/icon/index';  

  const { session } = stores();

	async function logout(event) {
		await post(`auth/logout`);
    $session.user = null;
    $session.addresses = null;
    goto('/');
	}
  console.log($session.user)
  console.log($session.addresses)
</script>

<style>
  h2 {
      font-size: 1.8em;
      text-align: center;
      color: var(--primary);
  }
  
  #logOut {
    text-align: center;
    color: var(--secondaryAccent)
  }

  #map {
    height: 400px;  /* The height is 400 pixels */
    width: 100%;  /* The width is the width of the web page */
  }
</style>

<svelte:head>
	<title>smartmail - {$session.user.first_name}'s Account</title>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
  {@html `<script>const address = "${$session.addresses[0].line_one + " " + $session.addresses[0].city + " " + $session.addresses[0].state + " " + $session.addresses[0].zip_code}${post.css}".replace(" ", "+")</script>`}
  <script>
    var geocoder;
    var map;

    function httpGetAsync()
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                initMap(xmlHttp.responseText);
        }
        xmlHttp.open("GET", `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyARoO29--UJnqVy2U5KcOp9qyrtzNl097c`, true); // true for asynchronous 
        xmlHttp.send(null);
    }


    // Initialize and add the map
    function initMap(geoInfo) {
      const info = JSON.parse(geoInfo)
      // The location of Uluru
      var uluru = info.results[0].geometry.location;
      // The map, centered at Uluru
      var map = new google.maps.Map(
          document.getElementById('map'), {zoom: 14, center: uluru});
      // The marker, positioned at Uluru
      var marker = new google.maps.Marker({position: uluru, map: map});
    }
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyARoO29--UJnqVy2U5KcOp9qyrtzNl097c&callback=httpGetAsync"></script>
</svelte:head>


<h1 class="text-xs-center">Hello {$session.user.first_name}!</h1>
<h2>HERE IS YOUR ACCOUNT INFORMATION</h2>
<p id="logOut"class="text-xs-center">
  <a href="/"  on:click|preventDefault={logout}>Log out</a>
</p>

<h3>Your current mailing address:</h3>
<p>
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
  {#if $session.addresses[0].phone && $session.addresses[0].phone != ""}
    {$session.addresses[0].phone}<br>
  {:else}
    {$session.user.phone}<br>
  {/if}
</p>

<div id="map"></div>