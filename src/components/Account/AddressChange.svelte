<script>
  import { 
    addressChangeActive, 
    addressStepOneComplete, 
    addressStepTwoComplete, 
    addressStepThreeComplete, 
    address,
    address_type,
    start_date,
    end_date } from '../../routes/utils/stores.js';
  import AddressChangeOne from './AddressChangeOne.svelte';
  import AddressChangeTwo from './AddressChangeTwo.svelte';
  import AddressChangeThree from './AddressChangeThree.svelte';
  import Paper from '@smui/paper';
  import Dialog, {Content, Title, Actions, InitialFocus} from '@smui/dialog';
  import Button, {Label} from '@smui/button';
  import { createEventDispatcher } from 'svelte';
  import ConfirmAddress from '../ConfirmAddress.svelte';
  import BypassAddressValidation from '../BypassAddressValidation.svelte';
	import { goto, stores } from '@sapper/app';
  import { post } from '../../routes/utils/helper.js';
  import Loading from '../Loading.svelte';

  const { session } = stores();

  const dispatch = createEventDispatcher();

  function processNewMonth() {
      dispatch('processNewMonth');
      dispatch('resetCalendar');
  }
  
  let finalAddress, submitErrors;
  let errorsPresent = false;

  $address = {
    nickname: '', // optional
    line_one: '',
    line_two: '', // optional
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

	async function submit() {
    loading = true;
		const response = await post(`api/manage/change_address`, { address: finalAddress, status: $address_type, start_date: $start_date, end_date: $end_date });

		// TODO handle network errors
		submitErrors = response.error;
    loading = false;

		if (response.address) {
      if (response.address.address_type == "permanent") {
        $session.addresses = $session.addresses.map( address => {
          if (address.address_type == "permanent" && !address.end_date) {
            let newEndDate = new Date(response.address.start_date.split("T")[0])
            newEndDate.setDate(newEndDate.getDate() - 1);
            address.end_date = newEndDate.toISOString()
          }
          return address;
        })
      }
      $session.addresses.push(response.address)
      processNewMonth();
      cancel();
		}
    if (submitErrors != null) {
      console.log(submitErrors);
      errorsPresent = true;
    }
  }

  function goBack(e) {
    $addressStepTwoComplete = false;
  }

  let loading = false;

  function chooseOriginal() {
    finalAddress = $address;
    submit();
  }

  function chooseReccomended() {
    finalAddress = compareAddress;
    submit();
  }

  let compareAddress;
  let addressValidationError, startCompare = false;
</script>

<style>
  #paper-back {
    position: fixed;
    background-color: rgba(80, 80, 80, 0.4);
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 5;
  }

  #paper-holder {
    position: fixed;
    left: 50%;
    top: 50%;
    max-height: 85%;
    overflow-y: auto;
    transform: translate(-50%, -50%);
    z-index: 6;
  }

  #paper-holderM {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 100%;
    max-height: 80%;
    overflow-y: auto;
    transform: translate(-50%, -50%);
    z-index: 6;
  }
</style>

{#if loading}
  <Loading />
{/if}

<div id="paper-back"  on:click|stopPropagation={cancel}>
  <div on:click|stopPropagation={()=>{}}>
    <!-- Error creating account -->
    <Dialog style="z-index: 97;" bind:open={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" on:MDCDialog:closed={goBack}>
      <Title id="event-title">{submitErrors}</Title>
      <Actions>
        <Button touch action="all" default use={[InitialFocus]}>
          <Label>Ok</Label>
        </Button>
      </Actions>
    </Dialog>

    <!-- Error validating address -->
    <Dialog bind:open={addressValidationError} aria-labelledby="event-title" aria-describedby="event-content">
      <Title id="event-title">We Weren't Able to Verify the Address You Entered</Title>
      <Content id="dialog-content">
        <BypassAddressValidation enteredAddress={$address} />
      </Content>
      <Actions>
        <Button touch variant="outlined">
          <Label>Back</Label>
        </Button>
        <Button touch color="secondary" variant="outlined" on:click={chooseOriginal}>
          <Label>Proceed With Unverified Address (Not Reccomended)</Label>
        </Button>
      </Actions>
    </Dialog>

    <!-- Confirm address -->
    <Dialog bind:open={startCompare} aria-labelledby="event-title" aria-describedby="event-content">
      <Title id="event-title">Address Verification</Title>
      <Content id="dialog-content">
        {#if compareAddress && compareAddress.line_one}
          <ConfirmAddress enteredAddress={$address} USPSAddress={compareAddress} />
        {/if}
      </Content>
      <Actions>
        <Button touch variant="outlined">
          <Label>Back</Label>
        </Button>
        <Button touch color="secondary" variant="outlined" on:click={chooseOriginal}>
          <Label>Use The Adrress I Entered</Label>
        </Button>
        <Button touch color="secondary" variant="outlined" on:click={chooseReccomended} default use={[InitialFocus]}>
          <Label>Use The Recommended Adrress</Label>
        </Button>
      </Actions>
    </Dialog>
  </div>
  <div id={$session.mobile ? "paper-holderM" : "paper-holder" } on:click|stopPropagation={()=>{}}>
    <Paper>
      {#if !$addressStepOneComplete}
        <AddressChangeOne cancel={cancel} />
      {:else if !$addressStepTwoComplete}
        <AddressChangeTwo cancel={cancel} />
      {:else if !$addressStepThreeComplete}
        <AddressChangeThree bind:loading={loading} bind:addressValidationError={addressValidationError} bind:startCompare={startCompare} bind:compareAddress={compareAddress} on:processNewMonth={processNewMonth} />
      {/if}
    </Paper>
  </div>
</div>