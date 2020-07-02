<script>
	import { goto, stores } from '@sapper/app';
	import { post, put, get, standardizeDates, formatPhoneNumber, findTodaysAddress, trackPackage } from '../../routes/utils/helper.js';
	import TrackingTable from '../../components/Tracking/TrackingTable.svelte'; 
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
  import { onMount } from 'svelte';

  const { session } = stores();

  let trackingPackages = {};
  let packagesLoading = true;
  let submitErrors = [];

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
		const response = await get('api/manage/get_packages/');

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
            await put('api/track/update', {tracking: openPackage.tracking, delivered_on: dTime});
            if (moreInfo.status == "Delivered") {
              deliveredPackages.unshift(openPackage);
            }
          } else {
            openPackages.push(openPackage);
          }
        }
      }
      trackingPackages = {openPackages, deliveredPackages};
      packagesLoading= false;
		}
    if (submitErrors != null) {
      console.error(submitErrors);
    }
	});

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const user = $session.user;
  const phone = formatPhoneNumber(user.phone);
  const memberSince = user.created_at.split('-');

  const recentContactLength = 3;

  let recentContacts = [];
  if ($session.contacts) {
    recentContacts = [...$session.contacts].sort(function(a, b) {
      var addedA = standardizeDates(a.added_on); // standardize date
      var addedB = standardizeDates(b.added_on); // standardize date

      // sort by most recent
      if (addedA < addedB) {
        return 1;
      }
      if (addedA > addedB) {
        return -1;
      }
      // added at the same time
      return 0;
    }).slice(0,recentContactLength);
  }

  let currentDate = standardizeDates(new Date())
  let tempHolder = true;
  let resetCalendarCheck = true;

  let todaysAddress = null;
  if ($session.addresses) {
    todaysAddress = findTodaysAddress(currentDate, $session.addresses);
  }

  function blah () {
    // chackConnection logs a user out if their token has expired
    checkConnection();
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
</script>

<svelte:head>
  <title>smartmail - {user.first_name}'s Profile</title>
</svelte:head>

<style>
  h2 {
    color: var(--veryDarkGray);
    margin: 1em 0 0.1em;
    font-size: 1.8em;
  }

  #profileBody {
    position: relative;
  }

  .side {
    display: inline-block;
    width: 49%;
    text-align: center;
    vertical-align: top;
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

  * :global(table.extraInfoTable tr td:first-child) { 
      padding-left: 0.4em; 
  }

  * :global(table.extraInfoTable tr td:last-child) { 
      padding-right: 0.4em; 
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

  * :global(.descHeadingMedium) {
    display: none;
  }

  * :global(.trackingDescription) {
    white-space: normal;
  }

  @media (max-width: 479px) {
    * :global(.trackingCell) {
      padding-right: 0;
      text-align: left;
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
</style>

<p id="logOut"class="text-xs-center">
  <a href="/"  on:click|preventDefault={logout}>Not {user.first_name}? Log out</a>
</p>
<div id="profileBody">
  <!-- Left side panel -->
  <div class="side">
    <img id="avatar" alt="profile image" width="256px" height="256px" src="https://ui-avatars.com/api/?background=1be7ff&color=fff&size=512&length=1&rounded=true&bold=true&font-size=0.6&name={user.first_name}" />
    <h2 id="name">{user.first_name} {user.last_name}</h2>
    <p id="memberSince">Member since {monthNames[memberSince[1]-1]} '{memberSince[0].substr(2)}</p>
    <table id="contactInfo">
      <tr>
        <td>smartID:&nbsp;&nbsp;&nbsp;</td><td><strong><span class="smartIDSpacer">{user.smart_id.substring(0, 4)}</span>{user.smart_id.substring(4)}</strong></td>
      </tr>
      <tr>
        <td>email:&nbsp;&nbsp;&nbsp;</td><td>{user.email}</td>
      </tr>
      <tr>
        <td>phone:&nbsp;&nbsp;&nbsp;</td><td>{phone}</td>
      </tr>
    </table>
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
          <Cell class="profilePhoneCell phoneCell">Phone</Cell>
        </Row>
      </Head>
      <Body>
        {#each recentContacts as contact}
          <Row>
            <Cell>{contact.name}</Cell>
            <Cell><span class="smartIDSpacer">{contact.smart_id.substring(0, 4)}</span>{contact.smart_id.substring(4)}</Cell>
            <Cell class="emailCell"><a href="mailto:{contact.email}" target="_top">{contact.email}</a></Cell>
            <Cell class="profilePhoneCell phoneCell"><a href="tel:{contact.phone}">{formatPhoneNumber(contact.phone)}</a></Cell>
          </Row>
        {/each}
      </Body>
    </DataTable>
    <p class="lowerLink" id="manageAdresses">
      <a href="/addresses"  on:click|preventDefault={addressBook}>View Your Address Book</a>
    </p>

    <!-- Recent Open Packages -->
    <a href="/tracking"  on:click|preventDefault={addressBook} class="linkedHeader"><h4>Recent Open Deliveries</h4></a><br />
      {#if packagesLoading }
        <DataTable table$aria-label="Packages" table$style="width: 100%;">
          <Head>
            <Row>
              <Cell>Description</Cell>
              <Cell>Mail Carrier</Cell>
              <Cell>Tracking</Cell>
            </Row>
          </Head>
          <Body>
          </Body>
        </DataTable>
        <p class="loading>">Loading. . .</p>
      {:else}
        <TrackingTable trackingPackages={trackingPackages.openPackages} userSmartId={user} />
      {/if}

    <!-- Recently Delivered Pakages -->
    <a href="/tracking"  on:click|preventDefault={addressBook} class="linkedHeader"><h4>Recently Delivered Pakages</h4></a><br />
      {#if packagesLoading }
        <DataTable table$aria-label="Packages" table$style="width: 100%;">
          <Head>
            <Row>
              <Cell>Description</Cell>
              <Cell>Mail Carrier</Cell>
              <Cell>Tracking</Cell>
            </Row>
          </Head>
          <Body>
          </Body>
        </DataTable>
        <p class="loading>">Loading. . .</p>
      {:else}
        <TrackingTable trackingPackages={trackingPackages.deliveredPackages} userSmartId={user} />
      {/if}
    <p class="lowerLink">
      <a href="/tracking"  on:click|preventDefault={addressBook}>View Your Recent Packages</a>
    </p>
  </div>
</div>