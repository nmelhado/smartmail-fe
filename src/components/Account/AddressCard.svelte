<script>
  import { stores } from '@sapper/app';
  import Fab, {Icon} from '@smui/fab';
  import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';
	import { standardizeDates, del } from '../../routes/utils/helper.js';
  import Button, {Label} from '@smui/button';
  import { createEventDispatcher } from 'svelte';
  import Update from './Update.svelte';

  const { session } = stores();

  const dispatch = createEventDispatcher();

  function processNewMonth() {
      dispatch('processNewMonth');
      dispatch('resetCalendar');
  }

  export let todaysAddress, phone, update, edit = true;

  const today = standardizeDates(new Date());
  let submitErrors;
  let errorsPresent = false;

	async function deleteAddress() {
		const response = await del(`api/manage/delete_address`, { address: todaysAddress });

		// TODO handle network errors
		submitErrors = response.error;

		if (response.addresses) {
      $session.addresses = response.addresses;
      processNewMonth();
		}
    if (submitErrors != null) {
      errorsPresent = true;
    }
  }

  function toggleUpdate() {
    update = update == false;
  }
</script>

<style>
  #currentAddress {
    flex-grow: 2;
    display: table;
    min-width: 300px;
    border: 1px solid var(--lightGray);
    background-color: var(--veryLightGray);
    border-right: 0;
    border-left: 0;
    height: 450px;
  }

  #currentAddressM {
    display: table;
    padding: 2em 0;
    width: 100%;
    background-color: var(--veryLightGray);
  }

  #currentAddressNoEdit {
    display: table;
    padding: 0.5em 0 0;
    width: 100%;
    font-size: 0.8em;
    background-color: var(--veryLightGray);
  }

  #innerPanel {
    position: relative;
    display: table-cell;
    vertical-align: middle;
    margin: 0 auto;
  }

  h5 {
    font-size: 1.3em;
    color: var(--primary);
    font-weight: 700;
  }

  .primary {
    color: var(--primaryAccent);
  }

  .secondary {
    color: var(--primary);
  }

  #buttons {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
  }

  p {
    margin: 1em 0 35px;
  }

  #packageDelivery {
    color: var(--veryDarkGray);
    margin: 10px 0 0;
    font-size: 1.2em;
  }

  #packageDeliveryBody {
    font-style: italic;
    margin: 8px 0 35px;
    color: var(--darkGray);
  }

  .addressPreview {
    margin: 0.1em 0 2em;
  }
</style>
  <div id={$session.mobile ? edit ? "currentAddressM" : "currentAddressNoEdit" : "currentAddress"}>
    <div id="innerPanel">
      <Dialog bind:open={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" >
        <Title id="event-title">{submitErrors}</Title>
        <Actions>
          <Button touch action="all" default use={[InitialFocus]}>
            <Label>Ok</Label>
          </Button>
        </Actions>
      </Dialog>
      {#if todaysAddress != null}
        {#if !update}
          <h5 class="{todaysAddress.address_type == "permanent" ? "primary" : "secondary"}">{todaysAddress.nickname ? todaysAddress.nickname : todaysAddress.address_type == "permanent" ? "Permanent Address" : "Temporary Address"}</h5>
          <p class="{edit ? "" : "addressPreview" }">
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
            {#if edit}
              <a href="tel:{phone}">{phone}</a><br>
            {/if}
          </p>
          {#if edit && todaysAddress.delivery_instructions}
            <h5 id="packageDelivery">Package delivery instructions:</h5>
            <p id="packageDeliveryBody">{todaysAddress.delivery_instructions}</p>
          {/if}
          {#if edit && (!todaysAddress.end_date || standardizeDates(todaysAddress.end_date) > today)}
            <div id="buttons">
              <Fab color="secondary" on:click={toggleUpdate} mini><Icon class="material-icons">edit</Icon></Fab>
              {#if standardizeDates(todaysAddress.start_date) > today}
                <Fab color="primary" on:click={deleteAddress} mini><Icon class="material-icons">delete_outline</Icon></Fab>
              {/if}
            </div>
          {/if}
        {:else}
          <Update on:processNewMonth={processNewMonth} bind:todaysAddress={todaysAddress} {phone} bind:update={update} />
        {/if}
      {:else}
        <h5>This date was prior to when you signed up for Sartmail</h5>
        <p>
          Who knows where your mail was going during that wild uncivalized time...
        </p>
      {/if}
    </div>
  </div>