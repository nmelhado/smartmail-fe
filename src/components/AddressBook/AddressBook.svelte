
<script>
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
	import { formatPhoneNumber } from '../../routes/utils/helper.js';
  import Pagination, {paginate} from '../Pagination'
  import Textfield from '@smui/textfield'
  import Fab, {Icon} from '@smui/fab';
  import Button, {Icon as ButtonIcon} from '@smui/button';

  export let contacts, mobile;

  let currentPage = 1
  const pageSize = 10;

  let usableContacts = contacts;

  let togglePageNumbers = false;

  let itemsLength = usableContacts.length;

  let search = "";

  $: paginatedContacts = paginate( usableContacts, currentPage, pageSize)

  function searchContacts() {
    usableContacts = contacts.filter( contact => contact.name.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    itemsLength = usableContacts.length;
    paginatedContacts = paginate( usableContacts, currentPage, pageSize);
    currentPage = 1;
    togglePageNumbers = togglePageNumbers == false;
  }

</script>

<style>
  #searchBar {
    text-align: center;
  }

  form {
    display: inline-block;
    position: relative;
  }
</style>

<div id="searchBar">
  <form on:submit|preventDefault={searchContacts}>
    <Textfield variant="outlined" bind:value={search} label="Search by name" />
    <Button variant="outlined" color="secondary" style="text-align: center;"><ButtonIcon class="material-icons" style="color: var(--darkGray); margin: 0;">search</ButtonIcon></Button>
    {#if usableContacts.length < contacts.length }
      <Fab color="secondary" on:click={() => {search = ""; searchContacts();}} mini style="background-color: #aaa; position: absolute; top: 1.2em; right: 80px; width: 20px; height: 20px;"><Icon class="material-icons" style="color: var(--white); font-size: 1.3em; margin: -2px;">close</Icon></Fab>
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

    {#each paginatedContacts as contact}
      <Row>
        <Cell>{contact.name}</Cell>
        <Cell><span style="margin-right: 0.4em;">{contact.smart_id.substring(0, 4)}</span>{contact.smart_id.substring(4)}</Cell>
        <Cell class="emailCell"><a href="mailto:{contact.email}" target="_top">{contact.email}</a></Cell>
        <Cell class="phoneCell"><a href="tel:{contact.phone}">{formatPhoneNumber(contact.phone)}</a></Cell>
      </Row>
    {/each}

  </Body>
</DataTable>

{#if itemsLength > pageSize}
  {#if togglePageNumbers}
    <Pagination bind:togglePageNumbers={togglePageNumbers} bind:currentPage={currentPage} {pageSize} {itemsLength} {mobile} />
  {:else}
    <Pagination bind:togglePageNumbers={togglePageNumbers} bind:currentPage={currentPage} {pageSize} {itemsLength} {mobile} />
  {/if}
{/if}