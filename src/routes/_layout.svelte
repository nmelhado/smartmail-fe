<script>
	import Nav from '../components/Nav/Nav.svelte';
	import MobileNav from '../components/Nav/MobileNav.svelte';
  import Footer from '../components/Footer.svelte';
  import GoogleAnalytics from '../components/GoogleAnalytics.svelte';
	import { stores } from '@sapper/app';

  const { session } = stores();

  export let segment;
  
  $: innerWidth = 0
  $: innerHeight = 0
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

	main.mobile {
		position: relative;
		width: 90%;
    padding: 1em 0 2em;
    margin: 0 5%;
    box-sizing: border-box;
  }

  #mainNoPadding {
    padding: 0;
    width: 100%;
    max-width: 100%;
  }

  .backMap {
    background-image: url(world_map.svg);
    background-size: cover;
  }
</style>

<svelte:window bind:innerWidth bind:innerHeight />

<GoogleAnalytics />
<div id="mainContent" class={segment == "login" || segment == "sign-up" || segment == "forgot-password" || segment == "reset-password" ? "backMap" : ""} style={$session.mobile ? `min-height: calc(${innerHeight}px - 121px)` : "mainContent"}>
  {#if $session.mobile || innerWidth < 825}
    <MobileNav />
  {:else}
    <Nav />
  {/if}
  {#if segment == "contact" || segment == "about"}
    <main id="mainNoPadding">
      <slot></slot>
    </main>
  {:else}
    <main class={$session.mobile ? "mobile" : ""}>
      <slot></slot>
    </main>
  {/if}
</div>

<Footer />