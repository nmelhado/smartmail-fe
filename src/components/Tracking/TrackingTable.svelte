<script>
	import { stores } from '@sapper/app';
	import { put, trackPackage } from '../../routes/utils/helper.js';
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
  import { Graphic } from '@smui/list';

  const { session } = stores();

  export let trakingPackages, checkConnection;

  let submitErrors = [];
  let displayMore = {};
  let packageDescription = {};
  let extraInfo = '';
  let currentRow = null;

  for (const userPackage of trakingPackages) {
    displayMore[userPackage.tracking] = false;
    packageDescription[userPackage.tracking] = {id: userPackage.id, description: userPackage.description};
  }

  const user = $session.user;

  async function toggleRow(row, mailCarrier) {
    extraInfo = "<tr><td>Loading. . .</td></tr>";
    const currentStatus = displayMore[row];
    displayMore[currentRow] = false;
    displayMore[row] = currentStatus == false;
    currentRow = row;
    const moreInfo = await trackPackage(mailCarrier, row);
    // Create tracking data rows
    createExtraInfo(moreInfo.activity)
  }

  function createExtraInfo(activities) {
    let newRows = '';
    for (const activity of activities) {
      const dateTime = activity.DateTime.split('-');
      const dTime = new Date(dateTime[0].substr(0, 4), dateTime[0].substr(4, 2) - 1, dateTime[0].substr(6, 2), dateTime[1].substr(0, 2), dateTime[1].substr(2, 2), dateTime[1].substr(4, 2));
      const row = `
        <tr>
          <td class="extraInfoCell">${activity.Status}</td>
          <td class="extraInfoCell">${activity.Location}</td>
          <td class="extraInfoCell">${dTime.toString().split(' GMT')[0]}</td>
        </tr>
      `;
      newRows += row;
    }
    extraInfo = newRows;
  }

  async function updateDescription(row) {
    checkConnection();

		const response = await put('api/track/update_description', {id: packageDescription[row].id, description: packageDescription[row].description});

		// TODO handle network errors
		submitErrors = response.error;

    if (submitErrors != null) {
      console.error(submitErrors);
      
    }
  }
</script>

<style>
  .nameRow {
    background-color: #f0f0f0;
    box-shadow: inset 0 4px 4px -1px #ddd;
  }

  .nameTable {
    width: 100%;
  }

  .mailCarrierIcon {
    height: 20px;
    vertical-align: middle;
  }

  .mailCarrierIconSmall {
    height: 18px;
    vertical-align: middle;
  }

  @media (min-width: 500px) {
    .mailCarrierIconSmall {
      display: none;
    }
  }

  @media (max-width: 394px) {
    .mailCarrierIconSmall {
      display: none;
    }
  }

  @media (max-width: 499px) {
    .mailCarrierIcon {
      display: none;
    }
  }

  .discreetInput {
    background: none;
    border: none;
    font-family: B612,Roboto,sans-serif;
    color: var(--veryDarkGray);
    padding: 10px;
    padding-left: 6px;
    padding-right: 0;
    max-width: 200px;
  }

  .discreetInput::placeholder {
    font-style: italic;
    color: var(--gray);
  }

  .discreetInput:focus {
    outline-color: var(--lightGray);
    outline-style: solid;
  }

  .smartIDSpacer {
    margin-right: 0.4em; 
  }

  .nameTable td {
    white-space: pre-wrap;
  }

  * :global(table.extraInfoTable) {
    border-collapse: collapse;
  }

  * :global(table.extraInfoTable tr) {
    border-bottom: 1px solid #d0d0d0;
  }

  * :global(table.extraInfoTable tr:last-child) { 
      border-bottom: none; 
  }

  * :global(.extraInfoCell) {
    text-align: left;
    white-space: pre-wrap;
    padding: 0.7em 0.2em;
    max-width: 40px;
  }

  * :global(table.extraInfoTable tr td:first-child) { 
      padding-left: 0.4em; 
  }

  * :global(table.extraInfoTable tr td:last-child) { 
      padding-right: 0.4em; 
  }
  
  * :global(.trackingRow) {
    cursor: pointer;
  }

  * :global(.nameCell) {
    padding-left: 0px;
    padding-right: 0px;
  }

  * :global(.extraInfoRow) {
    background-color: #e2e2e2;
    box-shadow: inset 0 8px 8px -2px #ccc;
    padding: 0;
  }

  * :global(.outgoing) {
    background-color: rgba(26,200,237,.07);
  }

  * :global(.incoming) {
    background-color: rgba(26,237,200,.07);
  }

  * :gobal(.expandRow) {
    text-align:center;
    padding-right: 4px;
    padding-left: 4px;
  }

  * :global(.collapse) {
    margin-right: 0px;
  }

  * :global(.trackingCell) {
    padding-left: 0;
    text-align: left;
  }

  * :global(.descHeadingSmall) {
    display: none;
  }

  @media (max-width: 479px) {
    * :global(.trackingCell) {
      padding-right: 0;
      text-align: left;
    }
    * :global(.descHeadingLarge) {
      display: none;
    }
    * :global(.descHeadingSmall) {
      display: table-cell;
    }
    * :global(.mailHeadingLarge) {
      display: none;
    }
  }
