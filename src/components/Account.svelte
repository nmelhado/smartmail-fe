<script>
	import { goto, stores } from '@sapper/app';
	import { post, standardizeDates } from '../routes/utils.js';
	import AddressCard from './AddressCard.svelte'; 
	import Calendar from './Calendar.svelte'; 
	import AddressChange from './AddressChange.svelte'; 
	import Map from './Map.svelte'; 
  import IconButton, {Icon} from '@smui/icon-button';
  import Button, {Label} from '@smui/button';
  import { addressChangeActive, addressStepOneComplete } from '../routes/stores.js';

  const { session } = stores();

  export let checkConnection;
  let update = false;

	async function logout(event) {
		await post(`auth/logout`);
    $session.user = null;
    $session.addresses = null;
    goto('/');
  }
  
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '')
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return null
  }
  let currentDate = standardizeDates(new Date())
  let tempHolder = true;
  let resetCalendarCheck = true;

  const todaysAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= currentDate && (!address.end_date || standardizeDates(address.end_date) >= currentDate));
  let todaysAddress = null;
  if (todaysAddresses.length < 1) {
    tempHolder = false;
    todaysAddress = null;
  }  else {
    todaysAddress = todaysAddresses[0];
    if (todaysAddresses.length > 1) {
      todaysAddress = todaysAddresses.filter( address => address.address_type == "temporary")[0];
    }
  }

  function processTodaysAddresses() {
    const todaysAddresses = $session.addresses.filter( address => { return standardizeDates(address.start_date) <= currentDate && (!address.end_date || standardizeDates(address.end_date) >= currentDate)});
    if (todaysAddresses.length < 1) {
      tempHolder = false;
      todaysAddress = null;
    } else {
      let tempAddress =todaysAddresses[0];
      if (todaysAddresses.length > 1) {
        tempAddress = todaysAddresses.filter( address => address.address_type == "temporary")[0];
      }
      if (tempAddress !=todaysAddress) {
        tempHolder = true;
        todaysAddress = null;
        setTimeout(() => {
          tempHolder = false;
          todaysAddress = tempAddress;
        }, 1)
      }
    }
  }

  const pinTitle = todaysAddress.nickname ? todaysAddress.nickname : todaysAddress.line_one;
  const phone = formatPhoneNumber(todaysAddress.phone)

	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let now = standardizeDates(new Date());
  let year = now.getFullYear();
  let month = now.getMonth();

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

  let currentMonthAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
  let items = currentMonthAddresses.map( address => {
    let endDate = ""
    if (typeof address.end_date != "undefined" && address.end_date != "") {
      endDate = standardizeDates(address.end_date.substring(0,10).replace(/-/g, '\/'))
    }
    return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "permanent" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "permanent")}
  })
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
    processNewMonth();
    processTodaysAddresses();
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
    processNewMonth();
    processTodaysAddresses();
    update = false;
	}
	function dayClick(e) {
    currentDate = e.date;
    processHeaderStatement();
    processTodaysAddresses();
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

</script>

<style>
  h1 {
    margin-bottom: 0px;
  }

  h2 {
    color: var(--primaryAccent);
    margin: 0;
    font-size: 1.8em;
  }

  h3 {
    font-size: 1.8em;
    text-align: center;
    color: var(--darkGray);
  }

  h4 {
    font-size: 1.6em;
    text-align: center;
    color: var(--gray);
    margin: 0.5em 0 1em;
  }
  
  #logOut {
    margin: 0 0 40px;
    text-align: center;
    color: var(--secondaryAccent)
  }

  #addressBox {
    text-align: center;
    display: flex;
    width: 94%;
    margin: 0 auto;
    box-shadow: 0 0 20px 0 var(--lightGray);
  }
  
  .calendar-container {
    min-width: 300px;
    max-width: 500px;
    flex-grow: 3;
    text-align: center;
    border: 1px solid var(--lightGray);
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

  #map-placeholder {
    flex-grow: 3;
    height: 450px;
    min-width: 300px;
    border: 1px solid var(--lightGray);
  }
</style>

<svelte:head>
  <title>smartmail - {$session.user.first_name}'s Account</title>
</svelte:head>

<h1 class="text-xs-center">Hello {$session.user.first_name}!</h1>
<p id="logOut"class="text-xs-center">
  <a href="/"  on:click|preventDefault={logout}>Log out</a>
</p>
{#if $addressChangeActive}
  <AddressChange on:resetCalendar={resetCalendar} on:processNewMonth={processNewMonth} />
{/if}
<h3>HERE IS YOUR ACCOUNT INFORMATION</h3>
<h2>your smartID is: <strong>{$session.user.smart_id.substring(0, 4)}  {$session.user.smart_id.substring(4)}</strong></h2>
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
      <Calendar currentDate={currentDate} items={items} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} />
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
      <Calendar currentDate={currentDate} items={items} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} />
    </div>
  {/if}
  <AddressCard bind:update={update} todaysAddress={todaysAddress} phone={phone} on:resetCalendar={resetCalendar} on:processNewMonth={processNewMonth}/>
  {#if todaysAddress != null}
    <Map todaysAddress={todaysAddress} pinTitle={pinTitle} />
  {:else if tempHolder}
    <div id="map-placeholder" />
  {/if}
</div>
<div id="button-holder">
  <Button class="submitButton" variant="unelevated"  on:click={launchAddressChange} ><Label class="submitButtonLabel">Change Address</Label></Button>
</div>