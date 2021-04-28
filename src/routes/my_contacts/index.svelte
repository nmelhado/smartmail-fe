<script>
	import { goto, stores } from '@sapper/app';
  import { get } from '../utils/helper.js';
	import AddressBook from '../../components/AddressBook/AddressBook.svelte'; 
	import AddContact from '../../components/AddressBook/AddContact.svelte'; 
	import UtilityBar from '../../components/UtilityBar.svelte'; 
  import { onMount } from 'svelte';
  import queryString from "query-string"


  const { session } = stores();

  let contacts = []
  let contactCount = 0;
  const limit = 10;
  let lastPage = 0;
  let page = 1;
  let search = "";
  let searchParam = "";

  if(typeof window !== 'undefined') {
    const queryParams = queryString.parse(window.location.search)
    if (queryParams.smartID && queryParams.smartID != "") {
      search = queryParams.smartID;
      searchParam = `&search=${search}`;
    }
  }

	onMount(async () => {
    refreshPage()
  });

  async function refreshPage() {
    page = 1;
    try {
      const response = await get(`api/manage/get_contacts?limit=${limit}&page=${page}&sort=name${searchParam}`);
      if (response.contacts) {
        contacts = response.contacts;
        contactCount = response.count;
        lastPage = Math.ceil(contactCount/limit)
      }
    } catch(err) {
      console.log(err);
    }
  }
  
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
  <title>smartmail - My Contacts</title>
</svelte:head>

<UtilityBar exclude="my_contacts" />

<h1 class={$session.mobile ? "mobileH1" : ""}>Your Contact List</h1>
{#if contacts && contacts.length > 0}
  <AddressBook mobile={$session.mobile} bind:search={search} bind:contacts={contacts} bind:contactCount={contactCount} bind:page={page} {limit} bind:lastPage={lastPage} />
{:else}
  <p>Sorry! It looks like you don't have any addresses saved yet.</p>
{/if}

<AddContact on:refreshPage={refreshPage}/>

<div id="infoBlock">
  <p>
    The Smartmail my contacts keeps track of all your Smartmail contacts.
  </p>
  <p>
    When you send mail to or recieve mail from a Smartmail contact, their information will automatically be added to your my contacts. There's no need to manually add an address ever!
  </p>
  <p>
    If you do want to add an address yourself though, you can. Just give us your contact's smartID&trade; and either their email address or their phone number and we will add them to your my contacts.
  </p>
</div>