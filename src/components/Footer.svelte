<script>
	import { stores } from '@sapper/app';
  const { session } = stores();

  let yearText = '';
  const year = new Date().getFullYear()
  if (year > 2020) {
    yearText = "2020 - " + year
  } else {
    yearText = year
  }
</script>

<style>
	footer {
    width: 100%;
		border-top: 1px solid rgba(27,231,255,0.2);
		font-weight: 300;
    height: 190px;
    text-align: center;
    background-color: var(--veryLightGray);
  }

	footer.mobile {
    height: 120px;
  }
  
  #home-logo {
    width: 150px;
    margin: 15px 15px 0;
    vertical-align: middle;
  }
  
  #home-logo-mobile {
    width: 150px;
    margin: 5px 15px 0;
    vertical-align: middle;
  }

  p {
    font-style: italic;
    margin: .1em;
    color: var(--darkGray);
  }

  ul {
    padding: 0;
  }

	li {
    display: inline-block;
    text-align: center;
    padding: 0 1.3em;
    color: var(--veryDarkGray);
  }

  .mobileF {
    padding: 0 0.5em;
  }
  
  a {
    text-decoration: none;
  }
  
  a:hover {
    color: var(--primaryAccent);
  }

</style>

<footer class={$session.mobile ? "mobile" : ""}>
    <img id={$session.mobile ? "home-logo-mobile" : "home-logo"} alt='small logo' src='smartmail v2 long - 250-min.png'>
    <ul>
      <li class={$session.mobile ? "mobileF" : ""}><a href='.'>home</a></li>
      <li class={$session.mobile ? "mobileF" : ""}><a href='about'>about</a></li>
      <li class={$session.mobile ? "mobileF" : ""}><a href='contact'>contact us</a></li>

      {#if $session.user}
        <li class={$session.mobile ? "mobileF" : ""}><a rel=prefetch href='account'>my account</a></li>
      {:else}
        <li class={$session.mobile ? "mobileF" : ""}><a  href='sign-up'>sign up</a></li>
        <li class={$session.mobile ? "mobileF" : ""}><a  href='login'>login</a></li>
      {/if}
    </ul>
    {#if $session.mobile}
      <p>&copy; {yearText} PinPoint LLC <span style="margin-left: 0.3em;"> All rights reserved.</span></p>
    {:else}
      <p>&copy; {yearText} PinPoint LLC</p>
      <p>All rights reserved.</p>
    {/if}
</footer>
