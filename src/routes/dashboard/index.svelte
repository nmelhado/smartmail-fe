<script>
	import { goto, stores } from '@sapper/app';
	import { post, put, get, standardizeDates, formatPhoneNumber, findTodaysAddress, trackPackage } from '../../routes/utils/helper.js';
	import TrackingTableWidget from '../../components/Tracking/TrackingTableWidget.svelte'; 
	import CopyToClipboard from '../../components/CopyToClipboard.svelte'; 
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
  import IconButton from '@smui/icon-button';
  import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

  const { session } = stores();

  let trackingPackages = {};
  let pageLoading = true;
  let submitErrors = [];
  let recentContacts = [];

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
      const response = await get(`api/manage/get_contacts?limit=3&page=1&sort=recent`);
      if (response.contacts) {
        recentContacts = response.contacts;
      }
    } catch(err) {
      console.error(err);
    }

    try {
      const response = await get('api/track/preview_packages/');

      // TODO handle network errors
      submitErrors = response.error;

      if (response.success) {
        const openPackages = [];
        const deliveredPackages = response.delivered_packages ? response.delivered_packages : [];
        if (response.open_packages) {
          for (const openPackage of response.open_packages) {
            const moreInfo = await trackPackage(openPackage.mail_carrier, openPackage.tracking);
            if (moreInfo.status == "Delivered" || (!openPackage.estimated_delivery && moreInfo.estimatedDelivery)) {
              const dateTime = moreInfo.deliveredOn ? moreInfo.deliveredOn.split('-') : null;
              const estimatedDateTime = moreInfo.estimatedDelivery ? moreInfo.estimatedDelivery.split('-') : null;
              const dTime = dateTime ? new Date(dateTime[0].substr(0, 4), dateTime[0].substr(4, 2) - 1, dateTime[0].substr(6, 2), dateTime[1].substr(0, 2), dateTime[1].substr(2, 2), dateTime[1].substr(4, 2)) : null;
              const eTime = estimatedDateTime ? new Date(estimatedDateTime[0].substr(0, 4), estimatedDateTime[0].substr(4, 2) - 1, estimatedDateTime[0].substr(6, 2), estimatedDateTime[1].substr(0, 2), estimatedDateTime[1].substr(2, 2), estimatedDateTime[1].substr(4, 2)) : null;
              await put('api/track/update', {tracking: openPackage.tracking, delivered_on: dTime, estimated_delivery: eTime});
              if (moreInfo.status == "Delivered") {
                deliveredPackages.unshift(openPackage);
              }
            } else {
              openPackages.push(openPackage);
            }
          }
        }
        openPackages.length = openPackages.length > 5 ? 5 : openPackages.length;
        deliveredPackages.length = deliveredPackages.length > 5 ? 5 : deliveredPackages.length;
        trackingPackages = {openPackages, deliveredPackages};
      }
      if (submitErrors != null) {
        console.error(submitErrors);
      }
    } catch(err) {
      console.error(err);
    }
    pageLoading= false;
	});

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const user = $session.user;
  const phone = formatPhoneNumber(user.phone);
  const memberSince = user.created_at.split('-');

  let currentDate = standardizeDates(new Date())
  let tempHolder = true;
  let resetCalendarCheck = true;

  let todaysAddress = null;
  if ($session.addresses) {
    todaysAddress = findTodaysAddress(currentDate, $session.addresses);
  }

	async function logout(event) {
		await post(`api/auth/logout`);
    $session.user = null;
    $session.addresses = null;
    $session.contacts = null;
    goto('/');
  }

	function myAccount() {
    goto('/account');
  }

	function addressBook() {
    goto('/addresses');
  }

	function tracking() {
    goto('/tracking');
  }

  let copySuccess = false, copyFail = false;

  function handleCopySuccess() {
    copySuccess = true;
    setTimeout(function (){copySuccess = false}, 4000);
  }

  function handleCopyFail() {
    copyFail = true;
    setTimeout(function (){copyFail = false}, 6000);
  }
</script>

<svelte:head>
  <title>smartmail - {user.first_name ? user.first_name : ""}'s Dashboard</title>
