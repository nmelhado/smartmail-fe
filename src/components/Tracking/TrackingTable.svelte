<script>
	import { goto, stores } from '@sapper/app';
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

	function goToContact(smartmailID) {
    goto(`/addresses?smartID=${smartmailID}`);
  }

  console.log(trakingPackages[0])
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

  .retailerIcon {
    height: 20px;
    vertical-align: middle;
  }

  .retailerIconSmall {
    height: 18px;
    vertical-align: middle;
  }

  .personalIcon {
    height: 19px;
    vertical-align: sub;
    padding: 0 0.4em;
  }

  @media (min-width: 500px) {
    .mailCarrierIconSmall {
      display: none;
    }
    .retailerIconSmall {
      display: none;
    }
  }

  @media (max-width: 394px) {
    .mailCarrierIconSmall {
      display: none;
    }
    .retailerIconSmall {
      display: none;
    }
    .personalIcon {
      display: none;
    }
  }

  @media (max-width: 499px) {
    .mailCarrierIcon {
      display: none;
    }
    .retailerIcon {
      display: none;
    }
  }

  .smartIDSpacer {
    margin-right: 0.4em; 
  }

  .nameTable td {
    white-space: pre-wrap;
  }

  a.contactLink {
    color: var(--veryDarkGray);
    text-decoration: none;
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
      <Cell class="descHeadingLarge" colspan="3">Description</Cell>
      <Cell class="descHeadingSmall" colspan="2">Description</Cell>
    </Row>
  </Head>
  <Body>
  {#each trakingPackages as trakingPackage}
    {#if trakingPackage.sender.smart_id == user.smart_id}
      <!-- Outgoing Package -->
      <Row class="trackingRow outgoing" on:click={() => toggleRow(trakingPackage.tracking, trakingPackage.mail_carrier)}>
        {#if displayMore[trakingPackage.tracking]}
          <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_less</Graphic></Cell>
        {:else}
          <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_more</Graphic></Cell>
        {/if}
        {#if trakingPackage.recipient.smart_id}
          {#if trakingPackage.recipient.role == "retailer"}
            <Cell class="centeredTrackingCell"><a on:click|stopPropagation target="{trakingPackage.recipient.redirect_url && trakingPackage.recipient.redirect_url != "" ? "_blank" : "self"}" class="contactLink" href="{trakingPackage.package_description.order_link && trakingPackage.package_description.order_link != "" ? trakingPackage.package_description.order_link : (trakingPackage.recipient.redirect_url && trakingPackage.recipient.redirect_url != "" ? trakingPackage.recipient.redirect_url : `addresses?smartID=${trakingPackage.recipient.smart_id}`)}"><img class="retailerIcon" src={trakingPackage.recipient.large_logo} alt="{trakingPackage.recipient.name} logo"/><img class="retailerIconSmall" src={trakingPackage.recipient.small_logo} alt="{trakingPackage.recipient.name} logo"/></a></Cell>
          {:else}
            <Cell class="centeredTrackingCell"><a on:click|stopPropagation|preventDefault={() => goToContact(trakingPackage.recipient.smart_id)} class="contactLink" href="addresses?smartID={trakingPackage.recipient.smart_id}"><img class="personalIcon" src="/personal_icon.png" alt="{trakingPackage.recipient.name} logo"/>{trakingPackage.recipient.name}</a></Cell>
          {/if}
        {:else}
          <Cell class="centeredTrackingCell">To Non-Smartmail recipient</Cell>
        {/if}
        <Cell class="trackingCell">{trakingPackage.package_description.contents && trakingPackage.package_description.contents != "" ? trakingPackage.package_description.contents : trakingPackage.tracking}</Cell>
      </Row>
    {:else}
      <!-- Incoming Package -->
      <Row class="trackingRow incoming" on:click={() => toggleRow(trakingPackage.tracking, trakingPackage.mail_carrier)}>
        {#if displayMore[trakingPackage.tracking]}
          <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_less</Graphic></Cell>
        {:else}
          <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_more</Graphic></Cell>
        {/if}

        {#if trakingPackage.sender.role == "retailer"}
          <Cell class="centeredTrackingCell"><a on:click|stopPropagation target="{trakingPackage.sender.redirect_url && trakingPackage.sender.redirect_url != "" ? "_blank" : "self"}" class="contactLink" href="{trakingPackage.package_description.order_link && trakingPackage.package_description.order_link != "" ? trakingPackage.package_description.order_link : (trakingPackage.sender.redirect_url && trakingPackage.sender.redirect_url != "" ? trakingPackage.sender.redirect_url : `addresses?smartID=${trakingPackage.sender.smart_id}`)}"><img class="retailerIcon" src={trakingPackage.sender.large_logo} alt="{trakingPackage.sender.name} logo"/><img class="retailerIconSmall" src={trakingPackage.sender.small_logo} alt="{trakingPackage.sender.name} logo"/></a></Cell>
          <Cell class="trackingCell">{trakingPackage.package_description.contents && trakingPackage.package_description.contents != "" ? trakingPackage.package_description.contents : trakingPackage.tracking}</Cell>
        {:else}
          <Cell class="centeredTrackingCell"><a on:click|stopPropagation|preventDefault={() => goToContact(trakingPackage.sender.smart_id)} class="contactLink" href="addresses?smartID={trakingPackage.sender.smart_id}"><img class="personalIcon" src="/personal_icon.png" alt="{trakingPackage.sender.name} logo"/>{trakingPackage.sender.name}</a></Cell>
          <Cell class="trackingCell">{trakingPackage.tracking}</Cell>
        {/if}
      </Row>
    {/if}
    {#if displayMore[trakingPackage.tracking]}
      <tr class="nameRow">
        <Cell colspan="4" class="nameCell">
          <table class="nameTable">
            <tr>
              <Cell class="trackingCell">Mail Carrier: <img class="mailCarrierIcon" src="mailCarriers/{trakingPackage.mail_carrier.toLowerCase()}.png" alt="{trakingPackage.mail_carrier.toLowerCase()}"/><img class="mailCarrierIconSmall" src="mailCarriers/{trakingPackage.mail_carrier.toLowerCase()}_small.png" alt="{trakingPackage.mail_carrier.toLowerCase()}"/></Cell>
              {#if trakingPackage.sender_smart_id}
                <td>{trakingPackage.sender_name} (<span class="smartIDSpacer">{trakingPackage.sender_smart_id.substring(0, 4)}</span>{trakingPackage.sender_smart_id.substring(4)})</td>
              {:else}
                <td>No sender provided</td>
              {/if}
              {#if trakingPackage.recipient_smart_id}
                <td>{trakingPackage.recipient_name} (<span class="smartIDSpacer">{trakingPackage.recipient_smart_id.substring(0, 4)}</span>{trakingPackage.recipient_smart_id.substring(4)})</td>
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