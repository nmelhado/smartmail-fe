<script>
	import Nav from '../components/Nav.svelte';
	import MobileNav from '../components/MobileNav.svelte';
  import Footer from '../components/Footer.svelte';
  import GoogleAnalytics from '../components/GoogleAnalytics.svelte';
	import { stores } from '@sapper/app';

  const { session } = stores();

	export let segment;
</script>

<style>
  #mainContent {
    min-height: calc(100vh - 191px)
  }

  #mainContentMobile {
    min-height: calc(100vh - 121px)
  }

	main {
		position: relative;
		width: 100%;
		max-width: 1400px;
		padding: 2em 2em 4em;
		margin: 0 auto;
    box-sizing: border-box;
  }

	main.mobile {
		position: relative;
		width: 90%;
    padding: 1em 0 2em;
    margin: 0 5%;
    box-sizing: border-box;
  }

  #mainContact {
    padding: 0;
    max-width: 100%;
  }
</style>

<GoogleAnalytics />
<div id={$session.mobile ? "mainContentMobile" : "mainContent"}>
  {#if $session.mobile}
    <MobileNav />
  {:else}
    <Nav />
  {/if}
  {#if segment == "contact"}
    <main class={$session.mobile ? "mobile" : ""} id="mainContact">
      <slot></slot>
    </main>
  {:else}
    <main class={$session.mobile ? "mobile" : ""}>
      <slot></slot>
    </main>
  {/if}
</div>

<Footer />