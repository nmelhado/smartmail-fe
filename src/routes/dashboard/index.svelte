<script>
	import { goto, stores } from '@sapper/app';
	import { put, get, standardizeDates, formatPhoneNumber, findTodaysAddress, trackPackage } from '../utils/helper.js';
	import TrackingTableWidget from '../../components/Tracking/TrackingTableWidget.svelte'; 
	import CopyToClipboard from '../../components/CopyToClipboard.svelte'; 
	import UtilityBar from '../../components/UtilityBar.svelte'; 
	import ListErrors from '../../components/ListErrors.svelte';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield/styled'
  import Button, {Label, Icon} from '@smui/button';
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
  import IconButton from '@smui/icon-button';
  import { onMount } from 'svelte';
	import { slide, blur } from 'svelte/transition';

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

  let user = $session.user;
  const phone = formatPhoneNumber(user.phone);
  const memberSince = user.created_at.split('-');

  let currentDate = standardizeDates(new Date())
  let tempHolder = true;
  let resetCalendarCheck = true;

  let todaysAddress = null;
  if ($session.addresses) {
    todaysAddress = findTodaysAddress(currentDate, $session.addresses);
  }

	function myAccount() {
    goto('/account');
  }

	function myAccountSpecific(tab) {
    goto(`/account?tab=${tab}`);
  }

	function contacts() {
    goto('/my_contacts');
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

  // Edit basic info

  let updatingInfo = false;

  function startlUpdate() {
    updatingInfo = true;
  }

  function cancelUpdate() {
    updatingInfo = false;
  }

  let updateInfo = {
    first_name: `${user.first_name}`,
    last_name: `${user.last_name}`,
    email: `${user.email}`,
    phone: `${user.phone}`
  }

  let errors = [];
  let invalid = {
    first_name: false,
    last_name: false,
    email: false,
    phone: false,
  }

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validInfo =yup.object().shape({
    first_name: yup.string().required("Your first name is requires"),
    last_name: yup.string().required("Your last name is requires"),
    email: yup.string().required("Email is required").email("Email is not valid"),
    phone: yup.string()
      .required("Phone number is required")
      .matches(phoneRegExp, "Phone number is not valid")
  });
  
	function verifyBasicInfo(event) {
    updateInfo.phone = updateInfo.phone.replace(/[()\- /]/gi, '')
    validInfo.validate(updateInfo, {abortEarly: false})
    .then(function() {
      submit();
    })
    .catch(function(err) {
      const tempInvalid = {
        first_name: false,
        last_name: false,
        email: false,
        phone: false,
      };
      const tempErrors = [];
      for (const error of err.inner) {
        if (!tempInvalid[error.path]) {
          tempInvalid[error.path] = true;
          tempErrors.push(error.message);
        }
      }
      invalid = tempInvalid;
      errors = tempErrors;
    })
  }

	async function submit() {
		const response = await put(`api/manage/update_info`, { updateInfo });
		// TODO handle network errors
		submitErrors = response.error;

		if (response.user) {
      $session.user = response.user;
      user = response.user;
		}
    if (submitErrors != null) {
      errorsPresent.open();
    }
    cancelUpdate();
  }

  let errorsPresent;
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
    color: var(--veryDarkGray);
  }

  * :global(#smartID) {
    font-size: 1.3em;
    color: var(--primaryAccent);
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

  @media (max-width: 545px) {
    #avatar {
      width: 160px;
      height: 160px;
    }
  }

  :global(.buttonParent) {
    margin-top: 0;
  }

  :global(.buttonLabel) {
    font-size: 1.0em;
  }

  :global(.buttonLabelEdit) {
    color: var(--gray);
  }

  :global(.editButton) {
    color: var(--gray);
  }

  #updateButtons {
    display: flex;
    justify-content: space-around;
  }
</style>

<UtilityBar exclude="dashboard" />

<div id="dashboardBody">
  <!-- Left side panel -->
  <div class="side">
    <img id="avatar" alt="dashboard image" src="https://ui-avatars.com/api/?background=	D9EBE4&color=fff&size=512&length=1&rounded=true&bold=true&font-size=0.6&name={user.first_name}" />
    {#if updatingInfo}
      <h2 in:blur="{{ duration: 400 }}" id="name">
        <Textfield class="formInputs halfWidth" variant="outlined" label="first name" bind:invalid="{invalid["first_name"]}" bind:value={updateInfo.first_name}/>
        <Textfield class="formInputs halfWidth" variant="outlined" label="last name" bind:invalid="{invalid["last_name"]}" bind:value={updateInfo.last_name}/>
      </h2>
    {:else}
      <h2 in:blur="{{ duration: 400 }}" id="name">
        {user.first_name} {user.last_name}
      </h2>
    {/if}
    <p id="memberSince">Member since {monthNames[memberSince[1]-1]} '{memberSince[0].substr(2)}</p>
    <table id="contactInfo">
      <tr id="smartID">
        <td>smartID:&nbsp;</td>
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
        <td>email:&nbsp;&nbsp;&nbsp;</td>
        {#if updatingInfo}
          <td in:blur="{{ duration: 400 }}">
            <Textfield class="formInputs" variant="outlined" label="e-mail" bind:invalid="{invalid["email"]}" bind:value={updateInfo.email}/>
          </td>
        {:else}
          <td in:blur="{{ duration: 400 }}">
            {user.email}
          </td>
        {/if}
      </tr>
      <tr>
        <td>phone:&nbsp;&nbsp;&nbsp;</td>
        {#if updatingInfo}
          <td in:blur="{{ duration: 400 }}">
            <Textfield class="formInputs" variant="outlined" label="e-mail" bind:invalid="{invalid["phone"]}" bind:value={updateInfo.phone}/>
          </td>
        {:else}
          <td in:blur="{{ duration: 400 }}">
            {phone}
          </td>
        {/if}
      </tr>
    </table>
    {#if updatingInfo}
      <ListErrors {errors}/>
      <div in:blur="{{ duration: 400 }}" id="updateButtons">
        <Button color="secondary" class="buttonParent" variant="unelevated" on:click={cancelUpdate}><Label class="buttonLabel">Cancel</Label></Button>
        <form style="display: inline-block" on:submit|preventDefault={verifyBasicInfo}>
          <Button color="secondary" class="buttonParent" variant="unelevated"><Label class="buttonLabel">Update Information</Label></Button>
        </form>
      </div>
    {:else}
      <div in:blur="{{ duration: 400 }}">
        <Button color="secondary" class="buttonParent" on:click={startlUpdate}><Label class="buttonLabel buttonLabelEdit">Edit basic information </Label><Icon class="material-icons editButton">edit</Icon></Button>
      </div>
    {/if}
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
        <a href="/account?tab=address"  on:click|preventDefault={() => myAccountSpecific("address")}>Manage your addresses</a><br />
        <a href="/account?tab=calendar"  on:click|preventDefault={() => myAccountSpecific("calendar")}>Or view your upcoming address schedule</a>
      </p>
    {/if}
  </div>
  <!-- Right side panel -->
  <div class="side">
    <!-- Recent Contacts -->
    <a href="/my_contacts"  on:click|preventDefault={contacts} class="linkedHeader"><h4>Recently Added Contacts</h4></a><br />
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
      <a href="/my_contacts"  on:click|preventDefault={contacts}>View All Contacts</a>
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
      <a href="/tracking"  on:click|preventDefault={tracking}>View All Packages</a>
    </p>
  </div>
</div>