<script>
	import { stores } from '@sapper/app';

  const { session } = stores();
  const mobile = $session.mobile;
  $: innerWidth = 0;
</script>
  
<svelte:head>
	<title>smartmail - About</title>
</svelte:head>

<style>
  #header {
    width: 100%;
    position: relative;
  }

  #headerImage {
    width: 100%;
    height: auto;
  }

  #longLogo {
    width: 90%;
    max-width: 500px;
    height: auto;
    display: block;
    margin: 4em auto 2em;
  }

  .basicInfo {
    width: 90%;
    padding: 0 5%;
    margin: 4em auto;
  }

  h1 {
    font-size: 2.2em;
    text-align: left;
    margin-top: 1.8em;

  }

  p {
    width: 100%;
    color: var(--darkGray);
    text-align: justify;
    margin: 1em 0;
    font-size: 1.2em;
  }

  #info {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* desktop */

  .infoBlock {
    width: 90%;
    padding: 0 5%;
    border-bottom: 1px solid var(--primaryAccentFade);
    position: relative;
  }

  .infoBlock div {
    width: 46%;
    display: inline-block;
    padding: 2em 0;
  }

  .infoBlock div h1 {
    margin-top: 0.4em;
  }

  .infoBlock .infoImg {
    position: absolute;
    width: 50%;
    height: 100%;
    padding: 0;
    background-size: cover;
    background-position-y: 50%;
  }

  /* mobile */

  .infoBlockM {
    width: 100%;
    padding: 0;
    text-align: center;
    border-bottom: 1px solid var(--primaryAccentFade);
    position: relative;
  }

  .infoBlockM div {
    width: 90%;
    display: inline-block;
    padding: 2em 0;
  }

  .infoBlockM div h1 {
    margin-top: 0.4em;
  }

  .infoBlockM .infoImg {
    width: 100%;
    height: 250px;
    padding: 0;
    background-size: cover;
    background-position-y: 50%;
  }

  .right {
    text-align: right;
  }

  .left {
    text-align: left;
  }

  #moving {
    right: 0;
    background-image: url(moving.jpg);
  }

  #environment {
    left: 0;
    background-image: url(environment.jpg);
    background-position-x: 50%;
  }

  #comp {
    width: 100%;
    height: auto;
  }

  #cta {
    text-align: center;
    width: 90%;
    padding: 0 5%;
    position: relative;
    margin: 6em 0 8em;
  }

  #cta h1 {
    text-align: center;
    font-size: 2.0em;
  }

  #cta p {
    text-align: center;
    font-size: 1.4em;
  }
</style>

<svelte:window bind:innerWidth />

<div id="header">
  <img id="headerImage" src="about-header.jpg" alt="about banner" />
</div>

<img id="longLogo" src="smartmail v2 long - 500-min.png" alt="long smartmail logo" />

<div id="info">
  <div class="basicInfo">
    <h1>What is Smartmail?</h1>
    <p>
      Smartmail wants to make sending mail and packages simple, fast, and error free. When you sign up, you'll give us your mailing address and we'll give you a short 8 character smartID&trade;. This smartID&trade; will replace your mailing address!
    </p>
    <p>
      That means that when people send mail or packages to you (or you send things to yourself), instead of providing a street name, building number, unit number, city, state, and zip code, all you'll need is your smartID&trade;!
    </p>
  </div>

  <div class={mobile || innerWidth < 900 ? "infoBlockM" : "infoBlock left"} style="border-top: 1px solid var(--primaryAccentFade);">
    <div>
      <h1>What happens if I move or stay somewhere else for a while?</h1>
      <p>
        When you move, whether temporarily or permanently, all you have to do is update your Smartmail account with your new address and we'll make sure everything gets where it needs to go.
      </p>
      {#if mobile || innerWidth < 900}
        <div id="moving" class="infoImg" />
      {/if}
      <p>
        This means that you no longer have to worry about updating everyone about your new mailing address!
      </p>
    </div>
    {#if !mobile && innerWidth >= 900}
      <div id="moving" class="infoImg" />
    {/if}
  </div>
  <div class={mobile || innerWidth < 900 ? "infoBlockM" : "infoBlock right"}>
    {#if !mobile && innerWidth >= 900}
      <div id="environment" class="infoImg" />
    {/if}
    <div>
      <h1>What problem does Smartmail solve?</h1>
      <p>
        Annually, in the U.S. alone, <strong>hundreds of billions</strong> of letters and packages fail to reach their intended recipients. This is inefficient, wasteful, costly, and dangerous.
      </p>
      <p>
        When mail and packages fail to reach the correct recipient, they cost the shipping industry billions of dollars and cause harm to our planet. Each year undeliverable mail sends an estimated <strong>300 million pounds of paper waste</strong> to landfills globally and nationally produces <strong>2,629 metric tons of CO2 emissions</strong>.
      </p>
      {#if mobile || innerWidth < 900}
        <div id="environment" class="infoImg" />
      {/if}
      <p>
        In the best case scenario, when a letter or package fails to reach you it is returned to the sender and they can attempt to track down your up-to-date address information and resend the item. However, in the worst case scenario, mail and packages can end up in the hands of an unintended recipient. These packages and letters could contain sensitive information or even valuable items. 
      </p>
    </div>
  </div>

  <div class="basicInfo">
    <h1>How do I use my smartID&trade;?</h1>
    <p>
      Using your smartID&trade; is simple. Just use your smartID&trade; instead of your physical address! Look at the image below of two letters that will both arrive at the same place.
    </p>
    <img src="comp.jpg" id="comp" alt="comparrison of a traditional address and a Smartmail address" />
    <p>
      Not only is a smartID&trade; much shorter and easier to write out, but if Cosmo had changed his address only the smartID&trade; envelope would successfully arrive!
    </p>
  </div>

  <div id="cta">
    <h1>Are you ready for the future of mail?</h1>
    <p>
      <a href="/sign-up">Sign up</a> for your free Smartmail account today!
    </p>
  </div>
</div>

<!-- Mission Card -->
<!-- <InfoCard frontHead={missionFHead} frontBody={missionFBody} rearHead={missionRHead} rearBody={missionRBody} /> -->