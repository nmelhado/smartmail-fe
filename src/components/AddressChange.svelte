<script>
  import { 
    addressChangeActive, 
    addressStepOneComplete, 
    addressStepTwoComplete, 
    addressStepThreeComplete, 
    address,
    address_type,
    start_date,
    end_date } from '../routes/stores.js';
  import AddressChangeOne from './AddressChangeOne';
  import AddressChangeTwo from './AddressChangeTwo';
  import AddressChangeThree from './AddressChangeThree';
  import Paper from '@smui/paper';
  import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';
  import Button, {Label} from '@smui/button';
  
  let errorsPresent;
  let submitErrors;

  $address = {
    nickname: '', // optional
    line_one: '',
    line_two: '', // optional
    unit_number: '', // optional
    business_name: '', // optional
    attention_to: '', // optional
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    phone: '', // optional
  };

  function cancel() {
    $address_type = "";
    $start_date = null;
    $end_date = null;
    $address = {
      nickname: '', // optional
      line_one: '',
      line_two: '', // optional
      unit_number: '', // optional
      business_name: '', // optional
      attention_to: '', // optional
      city: '',
      state: '',
      zip_code: '',
      country: 'United States',
      phone: '' // optional
    };
    $addressStepOneComplete = false;
    $addressStepTwoComplete = false;
    $addressStepThreeComplete = false;
    $addressChangeActive = false;
  }

  function goBack(e) {
    $addressStepTwoComplete = false;
  }
</script>

<style>
  #paper-back {
    position: fixed;
    background-color: rgba(80, 80, 80, 0.4);
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 95;
  }

  #paper-holder {
    position: fixed;
    left: 50%;
    top: 50%;
    max-height: 85%;
    overflow-y: auto;
    transform: translate(-50%, -50%);
    z-index: 96;
  }
</style>

<div id="paper-back"  on:click|stopPropagation={cancel}>
  <div on:click|stopPropagation={()=>{}}>
    <Dialog style="z-index: 97;" bind:this={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" on:MDCDialog:closed={goBack}>
      <Title id="event-title">{submitErrors}</Title>
      <Actions>
        <Button action="all" default use={[InitialFocus]}>
          <Label>Ok</Label>
        </Button>
      </Actions>
    </Dialog>
  </div>
  <div id="paper-holder" on:click|stopPropagation={()=>{}}>
    <Paper>
      {#if !$addressStepOneComplete}
        <AddressChangeOne cancel={cancel} />
      {:else if !$addressStepTwoComplete}
        <AddressChangeTwo cancel={cancel} />
      {:else if !$addressStepThreeComplete}
        <AddressChangeThree cancel={cancel} errorsPresent={errorsPresent} bind:submitErrors={submitErrors} />
      {/if}
    </Paper>
  </div>
</div>