</style>

<DataTable table$aria-label="Packages" table$style="width: 100%;" style="width:100%;">
  <Head>
    <Row>
      <Cell class="descHeadingLarge" colspan="2">Description</Cell>
      <Cell class="descHeadingSmall" colspan="3">Description</Cell>
      <Cell class="mailHeadingLarge">Mail Carrier</Cell>
    </Row>
  </Head>
  <Body>
  {#each trakingPackages as trakingPackage}
    <Row class="trackingRow {trakingPackage.sender_smart_id == user.smart_id ? "outgoing" : "incoming"}" on:click={() => toggleRow(trakingPackage.tracking, trakingPackage.mail_carrier)}>
      {#if displayMore[trakingPackage.tracking]}
        <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_less</Graphic></Cell>
      {:else}
        <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_more</Graphic></Cell>
      {/if}
      <Cell class="trackingCell trackingInput">
        <form on:submit|preventDefault>
          <input on:click|stopPropagation on:blur={() => updateDescription(trakingPackage.tracking, trakingPackage.mail_carrier)} type="text" class="discreetInput" placeholder="add a description" bind:value={packageDescription[trakingPackage.tracking].description}/>
        </form>
      </Cell>
      <Cell class="trackingCell"><img class="mailCarrierIcon" src="mailCarriers/{trakingPackage.mail_carrier.toLowerCase()}.png" alt="{trakingPackage.mail_carrier.toLowerCase()}"/><img class="mailCarrierIconSmall" src="mailCarriers/{trakingPackage.mail_carrier.toLowerCase()}_small.png" alt="{trakingPackage.mail_carrier.toLowerCase()}"/></Cell>
    </Row>
    {#if displayMore[trakingPackage.tracking]}
      <tr class="nameRow">
        <Cell colspan="4" class="nameCell">
          <table class="nameTable">
            <tr>
              {#if trakingPackage.sender_smart_id}
                <td>From: {trakingPackage.sender_name} (<span class="smartIDSpacer">{trakingPackage.sender_smart_id.substring(0, 4)}</span>{trakingPackage.sender_smart_id.substring(4)})</td>
              {:else}
                <td>No sender provided</td>
              {/if}
              {#if trakingPackage.recipient_smart_id}
                <td>To: {trakingPackage.recipient_name} (<span class="smartIDSpacer">{trakingPackage.recipient_smart_id.substring(0, 4)}</span>{trakingPackage.recipient_smart_id.substring(4)})</td>
              {:else}
                <td>No recipient provided</td>
              {/if}
            </tr>
            <tr>
              <td colspan="2">Tracking #:&nbsp;&nbsp;&nbsp;{trakingPackage.tracking}</td>
            </tr>
          </table>
        </Cell>
      </tr>
      <Row>
        <Cell colspan="4" class="extraInfoRow">
          <table class="extraInfoTable" style="width:100%;">
            {@html extraInfo}
          </table>
        </Cell>
      </Row>
    {/if}
  {/each}
  {#if trakingPackages.length < 1 }
    <Row>
        <Cell colspan="3">No recent packages delivered using your smartID</Cell>
    </Row>
  {/if}
  </Body>
</DataTable>