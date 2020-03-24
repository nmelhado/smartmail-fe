<script>
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

</style>

<nav>
	<ul>
    <li><a id='logo-link' href='.'><img id='home-logo' alt='small logo' src='smartmail v2 square - 100-min.png'></a></li>
		<li><a aria-current='{segment === undefined ? "page" : undefined}' style='{segment === undefined ? "color: var(--primary);" : undefined}' href='.'>home</a></li>
		<li><a aria-current='{segment === "about" ? "page" : undefined}' style='{segment === "about" ? "color: var(--primary);" : undefined}' href='about'>about</a></li>
		<li><a aria-current='{segment === "contact" ? "page" : undefined}' style='{segment === "contact" ? "color: var(--primary);" : undefined}' href='contact'>contact us</a></li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<li><a rel=prefetch aria-current='{segment === "account" ? "page" : undefined}' style='{segment === "account" ? "color: var(--primary);" : undefined}' href='account'>my account</a></li>
		<li id='sign-up'><a rel=prefetch aria-current='{segment === "sign-up" || segment === "login" ? "page" : undefined}' style='{segment === "sign-up" || segment === "login" ? "color: var(--primary);" : undefined}' href='sign-up'>sign up/login</a></li>
	</ul>
</nav>
