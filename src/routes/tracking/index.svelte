<script>
	import { goto, stores } from '@sapper/app';
	import { post, put, get, standardizeDates, formatPhoneNumber, findTodaysAddress, trackPackage } from '../../routes/utils/helper.js';
	import TrackingTable from '../../components/Tracking/TrackingTable.svelte'; 
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
  import Textfield from '@smui/textfield'
  import Button, {Icon as ButtonIcon} from '@smui/button';
  import Fab, {Icon} from '@smui/fab';
  import { onMount } from 'svelte';

  const { session } = stores();
  const user = $session.user;

  let openPackages = [];
  let deliveredPackages = [];
  let pageLoading = true;
  let submitErrors = [];
  let openPage = 1;
  let deliveredPage = 1;
  let openCount = 0;
  let deliveredCount = 0;
  let search = "";
  const limit = 10;

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

	onMount(async () => {
    try {
      // first check if there are any updates to open packages
      const response = await get('api/track/check_open_packages');

      // TODO handle network errors
      submitErrors = response.error;

      if (response.success) {
        if (response.open_packages) {
          const openPackages = [];
          for (const openPackage of response.open_packages) {
            const moreInfo = await trackPackage(openPackage.mail_carrier, openPackage.tracking);
            if (moreInfo.status == "Delivered" || (!openPackage.estimated_delivery && moreInfo.estimatedDelivery)) {
              const dateTime = moreInfo.deliveredOn ? moreInfo.deliveredOn.split('-') : null;
              const estimatedDateTime = moreInfo.estimatedDelivery ? moreInfo.estimatedDelivery.split('-') : null;
              const dTime = dateTime ? new Date(dateTime[0].substr(0, 4), dateTime[0].substr(4, 2) - 1, dateTime[0].substr(6, 2), dateTime[1].substr(0, 2), dateTime[1].substr(2, 2), dateTime[1].substr(4, 2)) : null;
              const eTime = estimatedDateTime ? new Date(estimatedDateTime[0].substr(0, 4), estimatedDateTime[0].substr(4, 2) - 1, estimatedDateTime[0].substr(6, 2), estimatedDateTime[1].substr(0, 2), estimatedDateTime[1].substr(2, 2), estimatedDateTime[1].substr(4, 2)) : null;
              await put('api/track/update', {tracking: openPackage.tracking, delivered_on: dTime, estimated_delivery: eTime});
            }
          }
        }
        // now pull in open packages
        getOpenPackages();
        
        // now pull in delivered packages packages
        getDeliveredPackages();
      }
      if (submitErrors != null) {
        console.error(submitErrors);
      }

    } catch(err) {
      console.error(err);
    }

    pageLoading= false;
  });
  
  async function getOpenPackages(newSearch = false) {
    // if this is a new search, reset back to the first page
    if (newSearch) {
      openPage = 1;
    }
    search = search.trim();
    // now pull in delivered packages
    try {
      const response = await get(`api/track/get_packages?type=open&limit=${limit}&page=${openPage}&search=${search}`);
      
      // TODO handle network errors
      submitErrors = response.error;

      if (response.success) {
        openPackages  = response.packages ? response.packages : [];
        openCount = response.count;
      }
    } catch(err) {
      console.error(err);
    }
  }
  
  async function getDeliveredPackages(newSearch = false) {
    console.log(`HERE 3! page: ${newSearch}`)
    // if this is a new search, reset back to the first page
    if (newSearch) {
      deliveredPage = 1;
    }
    console.log(`HERE 4! page: ${deliveredPage}`)
    search = search.trim();
    // now pull in delivered packages
    try {
      const response = await get(`api/track/get_packages?type=delivered&limit=${limit}&page=${deliveredPage}&search=${search}`);
      console.log(response);
      // TODO handle network errors
      submitErrors = response.error;

      if (response.success) {
        deliveredPackages = response.packages ? response.packages : [];
        deliveredCount = response.count;
      }
    } catch(err) {
      console.error(err);
    }
  }

  function searchPackages() {
    getOpenPackages(true);
    getDeliveredPackages(true);
  }

	function myAccount() {
    goto('/account');
  }

	function addressBook() {
    goto('/addresses');
  }
