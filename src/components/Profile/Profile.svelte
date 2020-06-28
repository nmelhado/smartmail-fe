<script>
	import { goto, stores } from '@sapper/app';
	import { post, put, get, standardizeDates, formatPhoneNumber, findTodaysAddress, trackPackage } from '../../routes/utils/helper.js';
  import IconButton, {Icon} from '@smui/icon-button';
  import Button, {Label} from '@smui/button';
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
  import { Graphic } from '@smui/list';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  const { session } = stores();

  let trakingPackages = {};
  let packagesLoading = true;
  let submitErrors = [];
  let displayMore = {};
  let packageDescription = {};
  let extraInfo = '';
  let currentRow = null;

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
          if (moreInfo.status == "Delivered") {
            const dateTime = moreInfo.deliveredOn.split('-');
            const dTime = new Date(dateTime[0].substr(0, 4), dateTime[0].substr(4, 2) - 1, dateTime[0].substr(6, 2), dateTime[1].substr(0, 2), dateTime[1].substr(2, 2), dateTime[1].substr(4, 2));
            await put('api/track/update', {tracking: openPackage.tracking, delivered_on: dTime});
            deliveredPackages.unshift(openPackage);
          } else {
            openPackages.push(openPackage);
          }
        }
      }
      trakingPackages = {openPackages, deliveredPackages};
      if (trakingPackages.openPackages) {
        for (const userPackage of trakingPackages.openPackages) {
          displayMore[userPackage.tracking] = false;
          packageDescription[userPackage.tracking] = {id: userPackage.id, description: userPackage.description};
        }
      }
      if (trakingPackages.deliveredPackages) {
        for (const userPackage of trakingPackages.deliveredPackages) {
          displayMore[userPackage.tracking] = false;
          packageDescription[userPackage.tracking] = {id: userPackage.id, description: userPackage.description};
        }
      }
      packagesLoading= false;
		}
    if (submitErrors != null) {
      console.error(submitErrors);
      
    }
	});

  export let checkConnection;

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const user = $session.user;
  const phone = formatPhoneNumber(user.phone);
  const memberSince = user.created_at.split('-');

  const recentContactLength = 3;

  const recentContacts = [...$session.contacts].sort(function(a, b) {
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

  let currentDate = standardizeDates(new Date())
  let tempHolder = true;
  let resetCalendarCheck = true;

  const todaysAddress = findTodaysAddress(currentDate, $session.addresses);

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
        <tr transition:slide>
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
		const response = await put('api/track/update_description', {id: packageDescription[row].id, description: packageDescription[row].description});

		// TODO handle network errors
		submitErrors = response.error;

    if (submitErrors != null) {
      console.error(submitErrors);
      
    }
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

  .mailCarrierIcon {
    height: 20px;
    vertical-align: middle;
  }
  
  #logOut {
    margin: 0 0 40px;
    text-align: center;
    color: var(--secondaryAccent)
  }

  * :global(.trackingRow) {
    cursor: pointer;
  }

  * :global(.nameRow) {
    background-color: #f0f0f0;
    box-shadow: inset 0 4px 4px -1px #ddd;
  }

  * :global(.nameCell) {
    padding-left: 0px;
    padding-right: 0px;
  }

  * :global(.nameTable) {
    width: 100%;
  }

  * :global(.extraInfoRow) {
    background-color: #e2e2e2;
    box-shadow: inset 0 8px 8px -2px #ccc;
  }

  * :global(.extraInfoCell) {
    text-align: left;
  }

  * :global(.discreetInput) {
    background: none;
    border: none;
    font-family: B612,Roboto,sans-serif;
    color: var(--veryDarkGray);
    padding: 10px;
    padding-left: 6px;
    padding-right: 0;
    max-width: 200px;
  }

  * :global(.discreetInput::placeholder) {
    font-style: italic;
    color: var(--gray);
  }

  * :global(.discreetInput:focus) {
    outline-color: var(--lightGray);
    outline-style: solid;
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
    text-align: left;
  }

  * :global(.trackingCell) {
    padding-left: 0;
  }

  * :global(.smartIDSpacer) {
    margin-right: 0.4em; 
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
     <a href="/account"  on:click|preventDefault={myAccount} class="linkedHeader"><h4>Current Address:</h4></a><br />
    <div id="addressInfo">
      {#if todaysAddress != null}
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
      {/if}
    </div>
    <p class="lowerLink" id="manageAdresses">
      <a href="/account"  on:click|preventDefault={myAccount}>Click here to manage your addresses<br>or view your upcoming address schedule</a>
    </p>
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
          <Cell class="phoneCell">Phone</Cell>
        </Row>
      </Head>
      <Body>
        {#each recentContacts as contact}
          <Row>
            <Cell>{contact.name}</Cell>
            <Cell><span class="smartIDSpacer">{contact.smart_id.substring(0, 4)}</span>{contact.smart_id.substring(4)}</Cell>
            <Cell class="emailCell"><a href="mailto:{contact.email}" target="_top">{contact.email}</a></Cell>
            <Cell class="phoneCell"><a href="tel:{contact.phone}">{formatPhoneNumber(contact.phone)}</a></Cell>
          </Row>
        {/each}
      </Body>
    </DataTable>
    <p class="lowerLink" id="manageAdresses">
      <a href="/addresses"  on:click|preventDefault={addressBook}>View Your Address Book</a>
    </p>

    <!-- Recent Packages -->
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
          <DataTable table$aria-label="Packages" table$style="width: 100%;" style="width:100%;">
            <Head>
              <Row>
                <Cell>Description</Cell>
                <Cell>Mail Carrier</Cell>
                <Cell>Tracking</Cell>
              </Row>
            </Head>
            <Body>
            {#each trakingPackages.openPackages as trakingPackage}
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
                <Cell class="trackingCell">{trakingPackage.mail_carrier}</Cell>
                <Cell class="trackingCell">{trakingPackage.tracking}</Cell>
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
                    </table>
                  </Cell>
                </tr>
                <Row>
                  <Cell colspan="4" class="extraInfoRow">
                    <table style="width:100%;">
                      {@html extraInfo}
                    </table>
                  </Cell>
                </Row>
              {/if}
            {/each}
            {#if trakingPackages.openPackages.length < 1 }
              <Row>
                  <Cell colspan="3">No open packages deliveries sent to your smartID</Cell>
              </Row>
            {/if}
          </Body>
        </DataTable>
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
          <DataTable table$aria-label="Packages" table$style="width: 100%;" style="width:100%;">
            <Head>
              <Row>
                <Cell colspan="2">Description</Cell>
                <Cell>Mail Carrier</Cell>
                <Cell>Tracking</Cell>
              </Row>
            </Head>
            <Body>
            {#each trakingPackages.deliveredPackages as trakingPackage}
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
                <Cell class="trackingCell"><img class="mailCarrierIcon" src="mailCarriers/{trakingPackage.mail_carrier.toLowerCase()}.png" alt="{trakingPackage.mail_carrier.toLowerCase()}"/></Cell>
                <Cell class="trackingCell">{trakingPackage.tracking}</Cell>
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
                    </table>
                  </Cell>
                </tr>
                <Row>
                  <Cell colspan="4" class="extraInfoRow">
                    <table style="width:100%;">
                      {@html extraInfo}
                    </table>
                  </Cell>
                </Row>
              {/if}
            {/each}
            {#if trakingPackages.deliveredPackages.length < 1 }
              <Row>
                  <Cell colspan="3">No recent packages delivered using your smartID</Cell>
              </Row>
            {/if}
          </Body>
        </DataTable>
      {/if}
    <p class="lowerLink">
      <a href="/tracking"  on:click|preventDefault={addressBook}>View Your Recent Packages</a>
    </p>
  </div>
</div>