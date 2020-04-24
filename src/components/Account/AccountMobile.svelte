<script>
	import { goto, stores } from '@sapper/app';
	import { post, standardizeDates, formatPhoneNumber } from '../../routes/utils/helper.js';
	import AddressCard from './AddressCard.svelte'; 
	import Calendar from './Calendar.svelte'; 
	import AddressChange from './AddressChange.svelte'; 
	import Map from './Map.svelte'; 
  import IconButton, {Icon} from '@smui/icon-button';
  import Button, {Label} from '@smui/button';
  import { addressChangeActive, addressStepOneComplete } from '../../routes/utils/stores.js';
  import Tab, {Icon as TabIcon, Label as TabLabel} from '@smui/tab';
  import TabBar from '@smui/tab-bar';

  const { session } = stores();

  export let checkConnection;
  let update = false;

	async function logout(event) {
		await post(`api/auth/logout`);
    $session.user = null;
    $session.addresses = null;
    goto('/');
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
      // resetTabs();
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
          // resetTabs();
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
    console.log(e.date);
    processHeaderStatement();
    processTodaysAddresses();
    update = false;
    console.log(keyedTabsActive.k);
  }
  function launchAddressChange() {
    update = false;
    checkConnection();
    $addressChangeActive = true;
  }

  function resetCalendar() {
    resetCalendarCheck = resetCalendarCheck != true;
  }

  let keyedTabs = [
    {
      k: 1,
      icon: 'list',
      label: 'address'
    },
    {
      k: 2,
      icon: 'map',
      label: 'map'
    },
    {
      k: 3,
      icon: 'calendar_today',
      label: 'calendar'
    },
  ];

  let noMapTab = "";

  function resetTabs() {
    // keyedTabsActive = keyedTabs[0]
    if (todaysAddress != null) {
      noMapTab = "";
    } else {
      noMapTab = "Disabled";
    }
  }

  let keyedTabsActive = keyedTabs[0];
</script>

<svelte:head>
  <title>smartmail - {$session.user.first_name}'s Account</title>
</svelte:head>

<style>
  h1 {
    font-size: 2em;
    margin-bottom: 0px;
  }

  h2 {
    color: var(--primaryAccent);
    margin: 1.5em 0;
    font-size: 1.7em;
  }

  h3 {
    font-size: 1.5em;
    text-align: center;
    color: var(--darkGray);
  }

  h4 {
    font-size: 1.0em;
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
    display: block;
    width: 100%;
    margin-top: -1px;
    border: 1px solid var(--lightGray);
    box-shadow: 0 0 20px 0 var(--lightGray);
  }
  
  .calendar-container {
    width: 100%;
    flex-grow: 3;
    text-align: center;
    border: 1px solid var(--lightGray);
  }
  
  .calendar-header {
    width: 100%;
  }
  
  .calendar-header-h2 {
    font-size: 1.6em;
    margin: 0.3em 0 0;
  }

  #button-holder {
    text-align: center;
  }

  #map-placeholder {
    flex-grow: 3;
    min-width: 300px;
    border: 1px solid var(--lightGray);
  }

  .hidden {
    display: none;
  }
</style>

<h1>Hello {$session.user.first_name}!</h1>
<p id="logOut"class="text-xs-center">
  <a href="/"  on:click|preventDefault={logout}>Log out</a>
</p>
{#if $addressChangeActive}
  <AddressChange on:resetCalendar={resetCalendar} on:processNewMonth={processNewMonth} />
{/if}
<h3>HERE IS YOUR ACCOUNT INFORMATION</h3>
<h2>your smartID&trade; is: <strong><span style="margin-right: 0.4em;">{$session.user.smart_id.substring(0, 4)}</span>{$session.user.smart_id.substring(4)}</strong></h2>
<h4>{headerStatement}</h4>

<TabBar tabs={keyedTabs} let:tab key={tab => tab.k} bind:active={keyedTabsActive}>
  <Tab {tab} stacked={true} class={`${tab.label}${noMapTab}`} indicatorSpanOnlyContent={true} style={todaysAddress == null && tab.label == "map" ? "display: none;" : "" } tabIndicator$transition="fade" minWidth>
    <TabIcon class="material-icons">{tab.icon}</TabIcon>
    <TabLabel>{tab.label}</TabLabel>
  </Tab>
</TabBar>

<div id="addressBox">

  {#if keyedTabsActive && keyedTabsActive.k == 1}
    <AddressCard bind:update={update} todaysAddress={todaysAddress} phone={phone} on:resetCalendar={resetCalendar} on:processNewMonth={processNewMonth}/>
  {/if}

  {#if keyedTabsActive && keyedTabsActive.k == 2}
    {#if todaysAddress != null}
      <Map mobile={$session.mobile} todaysAddress={todaysAddress} pinTitle={pinTitle} />
    {:else if tempHolder}
      <div id="map-placeholder" />
    {/if}
  {/if}

  {#if !resetCalendarCheck }
    <div class={keyedTabsActive && keyedTabsActive.k == 3 ? "calendar-container" : "hidden" }>
      <div class="calendar-header">
        <h2 class="calendar-header-h2">
          {monthNames[month]} {year}<br>
          <IconButton style="padding: 6px 6px 0 6px; font-size: 1.2em;" class="material-icons" on:click={()=>prev("year")}>first_page</IconButton>
          <IconButton style="padding: 6px 6px 0 6px; font-size: 1.2em;" class="material-icons" on:click={()=>prev()}>chevron_left</IconButton>
          <IconButton style="padding: 6px 6px 0 6px; font-size: 1.2em;" class="material-icons" on:click={()=>next()}>chevron_right</IconButton>
          <IconButton style="padding: 6px 6px 0 6px; font-size: 1.2em;" class="material-icons" on:click={()=>next("year")}>last_page</IconButton>
        </h2>
      </div>
      <Calendar mobile={$session.mobile} currentDate={currentDate} items={items} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} />
    </div>
  {:else}
    <div class={keyedTabsActive && keyedTabsActive.k == 3 ? "calendar-container" : "hidden" }>
      <div class="calendar-header">
        <h2 class="calendar-header-h2">
          {monthNames[month]} {year}<br>
          <IconButton style="padding: 6px 6px 0 6px; font-size: 1.2em;" class="material-icons" on:click={()=>prev("year")}>first_page</IconButton>
          <IconButton style="padding: 6px 6px 0 6px; font-size: 1.2em;" class="material-icons" on:click={()=>prev()}>chevron_left</IconButton>
          <IconButton style="padding: 6px 6px 0 6px; font-size: 1.2em;" class="material-icons" on:click={()=>next()}>chevron_right</IconButton>
          <IconButton style="padding: 6px 6px 0 6px; font-size: 1.2em;" class="material-icons" on:click={()=>next("year")}>last_page</IconButton>
        </h2>
      </div>
      <Calendar mobile={$session.mobile} currentDate={currentDate} items={items} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} />
    </div>
  {/if}

</div>
<div id="button-holder">
  <Button class="submitButton" variant="unelevated"  on:click={launchAddressChange} ><Label class="submitButtonLabel">Change Address</Label></Button>
</div>