</svelte:head>

<style>
  h2 {
    color: var(--veryDarkGray);
    margin: 1em 0 0.1em;
    font-size: 1.8em;
  }

  #dashboardBody {
    position: relative;
  }

  .side {
    display: inline-block;
    width: 49%;
    text-align: center;
    vertical-align: top;
  }

  #avatar {
    width: 256px;
    height: 256px;
  }

  #memberSince {
    margin: 0.1em 0 3em;
    font-style: italic;
    font-size: 0.8em;
    color: var(--darkGray)
  }

  #contactInfo {
      display: inline-block;
      text-align: left;
      font-size: 1.2em;
  }

  #addressInfo {
    display: inline-block;
    text-align: left;
    border: 1px solid var(--lightGray);
    padding: 0.6em 4em;
  }

  #addressInfo p {
    font-size: 1.2em;
  }

  h4 {
    text-align: center;
    font-size: 1.4em;
    color: var(--darkGray);
    font-weight: 700;
    margin: 1.8em 1em 1.6em;
    display: inline-flex;
  }

  a.linkedHeader {
    text-decoration: none;
  }

  a.linkedHeader:hover {
    color: var(--veryDarkGray);
    text-decoration: underline;
  }

  a.linkedHeader:hover h4 {
    color: var(--veryDarkGray);
  }

  h5 {
    font-size: 1.2em;
    color: var(--primary);
    font-weight: 600;
  }

  .primary {
    color: var(--primaryAccent);
  }

  .secondary {
    color: var(--primary);
  }
  
  #logOut {
    margin: 0 0 40px;
    text-align: center;
    color: var(--secondaryAccent)
  }

  .smartIDSpacer {
    margin-right: 0.4em; 
  }

  /* Adjust for smaller screens and phones */

  @media (max-width: 990px) {
    .side {
      width: 100%;
    }
  }


  /* For copy to clipboard */
  * :global(.material-icons) {
    vertical-align: sub;
  }

  * :global(.copy) {
    color: var(--gray);
  }

  * :global(.success) {
    color: var(--primary);
  }

  * :global(.fail) {
    color: #a57171;
  }

  .copyFail {
    color: #a57171;
    border: 1px solid #a57171;
    padding: 10px 30px;
    display: inline-block;
    max-width: 320px;
  }

  .copySuccess {
    color: var(--primary);
    border: 1px solid var(--primary);
    padding: 10px 30px;
    display: inline-block;
    max-width: 320px;
  }

  /* For Tracking Component */

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
      padding: 0;
    }
    * :global(.trackingDescription) {
      padding: 0;
    }
    * :global(.descHeadingMedium) {
      display: table-cell;
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
    #avatar {
      width: 160px;
      height: 160px;
    }
  }
</style>

<p id="logOut"class="text-xs-center">
  <a href="/"  on:click|preventDefault={logout}>Not {user.first_name}? Log out</a>
