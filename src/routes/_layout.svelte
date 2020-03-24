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
		max-width: 56em;
		background-color: white;
		padding: 2em 2em 4em;
		margin: 0 auto;
    box-sizing: border-box;
	}
</style>

<div id="mainContent">
  <Nav {segment}/>

  <main>
    <slot></slot>
  </main>
</div>

<Footer />