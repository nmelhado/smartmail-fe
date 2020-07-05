
<script>
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
	import { formatPhoneNumber, get } from '../../routes/utils/helper.js';
  import Pagination from '../Pagination'
  import Textfield from '@smui/textfield'
  import Fab, {Icon} from '@smui/fab';
  import Button, {Icon as ButtonIcon} from '@smui/button';

  export let contacts, mobile, contactCount, page, limit, search;

  let togglePageNumbers = false;

  function searchContacts() {
    getContacts("search");
  }

  async function getContacts(type = "newPage") {
    try {
      let tempPage = page;
      if(type == "search") {
        tempPage = 1;
      }
      const response = await get(`api/manage/get_contacts?limit=${limit}&page=${tempPage}&sort=name&search=${search}`);
      if (response.success) {
        page = tempPage;
        contacts = response.contacts ? response.contacts : [];
        contactCount = response.count;
      }
    } catch(err) {
      console.log(err);
    }
    togglePageNumbers = togglePageNumbers == false;
  }
</script>

<style>
  #searchBar {
    text-align: center;
  }

  form {
    display: inline-flex;
    position: relative;
    justify-content: space-around;
  }
</style>

<div id="searchBar">
  <form on:submit|preventDefault={searchContacts}>
    <Textfield variant="outlined" bind:value={search} label="Search by name" />
    <Button variant="outlined" color="secondary" style="text-align: center; margin: 10px 0 0 10px;"><ButtonIcon class="material-icons" style="color: var(--darkGray); margin: 0;">search</ButtonIcon></Button>
    {#if search != "" }
      <Fab color="secondary" on:click={() => {search = ""; searchContacts();}} mini style="background-color: #aaa; position: absolute; top: 1.2em; right: 85px; width: 20px; height: 20px;"><Icon class="material-icons" style="color: var(--white); font-size: 1.3em; margin: -2px;">close</Icon></Fab>
    {/if}
  </form>
</div>
<DataTable id={mobile ? "contactTableM" : "contactTable" } table$aria-label="Contacts" table$style="width: 100%;">
  <Head>
    <Row>
      <Cell>Name</Cell>
      <Cell>SmartID</Cell>
      <Cell class="emailCell">E-mail</Cell>
      <Cell class="phoneCell">Phone</Cell>
    </Row>
  </Head>
  <Body>

    {#each contacts as contact}
      <Row>
        <Cell>{contact.name}</Cell>
        <Cell><span style="margin-right: 0.4em;">{contact.smart_id.substring(0, 4)}</span>{contact.smart_id.substring(4)}</Cell>
        <Cell class="emailCell"><a href="mailto:{contact.email}" target="_top">{contact.email}</a></Cell>
        <Cell class="phoneCell"><a href="tel:{contact.phone}">{formatPhoneNumber(contact.phone)}</a></Cell>
      </Row>
    {/each}

  </Body>
</DataTable>

{#if contactCount > page * limit}
  {#if togglePageNumbers}
    <Pagination bind:page={page} bind:limit={limit} bind:count={contactCount} {mobile} on:changePage={getContacts} />
  {:else}
    <Pagination bind:page={page} bind:limit={limit} bind:count={contactCount} {mobile} on:changePage={getContacts} />
  {/if}
{/if}