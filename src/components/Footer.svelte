<script>
	import { stores } from '@sapper/app';
  const { session } = stores();

  const yearText = "2020 - " + new Date().getFullYear();
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
    width: 90px;
    margin: 1.3em 0 0;
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

  .mobileFList {
    margin: 0.9em 0;
  }

  .mobileCopyright {
    font-size: 0.7em;
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
    <ul class={$session.mobile ? "mobileFList" : ""}>
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
      <p class={$session.mobile ? "mobileCopyright" : ""}>&copy; {yearText} Smartmail Inc. <span style="margin-left: 0.3em;"> All rights reserved.</span></p>
    {:else}
      <p>&copy; {yearText} Smartmail Inc.</p>
      <p>All rights reserved.</p>
    {/if}
</footer>
