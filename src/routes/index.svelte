<style>
	h1, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	/* figure {
		margin: 0 0 1em 0;
	} */
  
  img {
		width: 100%;
		max-width: 750px;
    top: 2px;
    left: 0;
    right: 0;
    margin: 2px auto;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}

  #home-banner {
    text-align: center;
  }

</style>

<svelte:head>
	<title>smartmail - Home</title>
</svelte:head>

<div id='home-banner'>
  <img alt='logo' src='smartmail v2 long - 1000-min.png'>
</div>
<h1>Welcome to smartmail!</h1>

<!-- <figure>
	<figcaption>HIGH FIVE!</figcaption>
</figure> -->

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
