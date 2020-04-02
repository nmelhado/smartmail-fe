<script>
	import { stores } from '@sapper/app';
  import { start_date, end_date, address_type, addressStepTwoComplete, addressStepOneComplete } from '../routes/stores.js';
  import {Title, Subtitle, Content} from '@smui/paper';
  import IconButton, {Icon} from '@smui/icon-button';
  import Button, {Label} from '@smui/button';
  import CalendarDatePicker from './CalendarDatePicker';
	import { standardizeDates } from '../routes/utils.js';
  
  const { session } = stores();

	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let step = 1;
  let error= false;

  let startLimit = null;

  if ($address_type == "long_term") {
    startLimit = $session.addresses.filter( address => address.address_type == "long_term" && !address.end_date)[0].start_date
  }

  let currentMonthAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
  let items = currentMonthAddresses.map( address => {
    let endDate = ""
    if (typeof address.end_date != "undefined" && address.end_date != "") {
      endDate = standardizeDates(address.end_date.substring(0,10).replace(/-/g, '\/'))
      console.log(`address ID:    ${address.id},\address.end_date:    ${address.end_date.substring(0,10).replace(/-/g, '\/')},\nendDate:    ${endDate}`)
    }
    return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "long_term" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "long_term")}
  })
	function processNewMonth() {
    currentMonthAddresses = $session.addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
    items = currentMonthAddresses.map( address => {
      let endDate = ""
      if (typeof address.end_date != "undefined" && address.end_date != "") {
        endDate = standardizeDates(address.end_date.substring(0,10).replace(/-/g, '\/'))
      }
      return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "long_term" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "long_term")}
    })
	}

  // Update state on apply event
  function onApply({ detail }) {
    $start_date = detail.startDate;
    $end_date = detail.startDate;
  }

	function verify(event) {
    if ($address_type == "long_term" ) {
      if ($start_date == null) {
        error = true;
      } else {
        console.log("Completed step two");
        error = false;
        $addressStepTwoComplete = true;
      }
    } else {
      if ($start_date == null || $end_date == null) {
        error = true;
      } else {
        console.log("Completed step two");
        error = false;
        $addressStepTwoComplete = true;
      }
    }
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
	}

	function dayClick(e) {
    if ($address_type == "long_term" ) {
      $start_date = e.date; 1;
    } else {
      if (step === 1) {
        $start_date = e.date;
        $end_date = null;
        step = 2;
      } else {
        if (e.date < $start_date) {
          $end_date = $start_date;
          $start_date = e.date;
        } else {
          $end_date = e.date;
        }
        step = 1;
      }
    }
  }

  function previousStep(e) {
    $addressStepOneComplete = false;
  }
</script>
<style>
  .date-informer {
    text-align: center;
    margin: 25px 0 0;
    color: var(--primary);
  }

  .error {
    color: darkred;
    border: solid 1px darkred;
  }

  form {
    margin: 10px auto 0;
  }

  .calendar-container {
    width: 80%;
    margin: 0 auto;
    border: solid 1px var(--lightGray);
  }

  .calendar-footer-h2 {
    color: var(--primaryAccent);
    margin: 0 0 5px;
  }

  .calendar-footer {
    display: flex;
    justify-content: space-evenly;
  }

  .alignRight {
    text-align: right;
  }
</style>

<div id="paper-inner">
  <Title>Create an Address Change</Title>
  <Content>
    <p class="{error ? "error" : ""}">(Step 2 of 3) Please select the start date {$address_type == "long_term" ? "" : "and end date "} for your address change:</p>
    <h2 class="calendar-footer-h2">
      {monthNames[month]} {year}
    </h2>
    <div class="calendar-container">
      <CalendarDatePicker startLimit={startLimit} items={items} start={$start_date} end={$end_date} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} />
      <div class="calendar-footer">
        <IconButton class="material-icons" on:click={()=>prev("year")}>first_page</IconButton>
        <IconButton class="material-icons" on:click={()=>prev()}>chevron_left</IconButton>
        <IconButton class="material-icons" on:click={()=>next()}>chevron_right</IconButton>
        <IconButton class="material-icons" on:click={()=>next("year")}>last_page</IconButton>
      </div>
    </div>
    {#if ($address_type == "long_term" && $start_date != null) || ($address_type != "long_term" && $start_date != null && $end_date != null)}
      <h3 class="date-informer">Selected date{$address_type == "long_term" ? "" : "s"} {$start_date.toDateString()}{$address_type != "long_term" ? " - " + $end_date.toDateString() : ""}</h3>
    {/if}
    <form on:submit|preventDefault={verify}>
      <div class="alignRight">
        <Button color="secondary" class="tightButton" variant="unelevated"><Label class="tightButtonLabel" on:click={verify}>Next Step</Label></Button>
      </div>
    </form>
    <div class="alignRight">
      <Button color="gray" class="tightButton" variant="unelevated"  on:click={previousStep} ><Label class="tightButtonLabel">Previous Step</Label></Button>
    </div>
  </Content>
</div>
