<script>
  import { post } from '../routes/utils.js';
	import { goto, stores } from '@sapper/app';
  const { session } = stores();
  
  const user = $session.user
  
	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(27,231,255,0.2);
		font-weight: 300;
		padding: 0 1.5em;
    background-color: var(--veryLightGray);
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
    padding: 0 .5em;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: var(--primary);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
    color: var(--primaryAccent);
    font-weight: bold;
	}

	#logo-link {
		padding: 0.5em 0.5em 0 0;
	}

  #home-logo {
    width: 40px;
  }

  #sign-up {
    float: right;
  }

  .primary {
    color: var(--primary);
  }

</style>

<nav>
	<ul>
    <li><a id='logo-link' href='.'><img id='home-logo' alt='small logo' src='smartmail v2 square - 100-min.png'></a></li>
		<li><a aria-current='{segment === undefined ? "page" : undefined}' class='{segment === undefined ? "primary" : ''}' href='.'>home</a></li>
		<li><a aria-current='{segment === "about" ? "page" : undefined}' class='{segment === "about" ? "primary" : ''}' href='about'>about</a></li>
		<li><a aria-current='{segment === "contact" ? "page" : undefined}' class='{segment === "contact" ? "primary" : ''}' href='contact'>contact us</a></li>

    {#if $session.user && $session.user.first_name}
		  <li><a rel=prefetch aria-current='{segment === "addresses" ? "page" : undefined}' class='{segment === "addresses" ? "primary" : ''}' href='addresses'>address book</a></li>
		  <li><a rel=prefetch aria-current='{segment === "account" ? "page" : undefined}' class='{segment === "account" ? "primary" : ''}' href='account'>my account</a></li>
      <li id='sign-up'><a rel=prefetch href='account'>Hello {$session.user.first_name}!</a></li>
    {:else}
		  <li><a aria-current='{segment === "addresses" ? "page" : undefined}' class='{segment === "addresses" ? "primary" : ''}' href='login'>address book</a></li>
      <li><a aria-current='{segment === "account" ? "page" : undefined}' class='{segment === "account" ? "primary" : ''}' href='login'>my account</a></li>
      <li id='sign-up'><a aria-current='{segment === "sign-up" || segment === "login" ? "page" : undefined}' class='{segment === "sign-up" || segment === "login" ? "primary" : ''}' href='sign-up'>sign up/login</a></li>
    {/if}
	</ul>
</nav>
