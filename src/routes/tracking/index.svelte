<script>
	import { goto, stores } from '@sapper/app';
	import { put, get, trackPackage } from '../utils/helper.js';
	import TrackingTable from '../../components/Tracking/TrackingTable.svelte'; 
	import UtilityBar from '../../components/UtilityBar.svelte'; 
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
  import Textfield from '@smui/textfield';
  import Button, {Icon as ButtonIcon} from '@smui/button';
  import Fab, {Icon} from '@smui/fab';
  import { onMount } from 'svelte';

  let checking = true;
  async function checkConnection() {
    try {
      const response = await get(`api/auth/check-credentials`);
      if (response && !response.ok) {
        delete($session.user);
        delete($session.addresses);
        goto('login');
      } else {
        checking = false;
      }
    } catch(err) {
      console.error(err);
    }
  }
  checkConnection();

  const { session } = stores();
  const user = $session.user;

  let openPackages = [];
  let deliveredPackages = [];
  let pageLoading = true;
  let submitErrors = [];
  let openPage = 1;
  let deliveredPage = 1;
  let openCount = 0;
  let lastOpenPage = 0;
  let deliveredCount = 0;
  let lastDeliveredPage = 0;
  let search = "";
  const limit = 10;

	onMount(async () => {
    try {
      // first check if there are any updates to open packages
      const response = await get('api/track/check_open_packages');

      // TODO handle network errors
      submitErrors = response.error;

      if (response.success) {
        if (response.open_packages) {
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
        lastOpenPage = Math.ceil(openCount/limit)
      }
    } catch(err) {
      console.error(err);
    }
  }
  
  async function getDeliveredPackages(newSearch = false) {
    // if this is a new search, reset back to the first page
    if (newSearch) {
      deliveredPage = 1;
    }
    search = search.trim();
    // now pull in delivered packages
    try {
      const response = await get(`api/track/get_packages?type=delivered&limit=${limit}&page=${deliveredPage}&search=${search}`);
      // TODO handle network errors
      submitErrors = response.error;

      if (response.success) {
        deliveredPackages = response.packages ? response.packages : [];
        deliveredCount = response.count;
        lastDeliveredPage = Math.ceil(deliveredCount/limit)
      }
    } catch(err) {
      console.error(err);
    }
  }

  function searchPackages() {
    getOpenPackages(true);
    getDeliveredPackages(true);
  }
</script>

<svelte:head>
  <title>smartmail - { !checking && user.first_name ? user.first_name : ""}'s Package Tracking</title>
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
</style>

<UtilityBar exclude="tracking" />

<div id="searchBar">
  <form on:submit|preventDefault={searchPackages}>
    <Textfield variant="outlined" bind:value={search} label="Search for a package. . ." />
    <Button touch variant="outlined" color="secondary" style="text-align: center; margin: 10px 0 0 10px;"><ButtonIcon class="material-icons" style="color: var(--darkGray); margin: 0;">search</ButtonIcon></Button>
    {#if search != "" }
      <Fab color="secondary" on:click={() => {search = ""; searchPackages();}} mini style="background-color: #aaa; position: absolute; top: 1.2em; right: 85px; width: 20px; height: 20px;"><Icon class="material-icons" style="color: var(--white); font-size: 1.3em; margin: -2px;">close</Icon></Fab>
    {/if}
  </form>
</div>


<!-- Recent Open Packages -->
<h4>{!pageLoading && openPackages ? `${openCount > 0 ? openCount : "No"} Open Packages` : "Open Packages" }</h4>
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
    <TrackingTable trackingPackages={openPackages} userSmartId={user.smart_id} bind:page={openPage} bind:count={openCount} {limit} bind:lastPage={lastOpenPage} on:getPackages={() => getOpenPackages(false)} />
  {/if}

<!-- Delivered Packages -->
<h4>{!pageLoading && deliveredPackages ? `${deliveredCount > 0 ? deliveredCount : "No"} Delivered Packages` : "Delivered Packages" }</h4>
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
    <TrackingTable trackingPackages={deliveredPackages} userSmartId={user.smart_id} bind:page={deliveredPage} bind:count={deliveredCount} {limit} bind:lastPage={lastDeliveredPage} on:getPackages={() => getDeliveredPackages(false)} />
  {/if}
