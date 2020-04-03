<script>
	import { stores } from '@sapper/app';
  import Paper, {Title, Content} from '@smui/paper';
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

  let startLimit = null;

  export let address_type, addresses, date, open, calendar_type;
  let pickDate = standardizeDates(date);

  let currentMonthAddresses = addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
  let items = currentMonthAddresses.map( address => {
    let endDate = ""
    if (typeof address.end_date != "undefined" && address.end_date != "") {
      endDate = standardizeDates(address.end_date.substring(0,10).replace(/-/g, '\/'))
      console.log(`address ID:    ${address.id},\address.end_date:    ${address.end_date.substring(0,10).replace(/-/g, '\/')},\nendDate:    ${endDate}`)
    }
    return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "long_term" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "long_term")}
  })
	function processNewMonth() {
    currentMonthAddresses = addresses.filter( address => standardizeDates(address.start_date) <= standardizeDates(new Date(year, month + 1, 0)) && (typeof address.end_date == "undefined" || address.end_date == "" || standardizeDates(address.end_date) >= standardizeDates(new Date(year, month, 1)) ));
    items = currentMonthAddresses.map( address => {
      let endDate = ""
      if (typeof address.end_date != "undefined" && address.end_date != "") {
        endDate = standardizeDates(address.end_date.substring(0,10).replace(/-/g, '\/'))
      }
      return {startDate: standardizeDates(address.start_date), endDate, className:`${address.address_type == "long_term" ? "task--primary" : "task--secondary"}`,isBottom: (address.address_type == "long_term")}
    })
  }
  
  function verify() {
    date = pickDate;
    toggleOpen();
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
    pickDate = e.date;
  }

  function toggleOpen() {
    open = open == false;
  }
</script>
<style>
  .date-informer {
    text-align: center;
    margin: 25px 0 0;
    color: var(--primary);
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

  #background {
    position: fixed;
    background-color: rgba(80, 80, 80, 0.4);
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 95;
  }

  #inner {
    position: fixed;
    left: 50%;
    top: 50%;
    max-height: 85%;
    overflow-y: auto;
    transform: translate(-50%, -50%);
    z-index: 96;
  }
</style>


<div id="background" on:click|stopPropagation={toggleOpen}>
  <div id="inner" on:click|stopPropagation={()=>{}}>
    <Paper>
      <Title>Choose a new {calendar_type} for your address change:</Title>
      <Content>
        <h2 class="calendar-footer-h2">
          {monthNames[month]} {year}
        </h2>
        <div class="calendar-container">
          <CalendarDatePicker startLimit={startLimit} items={items} start={pickDate} end={pickDate} year={year} month={month} on:dayClick={(e)=>dayClick(e.detail)} />
          <div class="calendar-footer">
            <IconButton class="material-icons" on:click={()=>prev("year")}>first_page</IconButton>
            <IconButton class="material-icons" on:click={()=>prev()}>chevron_left</IconButton>
            <IconButton class="material-icons" on:click={()=>next()}>chevron_right</IconButton>
            <IconButton class="material-icons" on:click={()=>next("year")}>last_page</IconButton>
          </div>
        </div>
        <h3 class="date-informer">Selected {calendar_type}: {pickDate.toDateString()}</h3>
        <form on:submit|preventDefault={verify}>
          <div class="alignRight">
            <Button color="secondary" class="tightButton" variant="unelevated"><Label class="tightButtonLabel" on:click={verify}>Next Step</Label></Button>
          </div>
        </form>
      </Content>
    </Paper>
  </div>
</div>