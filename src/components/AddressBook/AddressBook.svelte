
<script>
  import DataTable, {Head, Body, Row, Cell, Pagination} from '@smui/data-table';
  import IconButton from '@smui/icon-button';
	import { formatPhoneNumber, get } from '../../routes/utils/helper.js';
  import Textfield from '@smui/textfield';
  import Fab, {Icon} from '@smui/fab';
  import Button, {Icon as ButtonIcon} from '@smui/button';

  export let contacts, mobile, contactCount, page, limit, search, lastPage;

  function searchContacts() {
    getContacts("search");
  }

  const changePage = (newPage) => {
    page = newPage;
    getContacts();
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
        lastPage = Math.ceil(contactCount/limit)
      }
    } catch(err) {
      console.log(err);
    }
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
    <Textfield input$autocomplete="name" variant="outlined" bind:value={search} label="Search by name" />
    <Button touch variant="outlined" color="secondary" style="text-align: center; margin: 10px 0 0 10px;"><ButtonIcon class="material-icons" style="color: var(--darkGray); margin: 0;">search</ButtonIcon></Button>
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
  <Pagination slot="paginate">
    <svelte:fragment slot="total">
      {(page -1) * limit + 1}-{page == lastPage ? contactCount : page * limit} of {contactCount}
    </svelte:fragment>
 
    <IconButton
      class="material-icons"
      action="first-page"
      title="First page"
      on:click={()=>changePage(1)}
      disabled={page === 1}>first_page</IconButton
    >
    <IconButton
      class="material-icons"
      action="prev-page"
      title="Prev page"
      on:click={()=>changePage(page-1)}
      disabled={page === 1}>chevron_left</IconButton
    >
    <IconButton
      class="material-icons"
      action="next-page"
      title="Next page"
      on:click={()=>changePage(page+1)}
      disabled={page === lastPage}>chevron_right</IconButton
    >
    <IconButton
      class="material-icons"
      action="last-page"
      title="Last page"
      on:click={()=>changePage(lastPage)}
      disabled={page === lastPage}>last_page</IconButton
    >
  </Pagination>
</DataTable>