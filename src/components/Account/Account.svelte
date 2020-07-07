<script>
	import { goto, stores } from '@sapper/app';
	import { post, standardizeDates, formatPhoneNumber, findTodaysAddress } from '../../routes/utils/helper.js';
	import AddressCard from './AddressCard.svelte'; 
	import Calendar from './Calendar.svelte'; 
	import AddressChange from './AddressChange.svelte'; 
	import Map from './Map.svelte'; 
  import IconButton, {Icon} from '@smui/icon-button';
  import Button, {Label, Group} from '@smui/button';
  import { addressChangeActive, addressStepOneComplete } from '../../routes/utils/stores.js';
	import CopyToClipboard from '../../components/CopyToClipboard.svelte'; 
	import { slide } from 'svelte/transition';

  const { session } = stores();

  export let checkConnection;
  let update = false;

	async function logout(event) {
		await post(`api/auth/logout`);
    $session.user = null;
    $session.addresses = null;
    goto('/');
  }
  
	function dashboard() {
    goto('/dashboard');
  }

	function addresses() {
    goto('/my_contacts');
  }
  
	function tracking() {
    goto('/tracking');
  }
  
  let currentDate = standardizeDates(new Date())
  let resetCalendarCheck = true;

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let now = standardizeDates(new Date());
  let year = now.getFullYear();
  let month = now.getMonth();

  let todaysAddress = null;
  let pinTitle = "";
  let phone = "";
  let currentMonthAddresses = [];
  let items = [];
  if ($session.addresses) {
    todaysAddress = findTodaysAddress(currentDate, $session.addresses);
    pinTitle = todaysAddress.nickname ? todaysAddress.nickname : todaysAddress.line_one;
    phone = formatPhoneNumber(todaysAddress.phone);
    currentMonthAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
    items = currentMonthAddresses.map( address => {
      let endDate = ""
      if (typeof address.end_date != "undefined" && address.end_date != "") {
        endDate = standardizeDates(address.end_date.substring(0,10).replace(/-/g, '\/'))
      }
      return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "permanent" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "permanent")}
    })
  }

  let headerStatement = 'Your mail and packages are currently going to:';

  function processHeaderStatement() {
    if (currentDate.getDate() != now.getDate()
        || currentDate.getMonth() != now.getMonth()
        || currentDate.getFullYear() != now.getFullYear()) {
        if (currentDate < now) {
          headerStatement = `On ${currentDate.toDateString()} your mail and packages were going to:`;
        } else {
          headerStatement = `On ${currentDate.toDateString()} your mail and packages will go to:`;
        }
    } else {
      headerStatement = 'Your mail and packages are currently going to:';
    }
  }

	function processNewMonth() {
    currentMonthAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
    items = currentMonthAddresses.map( address => {
      let endDate = ""
      if (typeof address.end_date != "undefined" && address.end_date != "") {
        endDate = standardizeDates(address.end_date.substring(0,10).replace(/-/g, '\/'))
      }
      return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "permanent" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "permanent")}
    });
    items = items;
	}
	function next(period="month") {
    if (period === "year") {
      year++;
    } else {
      month++;
      if (month == 12) {
        year++;
        month=0;
      }
    }
    if ($session.addresses) {
      processNewMonth();
      const tempAddress = findTodaysAddress(currentDate, $session.addresses);
      if (tempAddress != todaysAddress) {
        todaysAddress = tempAddress;
      }
    }
    update = false;
	}
	function prev(period="month") {
    if (period === "year") {
      year--;
    } else {
      if (month==0) {
        month=11;
        year--;
      } else {
        month--;
      }
    }
    if ($session.addresses) {
      processNewMonth();
      const tempAddress = findTodaysAddress(currentDate, $session.addresses);
      if (tempAddress != todaysAddress) {
        todaysAddress = tempAddress;
      }
    }
    update = false;
	}
	function dayClick(e) {
    currentDate = e.date;
    processHeaderStatement();
    if ($session.addresses) {
      const tempAddress = findTodaysAddress(currentDate, $session.addresses);
      if (tempAddress != todaysAddress) {
        todaysAddress = tempAddress;
      }
    }
    update = false;
  }
  function launchAddressChange() {
    update = false;
    checkConnection();
    $addressChangeActive = true;
  }

  function resetCalendar() {
    resetCalendarCheck = resetCalendarCheck != true;
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
  <title>smartmail - {$session.user.first_name}'s Account</title>
</svelte:head>

<style>
  h1 {
    margin-bottom: 0px;
  }

  h2 {
    color: var(--primaryAccent);
    margin: 0;
    font-size: 1.8em;
  }

  h4 {
    font-size: 1.6em;
    text-align: center;
    color: var(--darkGray);
    margin: 0.5em 0 1em;
  }
  
  #accountButtons {
    margin: 0 0 7px;
    text-align: center;
  }

  #addressBox {
    place-content: center;
    text-align: center;
    display: flex;
    width: 94%;
    margin: 0 auto;
    box-shadow: 0 0 20px 0 var(--lightGray);
    background-color: var(--lightGray);
  }

  .calendar-container {
    min-width: 300px;
    max-width: 500px;
    flex-grow: 3;
    text-align: center;
    border: 1px solid var(--lightGray);
    background-color: white;
  }

  @media (max-width: 1035px) {
    #addressBox {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 856px) {
    .calendar-container {
      max-width: 730px;
    }
  }
  
  .calendar-header {
    width: 100%;
    height: 50px;
  }
  
  .calendar-header-h2 {
    font-size: 28px;
  }

  #button-holder {
    text-align: center;
  }

  /* For copy to clipboard */
  * :global(.material-icons) {
    vertical-align: baseline;
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

  .copyMessage {
    text-align: center;
    margin-bottom: 45px;
  }

  .copyFail {
    color: #a57171;
    border: 1px solid #a57171;
    padding: 10px 30px;
    display: inline-block;
    max-width: 320px;
    margin: 0;
  }

  .copySuccess {
    color: var(--primary);
    border: 1px solid var(--primary);
    padding: 10px 30px;
    display: inline-block;
    max-width: 320px;
    margin: 0;
  }

  .smartIDSpacer {
    margin-right: 0.4em; 
  }
</style>

<h1>Hello {$session.user.first_name}!</h1>

<div id="accountButtons">
  <Group variant="outlined">
    <Button color="secondary" on:click={dashboard} variant="outlined"><Label>Dashboard</Label></Button>
    <Button color="secondary" on:click={addresses} variant="outlined"><Label>My Contacts</Label></Button>
    <Button color="secondary" on:click={tracking} variant="outlined"><Label>Tracking</Label></Button>
    <Button color="secondary" on:click={launchAddressChange} variant="outlined"><Label>Change Address</Label></Button>
    <Button color="secondary" on:click={logout} variant="outlined"><Label>Log Out</Label></Button>
  </Group>
</div>
{#if $addressChangeActive}
  <AddressChange on:resetCalendar={resetCalendar} on:processNewMonth={processNewMonth} />
{/if}
<h2>
  your smartID&trade; is: 
  {#if !copySuccess && !copyFail}
    <CopyToClipboard text={$session.user.smart_id} on:copy={handleCopySuccess} on:fail={handleCopyFail} />
  {/if}
  {#if copySuccess}
    <strong><span class="smartIDSpacer">{$session.user.smart_id.substring(0, 4)}</span>{$session.user.smart_id.substring(4)}</strong>
    <IconButton class="material-icons success" disabled>check_circle</IconButton>
  {/if}
  {#if copyFail}
    <strong><span class="smartIDSpacer">{$session.user.smart_id.substring(0, 4)}</span>{$session.user.smart_id.substring(4)}</strong>
    <IconButton class="material-icons fail" disabled>cancel</IconButton>
  {/if}
</h2>
<div class="copyMessage">
  {#if copyFail}
    <p transition:slide="{{ duration: 800 }}" class="copyFail">We were unable to copy you smartID to your clipboard. Please copy it manually.</p>
  {/if}
  {#if copySuccess}
    <p transition:slide="{{ duration: 800 }}" class="copySuccess">Your smartID was copied to your clipboard!</p>
  {/if}
</div>
<h4>{headerStatement}</h4>
<div id="addressBox">
  {#if !resetCalendarCheck }
    <div class="calendar-container">
      <div class="calendar-header">
        <h2 class="calendar-header-h2">
          <IconButton class="material-icons" on:click={()=>prev("year")}>first_page</IconButton>
          <IconButton class="material-icons" on:click={()=>prev()}>chevron_left</IconButton>
          {monthNames[month]} {year}
          <IconButton class="material-icons" on:click={()=>next()}>chevron_right</IconButton>
          <IconButton class="material-icons" on:click={()=>next("year")}>last_page</IconButton>
        </h2>
      </div>
      <Calendar mobile={$session.mobile} currentDate={currentDate} items={items} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} />
    </div>
  {:else}
    <div class="calendar-container">
      <div class="calendar-header">
        <h2 class="calendar-header-h2">
          <IconButton class="material-icons" on:click={()=>prev("year")}>first_page</IconButton>
          <IconButton class="material-icons" on:click={()=>prev()}>chevron_left</IconButton>
          {monthNames[month]} {year}
          <IconButton class="material-icons" on:click={()=>next()}>chevron_right</IconButton>
          <IconButton class="material-icons" on:click={()=>next("year")}>last_page</IconButton>
        </h2>
      </div>
      <Calendar mobile={$session.mobile} currentDate={currentDate} items={items} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} />
    </div>
  {/if}
  <AddressCard bind:update={update} todaysAddress={todaysAddress} phone={phone} on:resetCalendar={resetCalendar} on:processNewMonth={processNewMonth}/>
  <Map  mobile={$session.mobile} todaysAddress={todaysAddress} pinTitle={pinTitle} />
</div>
<div id="button-holder">
  <Button class="submitButton" variant="unelevated"  on:click={launchAddressChange} ><Label class="submitButtonLabel">Change Address</Label></Button>
</div>