<script>
	import { goto, stores } from '@sapper/app';
  import { get } from '../utils.js';
	import AddressBook from '../../components/AddressBook.svelte'; 
  import IconButton, {Icon} from '@smui/icon-button';

  const { session } = stores();
  
  async function checkConnection() {
    try {
      const response = await get(`auth/check-credentials`);
      if (response && !response.ok) {
        delete($session.user);
        delete($session.addresses);
        goto('login');
      }
    } catch(err) {
      console.log(err);
    }
  }

  async function refreshContacts() {
    try {
      const response = await get(`manage/get_contacts`);
      if (response.contacts) {
        $session.contacts = response.contacts;
      }
    } catch(err) {
      console.log(err);
    }
  }

  checkConnection();
</script>

<style>
  h1 {
    color: var(--primaryAccent);
    font-size: 2em;
    margin: 1em 0;
  }
</style>

<svelte:head>
  <title>smartmail - Address Book</title>
</svelte:head>

<h1>Your Contact List <IconButton class="material-icons" on:click={refreshContacts}>refresh</IconButton></h1>
{#if $session.contacts && $session.contacts.length > 0}
  <AddressBook contacts={$session.contacts} />
{:else}
  <p>Sorry! It looks like you don't have any addresses saved yet.</p>
{/if}