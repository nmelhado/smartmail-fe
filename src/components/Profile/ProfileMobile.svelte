<script>
	import { goto, stores } from '@sapper/app';
	import { post, standardizeDates, formatPhoneNumber } from '../../routes/utils/helper.js';
	// import AddressCard from './AddressCard.svelte'; 
  import IconButton, {Icon} from '@smui/icon-button';
  import Button, {Label} from '@smui/button';

  const { session } = stores();

  export let checkConnection;

  function blah () {
    checkConnection();
  }

	async function logout(event) {
		await post(`api/auth/logout`);
    $session.user = null;
    $session.addresses = null;
    $session.contacts = null;
    goto('/');
  }
  console.log(session)

</script>

<svelte:head>
  <title>smartmail - {$session.user.first_name}'s Profile</title>
</svelte:head>

<style>
  h1 {
    margin-bottom: 0px;
  }

  h2 {
    color: var(--primaryAccent);
    margin: 0;
    font-size: 1.8em;
  }

  h3 {
    font-size: 1.8em;
    text-align: center;
    color: var(--darkGray);
  }

  h4 {
    font-size: 1.6em;
    text-align: center;
    color: var(--gray);
    margin: 0.5em 0 1em;
  }
  
  #logOut {
    margin: 0 0 40px;
    text-align: center;
    color: var(--secondaryAccent)
  }
</style>

<h1>Hello {$session.user.first_name}!</h1>
<p id="logOut"class="text-xs-center">
  <a href="/"  on:click|preventDefault={logout}>Log out</a>
</p>