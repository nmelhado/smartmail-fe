<script>
	import { goto, stores } from '@sapper/app';
  import { get } from '../utils/helper.js';
	import AddressBook from '../../components/AddressBook/AddressBook.svelte'; 
	import AddContact from '../../components/AddressBook/AddContact.svelte'; 
  import IconButton, {Icon} from '@smui/icon-button';

  const { session } = stores();
  
  async function checkConnection() {
    try {
      const response = await get(`api/auth/check-credentials`);
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
      const response = await get(`api/manage/get_contacts`);
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

  p {
    text-align: center;
  }

  #infoBlock {
    color: var(--gray);
    font-style: italic;
    padding: 1em;
    width: 80%;
    margin: 0 auto;
  }

  .mobileH1 {
    font-size: 1.6em;
  }
</style>

<svelte:head>
  <title>smartmail - Address Book</title>
</svelte:head>

<h1 class={$session.mobile ? "mobileH1" : ""}>Your Contact List <IconButton class="material-icons" on:click={refreshContacts}>refresh</IconButton></h1>
{#if $session.contacts && $session.contacts.length > 0}
  <AddressBook mobile={$session.mobile} contacts={$session.contacts} />
{:else}
  <p>Sorry! It looks like you don't have any addresses saved yet.</p>
{/if}

<AddContact />

<div id="infoBlock">
  <p>
    The Smartmail address book keeps track of all your Smartmail contacts.
  </p>
  <p>
    When you send mail to or recieve mail from a Smartmail contact, their information will automatically be added to your address book. There's no need to manually add an address ever!
  </p>
  <p>
    If you do want to add an address yourself though, you can. Just give us your contact's smartID&trade; and either their email address or their phone number and we will add them to your address book.
  </p>
</div>