</p>
<div id="dashboardBody">
  <!-- Left side panel -->
  <div class="side">
    <img id="avatar" alt="dashboard image" src="https://ui-avatars.com/api/?background=1be7ff&color=fff&size=512&length=1&rounded=true&bold=true&font-size=0.6&name={user.first_name}" />
    <h2 id="name">{user.first_name} {user.last_name}</h2>
    <p id="memberSince">Member since {monthNames[memberSince[1]-1]} '{memberSince[0].substr(2)}</p>
    <table id="contactInfo">
      <tr id="smartID">
        <td>smartID:&nbsp;&nbsp;&nbsp;</td>
        <td>
          {#if !copySuccess && !copyFail}
            <CopyToClipboard text={user.smart_id} on:copy={handleCopySuccess} on:fail={handleCopyFail} />
          {/if}
          {#if copySuccess}
            <strong><span class="smartIDSpacer">{user.smart_id.substring(0, 4)}</span>{user.smart_id.substring(4)}</strong>
            <IconButton class="material-icons success" disabled>check_circle</IconButton>
          {/if}
          {#if copyFail}
            <strong><span class="smartIDSpacer">{user.smart_id.substring(0, 4)}</span>{user.smart_id.substring(4)}</strong>
            <IconButton class="material-icons fail" disabled>cancel</IconButton>
          {/if}
        </td>
      </tr>
      <tr>
        <td>email:&nbsp;&nbsp;&nbsp;</td><td>{user.email}</td>
      </tr>
      <tr>
        <td>phone:&nbsp;&nbsp;&nbsp;</td><td>{phone}</td>
      </tr>
    </table>
    {#if copyFail}
      <p transition:slide="{{ duration: 800 }}" class="copyFail">We were unable to copy you smartID to your clipboard. Please copy it manually.</p>
    {/if}
    {#if copySuccess}
      <p transition:slide="{{ duration: 800 }}" class="copySuccess">Your smartID was copied to your clipboard!</p>
    {/if}
    <br />
    {#if todaysAddress != null}
      <a href="/account"  on:click|preventDefault={myAccount} class="linkedHeader"><h4>Current Address:</h4></a><br />
      <div id="addressInfo">
        <h5 class="{todaysAddress.address_type == "permanent" ? "primary" : "secondary"}">{todaysAddress.nickname ? todaysAddress.nickname : todaysAddress.address_type == "permanent" ? "Permanent Address" : "Temporary Address"}</h5>
        <p>
          {#if todaysAddress.attention_to}
            Attention to: {todaysAddress.attention_to}<br>
          {/if}
          {#if todaysAddress.business_name}
            {todaysAddress.business_name}<br>
          {/if}
          {todaysAddress.line_one}<br>
          {#if todaysAddress.line_two}
            {todaysAddress.line_two}<br>
          {/if}
          {todaysAddress.city}, {todaysAddress.state}, {todaysAddress.zip_code}<br>
          {todaysAddress.country}<br>
        </p>
      </div>
      <p class="lowerLink" id="manageAdresses">
        <a href="/account"  on:click|preventDefault={myAccount}>Click here to manage your addresses<br>or view your upcoming address schedule</a>
      </p>
    {/if}
  </div>
  <!-- Right side panel -->
  <div class="side">
    <!-- Recent Contacts -->
    <a href="/addresses"  on:click|preventDefault={addressBook} class="linkedHeader"><h4>Recently Added Contacts</h4></a><br />
    <DataTable table$aria-label="Contacts" table$style="width: 100%;">
      <Head>
        <Row>
          <Cell>Name</Cell>
          <Cell>SmartID</Cell>
          <Cell class="emailCell">E-mail</Cell>
          <Cell class="dashboardPhoneCell phoneCell">Phone</Cell>
        </Row>
      </Head>
      <Body>
        {#each recentContacts as contact}
          <Row>
            <Cell>{contact.name}</Cell>
            <Cell><span class="smartIDSpacer">{contact.smart_id.substring(0, 4)}</span>{contact.smart_id.substring(4)}</Cell>
            <Cell class="emailCell"><a href="mailto:{contact.email}" target="_top">{contact.email}</a></Cell>
            <Cell class="dashboardPhoneCell phoneCell"><a href="tel:{contact.phone}">{formatPhoneNumber(contact.phone)}</a></Cell>
          </Row>
        {/each}
      </Body>
    </DataTable>
    <p class="lowerLink" id="manageAdresses">
      <a href="/addresses"  on:click|preventDefault={addressBook}>View Your Address Book</a>
    </p>

    <!-- Recent Open Packages -->
    <a href="/tracking"  on:click|preventDefault={tracking} class="linkedHeader"><h4>Recent Open Deliveries</h4></a><br />
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
        <TrackingTableWidget trackingPackages={trackingPackages.openPackages} userSmartId={user.smart_id} />
      {/if}

    <!-- Recently Delivered Packages -->
    <a href="/tracking"  on:click|preventDefault={tracking} class="linkedHeader"><h4>Recently Delivered Packages</h4></a><br />
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
        <TrackingTableWidget trackingPackages={trackingPackages.deliveredPackages} userSmartId={user.smart_id} />
      {/if}
    <p class="lowerLink">
      <a href="/tracking"  on:click|preventDefault={tracking}>View Your Recent Packages</a>
    </p>
  </div>
</div>