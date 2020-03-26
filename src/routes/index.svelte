<script>
	import { goto, stores } from '@sapper/app';

	const { session } = stores();

  console.log($session.user)
  console.log($session.addresses)
</script>

<style>
	p {
		text-align: center;
		margin: 0 auto;
	}

	h2 {
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	/* figure {
		margin: 0 0 1em 0;
	} */
  
  img {
		width: 100%;
		max-width: 500px;
    top: 2px;
    left: 0;
    right: 0;
    margin: 2px auto;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h2 {
			font-size: 4em;
		}
	}

  #home-banner {
    text-align: center;
  }

  #bg {
    position: fixed; 
    bottom: 0; 
    left: 0; 
    
    /* Preserve aspet ratio */
    min-width: 100%;
    min-height: 100%;
    z-index: -1;
}

</style>

<svelte:head>
	<title>smartmail - Home</title>
</svelte:head>

<img src="mailBackground.jpg" id="bg" alt="">

<div id='home-banner'>
  <img alt='logo' src='smartmail v2 long - 1000-min.png'>
</div>
<h2>Welcome to smartmail!</h2>

<!-- <figure>
	<figcaption>HIGH FIVE!</figcaption>
</figure> -->

<p><strong>Text to come!</strong></p>
