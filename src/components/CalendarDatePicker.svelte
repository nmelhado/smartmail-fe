<div class="calendar">
	{#each headers as header}
	<span class="day-name">{header}</span>
	{/each}

	{#each days as day}
		{#if day.enabled}
      {#if (startLimit != null && standardizeDates(day.date) < standardizeDates(startLimit)) || standardizeDates(day.date) <= standardizeDates(new Date())}
        <span class="day day-invalid" style="pointer-events: none; cursor: not-allowed;">{day.name}</span>
      {:else if (start != null && day.date.toDateString() == start.toDateString()) || (end != null && day.date.toDateString() == end.toDateString())}
        <span class="day day-select" on:click={()=>dispatch('dayClick',day)}>{day.name}</span>
		  {:else if start != null && end != null && standardizeDates(start) < standardizeDates(day.date) && standardizeDates(day.date) < standardizeDates(end)}
        <span class="day day-between" on:click={()=>dispatch('dayClick',day)}>{day.name}</span>
      {:else}
        <span class="day" on:click={()=>dispatch('dayClick',day)}>{day.name}</span>
      {/if}
		{:else}
			<span class="day day-disabled">{day.name}</span>
		{/if}
	{/each}


		
	{#each items as item}
		<section
			class="task {item.className}"
      style="grid-column: {item.startCol} / span {item.len + 1};      
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
	import { stores } from '@sapper/app';
	import {createEventDispatcher } from 'svelte';
	import { standardizeDates } from '../routes/utils.js';

  const { session } = stores();

	var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let rowCount = 0;
	let headers = [];
  let now = standardizeDates(new Date());
	export let year = now.getFullYear();		//	this is the month & year displayed
	export let month = now.getMonth();
	export let start, end, items, startLimit;
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
      let d = standardizeDates(new Date(year,month,i+1));
			days.push({name:''+(i+1),enabled:true,date:d,});
		}
		//	show any days to fill up the last row (disabled) - always less than 7
		for (let i=0;days.length%7;i++) {
      let d = new Date((month==11?year+1:year),(month+1)%12,i+1);
      days.push({name:''+(i+1),enabled:false,date:d,});
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
    let startDate = start;
    if (startDate < standardizeDates(new Date(year, month, 1))) {
      startDate = standardizeDates(new Date(year, month, 1))
    }
    let endDate = standardizeDates(new Date(year, month + 1, 0));
    if (end && end != "") {
      const tempEndDate = end;
      if (tempEndDate < standardizeDates(new Date(year, month + 1, 0))) {
        endDate = tempEndDate;
      }
    }
    const numberOfDays = daysBetween(startDate, endDate);
		for (let i=0;i<days.length;i++) {
			let d = days[i].date;
			if (d.getFullYear() === startDate.getFullYear()
				&& d.getMonth() === startDate.getMonth()
				&& d.getDate() === startDate.getDate()) {
				  return {days: numberOfDays,row:Math.floor(i/7)+2,col:i%7+1};
        }
    }
		return null;	
	}
	
</script>

<style>
  .calendar {
    display: grid;
    width: 100%;
    height: 300px;
    grid-template-columns: repeat(7, minmax(14%, 1fr));
    grid-template-rows: 30px;
    grid-auto-rows: minmax(45px, 1fr);
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
    cursor: pointer;
  }
  .day-select {
    background-color: var(--primaryFade);
  }
  .day-between {
    background-color: var(--primaryAccentFade);
  }
  .day-invalid {
    background-color: var(--invalidRed);
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
    height: 6px;
    margin: 10px;
    border-left-style: solid;
    font-size: 14px;
    position: relative;
    align-self: center;
    z-index:2;
    border-radius: 15px;
    pointer-events: none;
    opacity: 0.4;
  }
  .task--secondary {
    background: var(--primary);
    border: 0;
    border-radius: 14px;
    box-shadow: 0 10px 14px rgba(71, 187, 255, 0.301);
  }
  .task--primary {
    background: var(--primaryAccent);
    border: 0;
    border-radius: 14px;
    box-shadow: 0 10px 14px rgba(71, 187, 255, 0.301);
  }

</style>


