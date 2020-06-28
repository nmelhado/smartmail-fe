<script>
	import { goto, stores } from '@sapper/app';
  import Button, {Label} from '@smui/button';

	const { session } = stores();

  function signUp() {
    goto('sign-up')
  }
  function about() {
    goto('about')
  }
  function myAccount() {
    goto('account')
  }
</script>

<style>
	h2 {
    font-size: 1.4em;
    font-weight: 400;
    margin: -12px 0 2.5em 20px;
    color: var(--darkGray);
    font-style: italic;
  }
  
  #logo {
		width: 100%;
    top: 2px;
    left: 0;
    right: 0;
    margin: 0 auto;
	}

  #home-banner {
    text-align: center;
  }

  .bgImg {
    width: 100%;
    height: auto;
    margin-top: -10px;
  }

  #bgImgBottom {
    transform: scaleY(-1);
    width: 100%;
    height: auto;
    margin-top: -10px;
  }

  #bg {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  #ctaM {
    position: relative;
    width: 85%;
    max-width: 250px;
    margin: 4em 0 0;
    left: 7.5%;
  }

  #cta {
    position: absolute;
    left: 10%;
    width: 80%;
    max-width: 550px;
    margin-top: 10%;
  }

  #buttons {
    width: 95%;
    margin-left: 4.5%;
    display: flex;
  }

  #buttonsM {
    width: 100%;
    text-align: center;
  }

  * :global(.homeButton) {
    min-height: 40px;
    flex-grow: 12;
  }

  * :global(.homeButtonM) {
    min-height: 40px;
    width: 70%;
    margin: 0 0 5px;
  }

  #spacer {
    flex-grow: 1;
  }
</style>

<svelte:head>
	<title>smartmail - Home</title>
</svelte:head>

<div id="bg">
  <img src="mailBackground.jpg" class="bgImg" alt="">
  <img src="mailBackground.jpg" id="bgImgBottom" alt="">
  <img src="mailBackground.jpg" class="bgImg" alt="">
  <img src="mailBackground.jpg" id="bgImgBottom" alt="">
</div>

<div id={$session.mobile ? "ctaM" : "cta"}>
  <div id='home-banner'>
    <img id="logo" alt='logo' src='smartmail v2 long - 1000-min.png'>
  </div>
  <h2>Send to people, not places​</h2>
  <div id={$session.mobile ? "buttonsM" : "buttons"}>
    <Button color="secondary" class={$session.mobile ? "homeButtonM" : "homeButton"} variant="unelevated"  on:click={about}><Label class="submitButtonLabel">About Us</Label></Button>
    {#if !$session.mobile}
      <div id="spacer"/>
    {/if}
    {#if $session.user}
      <Button class={$session.mobile ? "homeButtonM" : "homeButton"} variant="unelevated"  on:click={myAccount}><Label class="submitButtonLabel">My Account</Label></Button>
    {:else}
      <Button class={$session.mobile ? "homeButtonM" : "homeButton"} variant="unelevated"  on:click={signUp}><Label class="submitButtonLabel">Sign Up</Label></Button>
    {/if}
  </div>
</div>
