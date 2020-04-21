
<script>
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
	import { formatPhoneNumber } from '../../routes/utils/helper.js';

  export let contacts, mobile;

</script>

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