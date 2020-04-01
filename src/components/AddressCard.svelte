<script>
  import { stores } from '@sapper/app';
  import Fab, {Icon} from '@smui/fab';
  import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';
	import { standardizeDates, del } from '../routes/utils.js';
  import Button, {Label} from '@smui/button';

  const { session } = stores();

  export let todaysAddress, phone;

  const today = standardizeDates(new Date());
  let submitErrors, errorsPresent;

	async function deleteAddress() {
		const response = await del(`manage/delete_address`, { address: todaysAddress });

		// TODO handle network errors
		submitErrors = response.error;

		if (response.addresses) {
			$session.addresses = response.addresses;
		}
    if (submitErrors != null) {
      errorsPresent.open()
    }
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
    position: absolute;
    bottom: 15px;
    justify-content: space-evenly;
  }
</style>
  <div id="currentAddress">
    <div id="innerPanel">
      <Dialog bind:this={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" >
        <Title id="event-title">{submitErrors}</Title>
        <Actions>
          <Button action="all" default use={[InitialFocus]}>
            <Label>Ok</Label>
          </Button>
        </Actions>
      </Dialog>
      {#if todaysAddress != null}
        <h5 class="{todaysAddress.address_type == "long_term" ? "primary" : "secondary"}">{todaysAddress.nickname ? todaysAddress.nickname : todaysAddress.address_type == "long_term" ? "Long-term Address" : "Temporary Address"}</h5>
        <p>
          {#if todaysAddress.attention_to}
            Attention to: {todaysAddress.attention_to}<br>
          {/if}
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
        {#if !todaysAddress.end_date || standardizeDates(todaysAddress.end_date) > today}
          <div id="buttons">
            <Fab color="secondary" on:click={()=>{}} mini><Icon class="material-icons">edit</Icon></Fab>
            {#if standardizeDates(todaysAddress.start_date) > today}
              <Fab color="primary" on:click={deleteAddress} mini><Icon class="material-icons">delete_outline</Icon></Fab>
            {/if}
          </div>
        {/if}
      {:else}
        <h5>This date was prior to when you signed up for Sartmail</h5>
        <p>
          Who knows where your mail was going during that wild uncivalized time...
        </p>
      {/if}
    </div>
  </div>