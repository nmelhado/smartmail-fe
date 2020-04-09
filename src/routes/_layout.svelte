<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';

	export let segment;
</script>

<style>
  #mainContent {
    min-height: calc(100vh - 191px)
  }

	main {
		position: relative;
		width: 100%;
		max-width: 1400px;
		padding: 2em 2em 4em;
		margin: 0 auto;
    box-sizing: border-box;
  }
  
  /* #contact_banner {
    position: relative;
    min-width: 100%;
    width: auto;
    height: auto;
    left: 50%;
    max-height: 200px;
    overflow-y: hidden;
    overflow-x: hidden;
    transform: translate(-50%, 0);
  } */
</style>

<div id="mainContent">
  <Nav {segment}/>
  <!-- {#if segment == "contact"}
    <img id="contact_banner" src="contact_banner.jpg" alt="contact banner" />
  {/if} -->
  <main>
    <slot></slot>
  </main>
</div>

<Footer />