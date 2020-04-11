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

  #mainContact {
    padding: 0;
    max-width: 100%;
  }
</style>

<div id="mainContent">
  <Nav {segment}/>
  {#if segment == "contact"}
    <main id="mainContact">
      <slot></slot>
    </main>
  {:else}
    <main>
      <slot></slot>
    </main>
  {/if}
</div>

<Footer />