</script>

<svelte:head>
  <title>smartmail - {user.first_name ? user.first_name : ""}'s Package Tracking</title>
</svelte:head>

<style>
  #searchBar {
    text-align: center;
  }

  form {
    display: inline-flex;
    position: relative;
    justify-content: space-around;
  }

  h4 {
    text-align: center;
    font-size: 1.4em;
    color: var(--darkGray);
    font-weight: 700;
    margin: 1.8em 1em 1.6em;
  }

  /* Styling for global Tracking Table classes */

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

  * :global(.descHeadingMedium) {
    display: none;
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

  * :global(.trackingDescription) {
    white-space: normal;
  }

  * :global(.senderRecipient) {
    padding-left: 0;
  }

  * :global(.packageImage) {
    padding: 2px 0;
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

  @media (max-width: 499px) {
    * :global(.trackingCell) {
      padding-right: 0;
      text-align: left;
    }
    * :global(.mailHeadingLarge) {
      display: none;
    }
  }

  @media (max-width: 460px) {
    * :global(.expandRow) {
      display: none;
    }
    * :global(.descHeadingSmall) {
      display: table-cell;
    }
    * :global(.descHeadingMedium) {
      display: none;
    }
    * :global(.mailHeadingLarge) {
      display: none;
    }
  }

  @media (max-width: 545px) {
    * :global(.packageImage) {
      display: none;
    }
    * :global(.descHeadingSmall) {
      display: none;
    }
    * :global(.descHeadingMedium) {
      display: table-cell;
    }
    * :global(.descHeadingLarge) {
      display: none;
    }
  }
</style>

<div id="searchBar">
  <form on:submit|preventDefault={searchPackages}>
    <Textfield variant="outlined" bind:value={search} label="Search for a package. . ." />
    <Button variant="outlined" color="secondary" style="text-align: center; margin: 10px 0 0 10px;"><ButtonIcon class="material-icons" style="color: var(--darkGray); margin: 0;">search</ButtonIcon></Button>
    {#if search != "" }
      <Fab color="secondary" on:click={() => {search = ""; searchPackages();}} mini style="background-color: #aaa; position: absolute; top: 1.2em; right: 85px; width: 20px; height: 20px;"><Icon class="material-icons" style="color: var(--white); font-size: 1.3em; margin: -2px;">close</Icon></Fab>
    {/if}
  </form>
</div>


<!-- Recent Open Packages -->
<h4>Recent Open Deliveries</h4>
  {#if pageLoading }
    <DataTable table$aria-label="Packages" table$style="width: 100%;">
      <Head>
        <Row>
          <Cell>Description</Cell>
        </Row>
      </Head>
      <Body>
      </Body>
    </DataTable>
    <p class="loading>">Loading. . .</p>
  {:else}
    <TrackingTable trackingPackages={openPackages} userSmartId={user.smart_id} bind:page={openPage} bind:count={openCount} {limit} on:getPackages={() => getOpenPackages(false)} mobile={$session.mobile} />
  {/if}

<!-- Recently Delivered Packages -->
<h4>Recently Delivered Packages</h4>
  {#if pageLoading }
    <DataTable table$aria-label="Packages" table$style="width: 100%;">
      <Head>
        <Row>
          <Cell>Description</Cell>
        </Row>
      </Head>
      <Body>
      </Body>
    </DataTable>
    <p class="loading>">Loading. . .</p>
  {:else}
    <TrackingTable trackingPackages={deliveredPackages} userSmartId={user.smart_id} bind:page={deliveredPage} bind:count={deliveredCount} {limit} on:getPackages={() => getDeliveredPackages(false)} mobile={$session.mobile} />
  {/if}
