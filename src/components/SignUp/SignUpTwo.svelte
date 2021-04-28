<script>
	import { goto, stores } from '@sapper/app';
  import { post } from '../../routes/utils/helper.js';
  import { user as origUser, address as origAddress, validAddress, stepOneComplete, smartIDOptions } from '../../routes/utils/stores.js';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text/index';
  import Select, {Option} from '@smui/select';
  import Button, {Label} from '@smui/button';
  import Dialog, {Title, Content, Actions, InitialFocus} from '@smui/dialog';
  import ConfirmAddress from '../ConfirmAddress.svelte';
  import BypassAddressValidation from '../BypassAddressValidation.svelte';
  import Loading from '../Loading.svelte';

	const { session } = stores();

  let invalidLineOne = false;
  let errorLineOne = "";
  let invalidLineTwo = false;
  let errorLineTwo = "";
  let invalidBusinessName = false;
  let errorBusinessName = "";
  let invalidAttentionTo = false;
  let errorAttentionTo = "";
  let invalidCity = false;
  let errorCity = "";
  let invalidState = false;
  let errorState = "";
  let invalidZipCode = false;
  let errorZipCode = "";
  let invalidCountry = false;
  let errorCountry = "";
  let invalidPhone = false;
  let errorPhone = "";
  let invalidNickname = false;
  let errorNickname = "";
  let invalidDeliveryInstructions = false;
  let errorDeliveryInstructions = "";

  let loading = false;
  let status = "permanent";
  let start_date = (new Date()).toJSON();
  let address, compareAddress;
  let startCompare = false;
  const user = $origUser;

  const states = [
    "Alabama",
    "Alaska",
    "American Samoa",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Federated States of Micronesia",
    "Florida",
    "Georgia",
    "Guam",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Marshall Islands",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Northern Mariana Islands",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Palau",
    "Pennsylvania",
    "Puerto Rico",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virgin Island",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ]

  let submitErrors, addressValidationError = false;

	async function verifyAddress(testAddress) {
    loading= true;
    const response = await post(`api/manage/verify_address`, testAddress);
    loading= false;
    if (response["0"]) {
      addressValidationError = true;
    } else {
      compareAddress = JSON.parse(JSON.stringify(testAddress));
      compareAddress.line_one = response.street1;
      compareAddress.line_two = response.street2;
      compareAddress.zip_code = `${response.zip}-${response.Zip4}`;
      compareAddress.city = response.city;

      startCompare = true;
    }
  }

	async function emailConfirmation(user) {
		await post(`api/manage/confirm_signup_email`, { user });
  }

	async function submit() {
    loading= true;
		const response = await post(`api/auth/sign-up`, { user, address, status, start_date });
  
    submitErrors = response.error;

		if (response.user) {
			$session.user = response.user;
      $session.addresses = response.addresses;

      // Create 3 new options for smartIDs
      const letters = 'ABCDEFGHJKLMNPQRTUVWXY1234567890';  // selection of A-Z & 0-9 (No I, S, Z, or O)
      let smartID1='';  // declare empty string
      let smartID2='';  // declare empty string
      let smartID3='';  // declare empty string

      for(var i = 0; i < 8; i++) {  // loop 8 times
          smartID1 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
          smartID2 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
          smartID3 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
      }
      $smartIDOptions = [smartID1, smartID2, smartID3];
      $origUser = {
        smart_id: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        password: '',
      };
      $origAddress = {
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
        delivery_instructions: '', // optional
      };
      await emailConfirmation(response.user);
      loading= false;
			goto('dashboard');
		}
    if (submitErrors != null) {
      errorsPresent = true;
      loading = false;
    }
  }
  let errorsPresent = false;
  
	function verify(event) {
    invalidLineOne = false
    invalidLineTwo = false
    invalidBusinessName = false
    invalidAttentionTo = false
    invalidCity = false
    invalidState = false
    invalidZipCode = false
    invalidCountry = false
    invalidPhone = false
    invalidNickname = false
    invalidDeliveryInstructions = false;
    $validAddress.validate($origAddress, {abortEarly: false})
    .then(function() {
      verifyAddress($origAddress);
    })
    .catch(function(err) {
      for (const error of err.inner) {
        switch (error.path) {
          case "line_one":
            invalidLineOne = true;
            errorLineOne = error.message;
            break;
          case "line_two":
            invalidLineTwo = true;
            errorLineTwo = error.message;
            break;
          case "business_name":
            invalidBusinessName = true;
            errorBusinessName = error.message;
            break;
          case "attention_to":
            invalidAttentionTo = true;
            errorAttentionTo = error.message;
            break;
          case "city":
            invalidCity = true;
            errorCity = error.message;
            break;
          case "state":
            invalidState = true;
            errorState = error.message;
            break;
          case "zip_code":
            invalidZipCode = true;
            errorZipCode = error.message;
            break;
          case "country":
            invalidCountry = true;
            errorCountry = error.message;
            break;
          case "phone":
            invalidPhone = true;
            errorPhone = error.message;
            break;
          case "nickname":
            invalidNickname = true;
            errorNickname = error.message;
            break;
          case "delivery_instructions":
            invalidDeliveryInstructions = true;
            errorDeliveryInstructions = error.message;
            break;
          default:
            break;
        }
      }
    });
  }

  function previousStep(e) {
    $stepOneComplete = false;
  }

  function chooseOriginal() {
    address = $origAddress;
    submit();
  }

  function chooseReccomended() {
    address = compareAddress;
    submit();
  }
</script>

<style>
  form {
    width: 100%;
    max-width: 600px;
    text-align: center;
    margin: 0 auto;
  }

  .centerBlock {
    display: flex;
    justify-content: space-between;
  }
</style>

{#if loading}
  <Loading />
{/if}

<!-- Error creating account -->
<Dialog bind:open={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" on:MDCDialog:closed={previousStep}>
  <Title id="event-title">{submitErrors}</Title>
  <Actions>
    <Button touch default use={[InitialFocus]}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>

<!-- Error validating address -->
<Dialog bind:open={addressValidationError} aria-labelledby="event-title" aria-describedby="event-content">
  <Title id="event-title">We Weren't Able to Verify the Address You Entered</Title>
  <Content id="dialog-content">
    <BypassAddressValidation enteredAddress={$origAddress} />
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
      <ConfirmAddress enteredAddress={$origAddress} USPSAddress={compareAddress} />
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

<form on:submit|preventDefault={verify}>
  <Textfield input$autocomplete="address-line1" class="fullWidth" variant="outlined" label="Address line 1" bind:invalid="{invalidLineOne}" bind:value={$origAddress.line_one} on:change={()=>invalidLineOne=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {errorLineOne}
    </HelperText>
  </Textfield>
  <Textfield input$autocomplete="address-line2" class="fullWidth" variant="outlined" label="Address line 2 (optional)" bind:invalid="{invalidLineTwo}" bind:value={$origAddress.line_two} on:change={()=>invalidLineTwo=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {errorLineTwo}
    </HelperText>
  </Textfield>
  <Textfield input$autocomplete="organization" class="fullWidth" variant="outlined" label="Business name (optional)" bind:invalid="{invalidBusinessName}" bind:value={$origAddress.business_name} on:change={()=>invalidBusinessName=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {errorBusinessName}
    </HelperText>
  </Textfield>
  <Textfield input$autocomplete="attention-to" class="fullWidth" variant="outlined" label="Attention to (optional)" bind:invalid="{invalidAttentionTo}" bind:value={$origAddress.attention_to} on:change={()=>invalidAttentionTo=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {errorAttentionTo}
    </HelperText>
  </Textfield>
  <div class="centerBlock">
    <div class="thirdWidthContainer">
      <Textfield input$autocomplete="address-level2" class="fullWidth" variant="outlined" label="City" bind:invalid="{invalidCity}" bind:value={$origAddress.city} on:change={()=>invalidCity=false}>
        <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
          {errorCity}
        </HelperText>
      </Textfield>
    </div>
    <div class="thirdWidthContainer">
      <Select variant="outlined" class="fullWidth" bind:invalid="{invalidState}" bind:value={$origAddress.state} label="State">
        {#each states as state}
          <Option value={state} selected={$origAddress.state === state} on:change={()=>invalidState=false}>{state}</Option>
        {/each}
      </Select>
    </div>
    <div class="thirdWidthContainer">
      <Textfield input$autocomplete="postal-code" class="fullWidth" variant="outlined" label="Zip Code" bind:invalid="{invalidZipCode}" bind:value={$origAddress.zip_code} on:change={()=>invalidZipCode=false}>
        <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
          {errorZipCode}
        </HelperText>
      </Textfield>
    </div>
  </div>
  <Textfield input$autocomplete="country-name" class="fullWidth" variant="outlined" label="Country" bind:invalid="{invalidCountry}" bind:value={$origAddress.country} on:change={()=>invalidCountry=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {errorCountry}
    </HelperText>
  </Textfield>
  <Textfield class="fullWidth" variant="outlined" label="Address specific phone number (optional)" bind:invalid="{invalidPhone}" bind:value={$origAddress.phone} on:change={()=>invalidPhone=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {errorPhone}
    </HelperText>
  </Textfield>
  <Textfield class="fullWidth" variant="outlined" label="Package delivery instructions (optional)" bind:invalid="{invalidDeliveryInstructions}" bind:value={$origAddress.delivery_instructions} on:change={()=>invalidDeliveryInstructions=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {errorDeliveryInstructions}
    </HelperText>
  </Textfield>
  <Textfield class="fullWidth" variant="outlined" label="Address nickname (optional)" bind:invalid="{invalidNickname}" bind:value={$origAddress.nickname} on:change={()=>invalidNickname=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {errorNickname}
    </HelperText>
  </Textfield>
  <Button touch color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Submit</Label></Button>
</form>
<Button touch color="gray" class="submitButton" variant="unelevated"  on:click={previousStep} ><Label class="submitButtonLabel">Previous Step</Label></Button>
