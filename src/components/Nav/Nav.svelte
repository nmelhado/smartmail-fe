<script>
  import { post } from '../../routes/utils/helper.js';
  import { goto, stores } from '@sapper/app';
  import Menu from '@smui/menu';
  import {Anchor} from '@smui/menu-surface';
  import List, {Item, Separator, Text} from '@smui/list';

  const { session, page } = stores();
  
  const user = $session.user

	async function logout(event) {
		await post(`api/auth/logout`);
    $session.user = null;
    $session.addresses = null;
    goto('/');
  }


  let menu;
  let anchor;
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

  #anchor {
    position: absolute;
    right: 0;
    height: 57px;
  }
</style>

<nav>
	<ul>
    <li><a id='logo-link' href='.'><img id='home-logo' alt='small logo' src='smartmail v2 square - 100-min.png'></a></li>
		<li><a aria-current='{$page.path === "/" ? "page" : undefined}' class='{$page.path === undefined ? "primary" : ''}' href='.'>home</a></li>
    {#if $session.user && $session.user.first_name}
		  <li><a rel=prefetch aria-current='{$page.path === "/account" ? "page" : undefined}' class='{$page.path === "/account" ? "primary" : ''}' href='account'>my account</a></li>
		  <li><a rel=prefetch aria-current='{$page.path === "/addresses" ? "page" : undefined}' class='{$page.path === "/addresses" ? "primary" : ''}' href='addresses'>address book</a></li>
    {:else}
      <li><a aria-current='{$page.path === "/account" ? "page" : undefined}' class='{$page.path === "/account" ? "primary" : ''}' href='login'>my account</a></li>
		  <li><a aria-current='{$page.path === "/addresses" ? "page" : undefined}' class='{$page.path === "/addresses" ? "primary" : ''}' href='login'>address book</a></li>
    {/if}
		<li><a aria-current='{$page.path === "/about" ? "page" : undefined}' class='{$page.path === "/about" ? "primary" : ''}' href='about'>about</a></li>
		<li><a aria-current='{$page.path === "/contact" ? "page" : undefined}' class='{$page.path === "/contact" ? "primary" : ''}' href='contact'>contact us</a></li>

    {#if $session.user && $session.user.first_name}
      <li id='sign-up'><a rel=prefetch on:click|preventDefault={() => menu.setOpen(true)} href='account'>Hello {$session.user.first_name}!</a></li>
      <Menu style="width: 210px;" bind:this={menu} anchor={false} bind:anchorElement={anchor} anchorCorner="BOTTOM_LEFT">
        <List>
          <Item on:SMUI:action={() => goto('/dashboard')}>
            <Text>
              dashboard
            </Text>
          </Item>
          <Item on:SMUI:action={() => goto('/account')}>
            <Text>
              my account
            </Text>
          </Item>
          <Item on:SMUI:action={() => goto('/addresses')}>
            <Text>
              address book
            </Text>
          </Item>
          <Separator />
          <Item on:SMUI:action={() => logout()}>
            <Text>
              log out
            </Text>
          </Item>
        </List>
      </Menu>
    {:else}
      <li id='sign-up'><a aria-current='{$page.path === "/sign-up" || $page.path === "/login" ? "page" : undefined}' class='{$page.path === "/sign-up" || $page.path === "/login" ? "primary" : ''}' href='sign-up'>sign up/login</a></li>
    {/if}
	</ul>
  <div id="anchor"  use:Anchor bind:this={anchor} />
</nav>
