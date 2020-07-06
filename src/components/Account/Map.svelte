<div id="map" class={mobile ? "mapM" : "map"}></div>

<svelte:head>
  <script>
    function checkMap() {};
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDCUjuA4aQIrKq8UQDaKnJPyc5cqxkzlPU&callback=checkMap" on:load={initMap}></script>
</svelte:head>


<script>
	import { afterUpdate } from 'svelte';
  
  export let todaysAddress, pinTitle, mobile;
  const latitude = todaysAddress.latitude;
  const longitude = todaysAddress.longitude;
  const position = {lat: latitude, lng:longitude};

  let marker, map;
  function initMap() {
    // The map object
    map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 15,
        center: position,
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
      position,
      map: map,
      animation: google.maps.Animation.DROP,
      title:pinTitle,
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

		$: if(todaysAddress && map && marker) {
      const newLatLng = new google.maps.LatLng(todaysAddress.latitude, todaysAddress.longitude);
      map.setCenter({
        lat : todaysAddress.latitude,
        lng : todaysAddress.longitude
      });
      marker.setPosition(newLatLng);
      }

</script>

<style>
  .map {
    flex-grow: 3;
    height: 450px;
    min-width: 300px;
    border: 1px solid var(--lightGray);
  }

  .mapM {
    flex-grow: 3;
    height: 450px;
    height: 90vw;
    width: 100%;
  }
</style>


