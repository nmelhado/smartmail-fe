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
  
  #home-logo {
    width: 150px;
    margin: 15px 15px 0;
    vertical-align: middle;
  }

  p {
    font-style: italic;
    margin: .1em;
    color: var(--darkGray);
  }

	li {
    display: inline-block;
    text-align: center;
    padding: 0 1.3em;
    color: var(--veryDarkGray);
  }
  
  a {
    text-decoration: none;
  }
  
  a:hover {
    color: var(--primaryAccent);
  }

</style>

<footer>
    <img id='home-logo' alt='small logo' src='smartmail v2 long - 250-min.png'>
    <ul>
      <li><a href='.'>home</a></li>
      <li><a href='about'>about</a></li>
      <li><a href='contact'>contact us</a></li>

      {#if $session.user}
        <li><a rel=prefetch href='account'>my account</a></li>
      {:else}
        <li><a  href='sign-up'>sign up</a></li>
        <li><a  href='login'>login</a></li>
      {/if}
    </ul>
    <p>&copy; {yearText} PinPoint LLC</p>
    <p>All rights reserved.</p>
</footer>
