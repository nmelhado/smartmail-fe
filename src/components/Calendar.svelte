<div class="calendar">
	{#each headers as header}
	<span class="day-name" on:click={()=>dispatch('headerClick',header)}>{header}</span>
	{/each}

	{#each days as day}
		{#if day.enabled}
			<span class="day" on:click={()=>dispatch('dayClick',day)}>{day.name}</span>
		{:else}
			<span class="day day-disabled" on:click={()=>dispatch('dayClick',day)}>{day.name}</span>
		{/if}
	{/each}
		
	{#each items as item}
		<section
			on:click={()=>dispatch('itemClick',item)} 
			class="task {item.className}"
      style="grid-column: {item.startCol} / span {item.len};      
      grid-row: {item.startRow};  
      align-self: {item.isBottom?'end':'center'};"
			>
			<p/>
			{#if item.detailHeader}
			<div class="task-detail">
				<h2>{item.detailHeader}</h2>
				<p>{item.detailContent}</p>
			</div>
			{/if}
		</section>
    {#if item.startCol + item.len > 6 && item.startRow + 1 < rowCount}
      <section
        on:click={()=>dispatch('itemClick',item)} 
        class="task {item.className}"
        style="grid-column: 1 / span {item.len - (7 - item.startCol)};      
        grid-row: {item.startRow + 1};  
        align-self: {item.isBottom?'end':'center'};"
        >
        <p/>
        {#if item.detailHeader}
        <div class="task-detail">
          <h2>{item.detailHeader}</h2>
          <p>{item.detailContent}</p>
        </div>
        {/if}
      </section>
    {/if}
    {#if item.startCol + item.len > 14 && item.startRow + 2 < rowCount}
      <section
        on:click={()=>dispatch('itemClick',item)} 
        class="task {item.className}"
        style="grid-column: 1 / span {item.len - (14 - item.startCol)};      
        grid-row: {item.startRow + 2};  
        align-self: {item.isBottom?'end':'center'};"
        >
        <p/>
        {#if item.detailHeader}
        <div class="task-detail">
          <h2>{item.detailHeader}</h2>
          <p>{item.detailContent}</p>
        </div>
        {/if}
      </section>
    {/if}
    {#if item.startCol + item.len > 21 && item.startRow + 3 < rowCount}
      <section
        on:click={()=>dispatch('itemClick',item)} 
        class="task {item.className}"
        style="grid-column: 1 / span {item.len - (21 - item.startCol)};      
        grid-row: {item.startRow + 3};  
        align-self: {item.isBottom?'end':'center'};"
        >
        <p/>
        {#if item.detailHeader}
        <div class="task-detail">
          <h2>{item.detailHeader}</h2>
          <p>{item.detailContent}</p>
        </div>
        {/if}
      </section>
    {/if}
    {#if item.startCol + item.len > 28 && item.startRow + 4 < rowCount}
      <section
        on:click={()=>dispatch('itemClick',item)} 
        class="task {item.className}"
        style="grid-column: 1 / span {item.len - (28 - item.startCol)};      
        grid-row: {item.startRow + 4};  
        align-self: {item.isBottom?'end':'center'};"
        >
        <p/>
        {#if item.detailHeader}
        <div class="task-detail">
          <h2>{item.detailHeader}</h2>
          <p>{item.detailContent}</p>
        </div>
        {/if}
      </section>
    {/if}
    {#if item.startCol + item.len > 35 && item.startRow + 5 < rowCount}
      <section
        on:click={()=>dispatch('itemClick',item)} 
        class="task {item.className}"
        style="grid-column: 1 / span {item.len - (35 - item.startCol)};      
        grid-row: {item.startRow + 5};  
        align-self: {item.isBottom?'end':'center'};"
        >
        <p/>
        {#if item.detailHeader}
        <div class="task-detail">
          <h2>{item.detailHeader}</h2>
          <p>{item.detailContent}</p>
        </div>
        {/if}
      </section>
    {/if}
	{/each}
</div>

<script>
	import {createEventDispatcher } from 'svelte';

  export let items = [];

	var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let rowCount = 0;
	let headers = [];
	let now = new Date();
	export let year = now.getFullYear();		//	this is the month & year displayed
	export let month = now.getMonth();
	let eventText="Click an item or date";

	var days = [];	//	The days to display in each box
	
	let dispatch = createEventDispatcher();

	function randInt(max) {
		return Math.floor(Math.random()*max)+1;
	}

	function initMonthItems() {
		let y = year;
		let m = month;
		let d1=new Date(y,m,randInt(7)+7);

		//This is where you calc the row/col to put each dated item
		for (let i of items) {
			let rc = findRowCol(i.startDate, i.endDate);
			if (rc == null) {
				console.log('didn`t find date for ',i);
        i.startCol = 1;
        i.startRow = 2;
			} else {
				i.startCol = rc.col;
				i.startRow = rc.row;
        i.len = rc.days;
			}
		}
	}

	$: month,year,initContent();

	// choose what date/day gets displayed in each date box.
	function initContent() {
		headers = dayNames;
		initMonth();
		initMonthItems();
	}

	function initMonth() {
		days = [];
		let monthAbbrev = monthNames[month].slice(0,3);
		let nextMonthAbbrev = monthNames[(month+1)%12].slice(0,3);
		//	find the last Monday of the previous month
		var firstDay = new Date(year, month, 1).getDay();
		var daysInThisMonth = new Date(year, month+1, 0).getDate();
		var daysInLastMonth = new Date(year, month, 0).getDate();
		var prevMonth = month==0 ? 11 : month-1;
		
		//	show the days before the start of this month (disabled) - always less than 7
		for (let i=daysInLastMonth-firstDay;i<daysInLastMonth;i++) {
			let d = new Date(prevMonth==11?year-1:year,prevMonth,i+1);
			days.push({name:''+(i+1),enabled:false,date:d,});
		}
		//	show the days in this month (enabled) - always 28 - 31
		for (let i=0;i<daysInThisMonth;i++) {
      let d = new Date(year,month,i+1);
			if (i==0) days.push({name:monthAbbrev+' '+(i+1),enabled:true,date:d,});
			else days.push({name:''+(i+1),enabled:true,date:d,});
		}
		//	show any days to fill up the last row (disabled) - always less than 7
		for (let i=0;days.length%7;i++) {
			let d = new Date((month==11?year+1:year),(month+1)%12,i+1);
			if (i==0) days.push({name:nextMonthAbbrev+' '+(i+1),enabled:false,date:d,});
			else days.push({name:''+(i+1),enabled:false,date:d,});
    }
    rowCount = days.length / 7 + 2;
	}
  
  function treatAsUTC(date) {
      var result = new Date(date);
      result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
      return result;
  }

  function daysBetween(startDate, endDate) {
      var millisecondsPerDay = 24 * 60 * 60 * 1000;
      return Math.ceil((treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay);
  }


	function findRowCol(start, end) {
    let startDate = new Date(start);
    if (startDate < new Date(year, month, 1)) {
      startDate = new Date(year, month, 1)
    }
    let endDate = new Date(year, month + 1, 0);
    if (end && end != "") {
      const tempEndDate = new Date(end);
      if (tempEndDate < new Date(year, month + 1, 0)) {
        endDate = tempEndDate;
      }
    }
    const numberOfDays = daysBetween(startDate, endDate);
		for (let i=0;i<days.length;i++) {
			let d = days[i].date;
			if (d.getYear() === startDate.getYear()
				&& d.getMonth() === startDate.getMonth()
				&& d.getDate() === startDate.getDate()) {
				  return {days: numberOfDays,row:Math.floor(i/7)+2,col:i%7+1};
        }
    }
		return null;	
	}

	function itemClick(e) {
		eventText='itemClick '+JSON.stringify(e) + ' localtime='+e.date.toString();
	}
	function dayClick(e) {
		eventText='onDayClick '+JSON.stringify(e) + ' localtime='+e.date.toString();
	}
	function headerClick(e) {
		eventText='onHheaderClick '+JSON.stringify(e);
	}
	function next() {
		month++;
		if (month == 12) {
			year++;
			month=0;
		}
	}
	function prev() {
		if (month==0) {
			month=11;
			year--;
		} else {
			month--;
		}
	}
	
</script>

<style>
.calendar {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(7, minmax(14%, 1fr));
  grid-template-rows: 50px;
  grid-auto-rows: 90px;
  overflow: auto;
}
.day {
  border-bottom: 1px solid rgba(166, 168, 179, 0.12);
  border-right: 1px solid rgba(166, 168, 179, 0.12);
  text-align: right;
  padding: 14px 20px;
  letter-spacing: 1px;
  font-size: 14px;
  box-sizing: border-box;
  color: #98a0a6;
  position: relative;
  z-index: 1;
}
.day:nth-of-type(7n + 7) {
  border-right: 0;
}
.day:nth-of-type(n + 1):nth-of-type(-n + 7) {
  grid-row: 1;
}
.day:nth-of-type(n + 8):nth-of-type(-n + 14) {
  grid-row: 2;
}
.day:nth-of-type(n + 15):nth-of-type(-n + 21) {
  grid-row: 3;
}
.day:nth-of-type(n + 22):nth-of-type(-n + 28) {
  grid-row: 4;
}
.day:nth-of-type(n + 29):nth-of-type(-n + 35) {
  grid-row: 5;
}
.day:nth-of-type(n + 36):nth-of-type(-n + 42) {
  grid-row: 6;
}
.day:nth-of-type(n + 43):nth-of-type(-n + 49) {
  grid-row: 7;
}
.day:nth-of-type(7n + 1) {
  grid-column: 1/1;
}
.day:nth-of-type(7n + 2) {
  grid-column: 2/2;
}
.day:nth-of-type(7n + 3) {
  grid-column: 3/3;
}
.day:nth-of-type(7n + 4) {
  grid-column: 4/4;
}
.day:nth-of-type(7n + 5) {
  grid-column: 5/5;
}
.day:nth-of-type(7n + 6) {
  grid-column: 6/6;
}
.day:nth-of-type(7n + 7) {
  grid-column: 7/7;
}
.day-name {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--lightGray);
  text-align: center;
  border-bottom: 1px solid rgba(166, 168, 179, 0.12);
  line-height: 50px;
  font-weight: 500;
}
.day-disabled {
  color: rgba(152, 160, 166, 0.5);
  background-color: var(--veryLightGray);
  cursor: not-allowed;
}

.task {
  border-left-width: 3px;
  padding: 0;
  margin: 10px;
  border-left-style: solid;
  font-size: 14px;
  position: relative;
  align-self: center;
	z-index:2;
	border-radius: 15px;
}
.task--secondary {
  border-left-color: #4786ff;
  margin-top: 15px;
  background: rgba(218, 231, 255, 0.7);
  color: #0a5eff;
}
.task--primary {
  background: var(--primaryAccent);
  border: 0;
  border-radius: 14px;
  color: #f00;
  box-shadow: 0 10px 14px rgba(71, 187, 255, 0.301);
}
.task-detail {
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  background: #efe;
  border: 1px solid rgba(166, 168, 179, 0.2);
  color: #100;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  z-index: 2;
}
.task-detail:after, .task-detail:before {
  bottom: 100%;
  left: 30%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.task-detail:before {
  border-bottom-color: rgba(166, 168, 179, 0.2);
  border-width: 8px;
  margin-left: -8px;
}
.task-detail:after {
  border-bottom-color: #fff;
  border-width: 6px;
  margin-left: -6px;
}
.task-detail h2 {
  font-size: 15px;
  margin: 0;
  color: #91565d;
}
.task-detail p {
  margin-top: 4px;
  font-size: 12px;
  margin-bottom: 0;
  font-weight: 500;
  color: rgba(81, 86, 93, 0.7);
}

</style>


