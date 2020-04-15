<script>
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';

  export let enteredAddress;

</script>

<DataTable id="contactTable" table$aria-label="Contacts" table$style="width: 100%;">
  <Head>
    <Row>
      <Cell style="text-align: center;">Field</Cell>
      <Cell style="text-align: center;">Address You Entered</Cell>
    </Row>
  </Head>
  <Body>
    <Row>
      <Cell style="background-color: var(--veryLightGray)">Address Line One</Cell>
      <Cell>{enteredAddress.line_one}</Cell>
    </Row>
    {#if enteredAddress.line_two.trim() != ""}
      <Row>
        <Cell style="background-color: var(--veryLightGray)">Address Line Two</Cell>
        <Cell>{enteredAddress.line_two}</Cell>
      </Row>
    {/if}
    {#if enteredAddress.business_name.trim() != ""}
      <Row>
        <Cell style="background-color: var(--veryLightGray)">Business Name</Cell>
        <Cell>{enteredAddress.business_name}</Cell>
      </Row>
    {/if}
    {#if enteredAddress.attention_to.trim() != ""}
      <Row>
        <Cell style="background-color: var(--veryLightGray)">Attention To</Cell>
        <Cell>{enteredAddress.attention_to}</Cell>
      </Row>
    {/if}
    <Row>
      <Cell style="background-color: var(--veryLightGray)">City</Cell>
      <Cell>{enteredAddress.city}</Cell>
    </Row>
    <Row>
      <Cell style="background-color: var(--veryLightGray)">State</Cell>
      <Cell>{enteredAddress.state}</Cell>
    </Row>
    <Row>
      <Cell style="background-color: var(--veryLightGray)">Zip Code</Cell>
      <Cell>{enteredAddress.zip_code}</Cell>
    </Row>
  </Body>
</DataTable>