<script>
  import { stores } from '@sapper/app';
  import Fab, {Icon} from '@smui/fab';
  import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';
	import { standardizeDates, put } from '../routes/utils.js';
  import Button, {Label} from '@smui/button';
  import { createEventDispatcher } from 'svelte';
  import Textfield from '@smui/textfield'
  import EnclosedCalendar from './EnclosedCalendar'

  const { session } = stores();

  const dispatch = createEventDispatcher();

  function processNewMonth() {
      dispatch('processNewMonth');
  }

  export let todaysAddress, phone, update;

  const today = standardizeDates(new Date());
  let submitErrors, errorsPresent;

	async function submit() {
		const response = await put(`manage/update_address`, { address: todaysAddress });

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
  #buttons {
    display: flex;
    width: 100%;
    position: absolute;
    bottom: 15px;
    justify-content: space-evenly;
  }

  * :global(.dateButtons) {
    text-decoration: underline !important;
  }
</style>

<p>
  <Textfield  class="halfWidth" variant="outlined" label="Address nickname (optional)" bind:value={todaysAddress.nickname}/><br>
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
  {#if todaysAddress.unit_number}
    {todaysAddress.unit_number}<br>
  {/if}
  {todaysAddress.city}, {todaysAddress.state}, {todaysAddress.zip_code}<br>
  {todaysAddress.country}<br>
  <a href="tel:{phone}">{phone}</a><br>

</p>
{#if standardizeDates(todaysAddress.start_date) > standardizeDates(new Date())}
  <Button color="secondary" on:click={toggleStartDate} class="dateButtons" variant="outlined"><Label>Start date: {standardizeDates(todaysAddress.start_date).toDateString()}</Label></Button>
{/if}
{#if todaysAddress.end_date && standardizeDates(todaysAddress.end_date) > standardizeDates(new Date())}
  <Button color="secondary" on:click={toggleEndDate} class="dateButtons" variant="outlined"><Label>End date: {standardizeDates(todaysAddress.end_date).toDateString()}</Label></Button>
{/if}
{#if startDateOpen}
  <EnclosedCalendar address_type={todaysAddress.address_type} addresses={$session.addresses} bind:date={todaysAddress.start_date} bind:open={startDateOpen} calendar_type="start date" />
{/if}
{#if endDateOpen}
  <EnclosedCalendar address_type={todaysAddress.address_type} addresses={$session.addresses} bind:date={todaysAddress.end_date} bind:open={endDateOpen} calendar_type="end date" />
{/if}
<div id="buttons">
  <Fab color="secondary" on:click={toggleUpdate} extended>cancel</Fab>
  <Fab color="primary" on:click={submit} extended>confirm</Fab>
</div>