<script>
  import { stores } from '@sapper/app';
  import Fab, {Icon} from '@smui/fab';
  // import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';
	import { standardizeDates, put } from '../../routes/utils/helper.js';
  import Button, {Label} from '@smui/button';
  import { createEventDispatcher } from 'svelte';
  import Textfield from '@smui/textfield';
  import EnclosedCalendar from './EnclosedCalendar.svelte'

  const { session } = stores();

  const dispatch = createEventDispatcher();

  function processNewMonth() {
      dispatch('processNewMonth');
  }

  export let todaysAddress, phone, update;

  if (!todaysAddress.delivery_instructions) {
    todaysAddress.delivery_instructions = "";
  }
  if (!todaysAddress.nickname) {
    todaysAddress.nickname = "";
  }

  const today = standardizeDates(new Date());
  let submitErrors, errorsPresent;

	async function submit() {
		const response = await put(`api/manage/update_address`, { address: todaysAddress });

		// TODO handle network errors
		submitErrors = response.error;

		if (response.addresses) {
      $session.addresses = response.addresses;
      processNewMonth();
      toggleUpdate();
		}
    if (submitErrors != null) {
      // errorsPresent.open()
    }
  }

  let startDateOpen = false;
  let endDateOpen = false;

  function toggleStartDate() {
    startDateOpen = startDateOpen == false;
  }
  function toggleEndDate() {
    endDateOpen = endDateOpen == false;
  }
  function toggleUpdate() {
    update = update == false;
  }
</script>

<style>
  #enclosure {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: space-evenly;
    overflow-y: auto;
  }

  p {
    margin: 0;
    padding: 0;
  }

  #buttons {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }

  #inline {
    display: inline;
  }

  * :global(.dateButtons) {
    text-decoration: underline !important;
  }

  * :global(.fullWidth) {
    width: 90%;
  }
</style>

<div id="enclosure">
  <p>
    <Textfield dense  class="halfWidth" variant="outlined" label="Address nickname (optional)" bind:value={todaysAddress.nickname}/><br>
    {$session.user.first_name} {$session.user.last_name}<br>
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
    <a href="tel:{phone}">{phone}</a><br>
    <Textfield dense  class="fullWidth" variant="outlined" label="Delivery instructions (optional)" bind:value={todaysAddress.delivery_instructions}/>
  </p>
  <div>
    {#if standardizeDates(todaysAddress.start_date) > standardizeDates(new Date())}
      <Button touch dense color="secondary" on:click={toggleStartDate} class="dateButtons" variant="outlined"><Label>{standardizeDates(todaysAddress.start_date).toDateString().split(/ (.*)/)[1]}</Label></Button>
    {/if}
    {#if todaysAddress.end_date && standardizeDates(todaysAddress.end_date) > standardizeDates(new Date())}
      {#if standardizeDates(todaysAddress.start_date) > standardizeDates(new Date())}
        <p id="inline"> - </p>
      {/if}
      <Button touch dense color="secondary" on:click={toggleEndDate} class="dateButtons" variant="outlined"><Label>{standardizeDates(todaysAddress.end_date).toDateString().split(/ (.*)/)[1]}</Label></Button>
    {/if}
  </div>
  {#if startDateOpen}
    <EnclosedCalendar address_type={todaysAddress.address_type} addresses={$session.addresses} bind:date={todaysAddress.start_date} bind:open={startDateOpen} calendar_type="start date" />
  {/if}
  {#if endDateOpen}
    <EnclosedCalendar address_type={todaysAddress.address_type} addresses={$session.addresses} bind:date={todaysAddress.end_date} bind:open={endDateOpen} calendar_type="end date" />
  {/if}
  <div id="buttons">
    <Fab color="secondary" on:click={toggleUpdate} extended mini>cancel</Fab>
    <Fab color="primary" on:click={submit} extended>confirm</Fab>
  </div>
</div>