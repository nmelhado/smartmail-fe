<script>
  import { post } from '../routes/utils.js';
  import Drawer, {AppContent, Content, Title, Scrim} from '@smui/drawer';
  import List, {Item, Text, Graphic, Separator} from '@smui/list';
  import IconButton from '@smui/icon-button';

	import { goto, stores } from '@sapper/app';

  const { session, page } = stores();

  let myDrawer;
  let myDrawerOpen = false;

  function navigate(value) {
    myDrawerOpen = false;
    goto(value)
  }
  
	async function logout(event) {
    myDrawerOpen = false;
		await post(`auth/logout`);
    $session.user = null;
    $session.addresses = null;
    goto('/');
  }

  const user = $session.user
</script>

<style>
	nav {
    font-weight: 300;
    padding: 0;
    display: inline-block;
  }
  * :global(.sandwich) {
    padding: 0.5em;
    font-size: 1.9em;
    font-weight: 100;
    color: var(--veryDarkGray);
  }
</style>

<nav>

  <div>
    <div class="drawer-container">
      <Drawer variant="modal" bind:this={myDrawer} bind:open={myDrawerOpen}>
          {#if $session.user && $session.user.first_name}

          <Title>Hello {$session.user.first_name}</Title>
          {/if}
        <Content>
          <List>
            <Item href="javascript:void(0)" on:click={() => navigate('/')} activated={$page.path === '/'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>home</Text>
            </Item>
            <Item href="javascript:void(0)" on:click={() => navigate('/about')} activated={$page.path === '/about'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>about</Text>
            </Item>
            <Item href="javascript:void(0)" on:click={() => navigate('/contact')} activated={$page.path === '/contact'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>contact us</Text>
            </Item>
          {#if $session.user && $session.user.first_name}
            <Item href="javascript:void(0)" on:click={() => navigate('/addresses')} activated={$page.path === '/addresses'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>address book</Text>
            </Item>
            <Item href="javascript:void(0)" on:click={() => navigate('/account')} activated={$page.path === '/account'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>my account</Text>
            </Item>

            <Separator nav />
            <Item href="javascript:void(0)" on:click={() => logout()} activated={$page.path === '/sign-up'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>log out</Text>
            </Item>
          {:else}
            <Item href="javascript:void(0)" on:click={() => navigate('/login')} activated={$page.path === '/addresses'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>address book</Text>
            </Item>
            <Item href="javascript:void(0)" on:click={() => navigate('/login')} activated={$page.path === '/account'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>my account</Text>
            </Item>

            <Separator nav />
            <Item href="javascript:void(0)" on:click={() => navigate('/login')} activated={$page.path === '/login'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>login</Text>
            </Item>
            <Item href="javascript:void(0)" on:click={() => navigate('/sign-up')} activated={$page.path === '/sign-up'}>
              <Graphic class="material-icons" aria-hidden="true">home</Graphic>
              <Text>sign-up</Text>
            </Item>
          {/if}
          </List>
        </Content>
      </Drawer>

      <Scrim />
      <AppContent class="app-content">
        <div class="main-content">
          <IconButton class="material-icons sandwich" on:click={() => myDrawerOpen = !myDrawerOpen}>menu</IconButton>
        </div>
      </AppContent>
    </div>
  </div>
</nav>
