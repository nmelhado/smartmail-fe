<script>
	import { goto } from '@sapper/app';
	import { trackPackage, getTrackingLink } from '../../routes/utils/helper.js';
  import DataTable, {Head, Body, Row, Cell, Pagination} from '@smui/data-table';
  import { Graphic } from '@smui/list';
  import IconButton from '@smui/icon-button';
  import { createEventDispatcher } from 'svelte';

  export let trackingPackages, userSmartId, page, limit, count, lastPage;


  const dispatch = createEventDispatcher();

  let displayMore = {};
  let extraInfo = '';
  let currentRow = null;

  $: for (const userPackage of trackingPackages) {
    displayMore[userPackage.tracking] = false;
  }

  async function toggleRow(row, mailCarrier) {
    extraInfo = "<tr><td>Loading. . .</td></tr>";
    const currentStatus = displayMore[row];
    displayMore[currentRow] = false;
    displayMore[row] = currentStatus == false;
    currentRow = row;
    const moreInfo = await trackPackage(mailCarrier, row);
    // Create tracking data rows
    createExtraInfo(moreInfo.activity);
    console.log(displayMore);
  }

  function createExtraInfo(activities) {
    let newRows = '';
    if(activities.length == 0) {
      newRows = `
          <tr>
            <td class="extraInfoCell" colSpan="3">No tracking information available</td>
          </tr>
        `;
    }
    for (const activity of activities) {
      if(!activity.Status) {
        newRows = `
          <tr>
            <td class="extraInfoCell" colSpan="3">${activity}</td>
          </tr>
        `;
        break;
      }
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
    goto(`/my_contacts?smartID=${smartmailID}`);
  }

  const changePage = (newPage) => {
    page = newPage;
    dispatch('getPackages');
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

  .orderImage {
    height: 50px;
    vertical-align: middle;
  }

  .nameTable td {
    white-space: pre-wrap;
  }

  a.contactLink {
    color: var(--veryDarkGray);
    text-decoration: none;
  }

  .retailerIconSmall {
    display: none;
  }

  :global(.collapse) {
    margin-right: 0px;
  }

  :global(.trackingCell) {
    padding-left: 0;
    text-align: left;
  }

  :global(.smallWindow) {
    display: none;
  }

  :global(.descHeadingSmall) {
    display: none;
  }

  :global(.descHeadingMedium) {
    display: none;
  }

  :global(table.extraInfoTable) {
    border-collapse: collapse;
  }

  :global(table.extraInfoTable tr) {
    border-bottom: 1px solid #d0d0d0;
  }

  :global(table.extraInfoTable tr:last-child) { 
      border-bottom: none; 
  }

  :global(.extraInfoCell) {
    text-align: left;
    white-space: pre-wrap;
    padding: 0.7em 0.2em;
    max-width: 40px;
  }

  :global(.trackingDescription) {
    white-space: normal;
  }

  :global(.senderRecipient) {
    padding-left: 0;
  }

  :global(.packageImage) {
    padding: 2px 0;
  }

  :global(table.extraInfoTable tr td:first-child) { 
      padding-left: 0.4em; 
  }

  :global(table.extraInfoTable tr td:last-child) { 
      padding-right: 0.4em; 
  }
  
  :global(.trackingRow) {
    cursor: pointer;
  }

  :global(.nameCell) {
    padding-left: 0px;
    padding-right: 0px;
  }

  :global(.extraInfoRow) {
    background-color: #e2e2e2;
    box-shadow: inset 0 8px 8px -2px #ccc;
    padding: 0;
  }

  :global(.outgoing) {
    background-color: rgba(26,200,237,.07);
  }

  :global(.incoming) {
    background-color: rgba(26,237,200,.07);
  }

  :gobal(.expandRow) {
    text-align:center;
    padding-right: 4px;
    padding-left: 4px;
  }

  @media (max-width: 990px) {
    .retailerIcon {
      display: inline-block;
    }
    .personalName {
      display: inline-block;
    }
    .retailerIconSmall {
      display: none;
    }
  }

  @media (max-width: 660px) {
    .retailerIcon {
      display: none;
    }
    .personalName {
      display: none;
    }
    .retailerIconSmall {
      display: inline-block;
    }
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
    :global(.trackingCell) {
      padding-right: 0;
      text-align: left;
    }
    :global(.mailHeadingLarge) {
      display: none;
    }
  }

  @media (max-width: 460px) {
    :global(.expandRow) {
      padding: 0;
    }
    :global(.trackingDescription) {
      padding: 0;
    }
    :global(.descHeadingMedium) {
      display: table-cell;
    }
  }

  @media (max-width: 545px) {
    :global(.packageImage) {
      display: none;
    }
    :global(.descHeadingSmall) {
      display: none;
    }
    :global(.descHeadingMedium) {
      display: table-cell;
    }
    :global(.descHeadingLarge) {
      display: none;
    }
    :global(.smallWindow) {
      display: table-cell;
    }
    :global(.largeWindow) {
      display: none;
    }
  }
</style>

<DataTable table$aria-label="Packages" table$style="width: 100%;" style="width:100%;">
  <Head>
    <Row>
      <Cell class="descHeadingLarge" colspan="4">Description</Cell>
      <Cell class="descHeadingMedium" colspan="3">Description</Cell>
      <Cell class="descHeadingSmall" colspan="2">Description</Cell>
    </Row>
  </Head>
  <Body>
  {#each trackingPackages as trackingPackage}
    {#if trackingPackage.sender.smart_id == userSmartId}
      <!-- Outgoing Package -->
      <Row class="trackingRow outgoing" on:click={() => toggleRow(trackingPackage.tracking, trackingPackage.mail_carrier)}>
        {#if displayMore[trackingPackage.tracking]}
          <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_less</Graphic></Cell>
        {:else}
          <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_more</Graphic></Cell>
        {/if}
        {#if trackingPackage.recipient.smart_id}
          {#if trackingPackage.recipient.role == "retailer"}
            <Cell class="senderRecipient contactCell"><a on:click|stopPropagation target="{trackingPackage.recipient.redirect_url && trackingPackage.recipient.redirect_url != "" ? "_blank" : "self"}" class="contactLink" href="{trackingPackage.package_description.order_link && trackingPackage.package_description.order_link != "" ? trackingPackage.package_description.order_link : (trackingPackage.recipient.redirect_url && trackingPackage.recipient.redirect_url != "" ? trackingPackage.recipient.redirect_url : `addresses?smartID=${trackingPackage.recipient.smart_id}`)}"><img class="retailerIcon" src={trackingPackage.recipient.large_logo} alt="{trackingPackage.recipient.name} logo"/><img class="retailerIconSmall" src={trackingPackage.recipient.small_logo} alt="{trackingPackage.recipient.name} logo"/></a></Cell>
          {:else}
            <Cell class="senderRecipient contactCell"><a on:click|stopPropagation|preventDefault={() => goToContact(trackingPackage.recipient.smart_id)} class="contactLink" href="addresses?smartID={trackingPackage.recipient.smart_id}"><img class="personalIcon" src="/personal_icon.png" alt="person icon"/><span class="personalName">{trackingPackage.recipient.name}</span></a></Cell>
          {/if}
        {:else}
          <Cell class="senderRecipient contactCell">To Non-Smartmail recipient</Cell>
        {/if}
        <Cell class="packageImage">
          {#if trackingPackage.package_description.order_image}
            <img class="orderImage" src={trackingPackage.package_description.order_image} alt="order logo"/>
          {:else}
            <img class="orderImage" src="/genericPackage.png" alt="package logo"/>
          {/if}
        </Cell>
        <Cell class="trackingDescription">
          {trackingPackage.package_description.contents && trackingPackage.package_description.contents != "" ? trackingPackage.package_description.contents : trackingPackage.tracking}
        </Cell>
      </Row>
    {:else}
      <!-- Incoming Package -->
      <Row class="trackingRow incoming" on:click={() => toggleRow(trackingPackage.tracking, trackingPackage.mail_carrier)}>
        {#if displayMore[trackingPackage.tracking]}
          <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_less</Graphic></Cell>
        {:else}
          <Cell class="expandRow"><Graphic class="material-icons collapse">unfold_more</Graphic></Cell>
        {/if}
        {#if trackingPackage.sender.smart_id}
          {#if trackingPackage.sender.role == "retailer"}
            <Cell class="senderRecipient contactCell"><a on:click|stopPropagation target="{trackingPackage.sender.redirect_url && trackingPackage.sender.redirect_url != "" ? "_blank" : "self"}" class="contactLink" href="{trackingPackage.package_description.order_link && trackingPackage.package_description.order_link != "" ? trackingPackage.package_description.order_link : (trackingPackage.sender.redirect_url && trackingPackage.sender.redirect_url != "" ? trackingPackage.sender.redirect_url : `addresses?smartID=${trackingPackage.sender.smart_id}`)}"><img class="retailerIcon" src={trackingPackage.sender.large_logo} alt="{trackingPackage.sender.name} logo"/><img class="retailerIconSmall" src={trackingPackage.sender.small_logo} alt="{trackingPackage.sender.name} logo"/></a></Cell>
          {:else}
            <Cell class="senderRecipient contactCell"><a on:click|stopPropagation|preventDefault={() => goToContact(trackingPackage.sender.smart_id)} class="contactLink" href="addresses?smartID={trackingPackage.sender.smart_id}"><img class="personalIcon" src="/personal_icon.png" alt="person icon"/><span class="personalName">{trackingPackage.sender.name}</span></a></Cell>
          {/if}
        {:else}
          <Cell class="senderRecipient contactCell">From Non-Smartmail recipient</Cell>
        {/if}
        <Cell class="packageImage">
          {#if trackingPackage.package_description.order_image}
            <img class="orderImage" src={trackingPackage.package_description.order_image} alt="order logo"/>
          {:else}
            <img class="orderImage" src="/genericPackage.png" alt="package logo"/>
          {/if}
        </Cell>
        <Cell class="trackingDescription">
          {trackingPackage.package_description.contents && trackingPackage.package_description.contents != "" ? trackingPackage.package_description.contents : trackingPackage.tracking}
        </Cell>
      </Row>
    {/if}
    <!-- More Tracking Info -->
    {#if displayMore[trackingPackage.tracking]}
      <tr class="nameRow">
        <Cell colspan="4" class="nameCell largeWindow"> <!-- shown for larger screens -->
          <table class="nameTable">
            <tr>
              <td class="trackingCell">Mail Carrier: <img class="mailCarrierIcon" src="mailCarriers/{trackingPackage.mail_carrier.toLowerCase()}.png" alt="{trackingPackage.mail_carrier.toLowerCase()}"/><img class="mailCarrierIconSmall" src="mailCarriers/{trackingPackage.mail_carrier.toLowerCase()}_small.png" alt="{trackingPackage.mail_carrier.toLowerCase()}"/></td>
              <td>Tracking #:&nbsp;&nbsp;&nbsp;<a target="_blak" href="{getTrackingLink(trackingPackage.mail_carrier, trackingPackage.tracking)}" class="trackingLink">{trackingPackage.tracking}</a></td>
            </tr>
          </table>
        </Cell>
        <Cell colspan="3" class="nameCell smallWindow"> <!-- shown for smaller screens -->
          <table class="nameTable">
            <tr>
              <td class="trackingCell">Mail Carrier: <img class="mailCarrierIcon" src="mailCarriers/{trackingPackage.mail_carrier.toLowerCase()}.png" alt="{trackingPackage.mail_carrier.toLowerCase()}"/><img class="mailCarrierIconSmall" src="mailCarriers/{trackingPackage.mail_carrier.toLowerCase()}_small.png" alt="{trackingPackage.mail_carrier.toLowerCase()}"/></td>
              <td>Tracking #:&nbsp;&nbsp;&nbsp;<a target="_blak" href="{getTrackingLink(trackingPackage.mail_carrier, trackingPackage.tracking)}" class="trackingLink">{trackingPackage.tracking}</a></td>
            </tr>
          </table>
        </Cell>
      </tr>
      <Row>
        <Cell colspan="4" class="extraInfoRow largeWindow"> <!-- shown for larger screens -->
          <table class="extraInfoTable" style="width:100%;">
            {@html extraInfo}
          </table>
        </Cell>
        <Cell colspan="3" class="extraInfoRow smallWindow"> <!-- shown for smaller screens -->
          <table class="extraInfoTable" style="width:100%;">
            {@html extraInfo}
          </table>
        </Cell>
      </Row>
    {/if}
  {/each}
  {#if trackingPackages.length < 1 }
    <Row>
        <Cell colspan="3">No recent packages...</Cell>
    </Row>
  {/if}
  </Body>
  <Pagination slot="paginate">
    <svelte:fragment slot="total">
      {count == 0 ? "" : `${(page -1) * limit + 1}-${page == lastPage ? count : page * limit} of ${count}`}
    </svelte:fragment>

    {#if count > 0 }
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
  {/if}
  </Pagination>
</DataTable>