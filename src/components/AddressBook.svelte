
<script>
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
	import { get, formatPhoneNumber } from '../routes/utils.js';
	import { stores } from '@sapper/app';

  const { session } = stores();

  export let contacts;

</script>

<DataTable id={$session.mobile ? "contactTableM" : "contactTable" } table$aria-label="Contacts" table$style="width: 100%;">
  <Head>
    <Row>
      <Cell>Name</Cell>
      <Cell>SmartID</Cell>
      {#if !$session.mobile}
        <Cell>E-mail</Cell>
        <Cell>Phone</Cell>
      {/if}
    </Row>
  </Head>
  <Body>

    {#each contacts as contact}
      <Row>
        <Cell>{contact.name}</Cell>
        <Cell><span style="margin-right: 0.4em;">{contact.smart_id.substring(0, 4)}</span>{contact.smart_id.substring(4)}</Cell>
        {#if !$session.mobile}
          <Cell><a href="mailto:{contact.email}" target="_top">{contact.email}</a></Cell>
          <Cell><a href="tel:{contact.phone}">{formatPhoneNumber(contact.phone)}</a></Cell>
        {/if}
      </Row>
    {/each}
  </Body>
</DataTable>