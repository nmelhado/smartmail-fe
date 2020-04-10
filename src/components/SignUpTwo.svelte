<script>
	import { goto, stores } from '@sapper/app';
  import { post } from '../routes/utils.js';
  import { user as origUser, address as origAddress, validAddress, stepOneComplete, smartIDOptions } from '../routes/stores.js';
	import ListErrors from './ListErrors.svelte';
  import Textfield from '@smui/textfield'
  import Select, {Option} from '@smui/select';
  import Button, {Label} from '@smui/button';
  import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';

	const { session } = stores();
  let errors = [];
  let invalid = {
    line_one: false,
    line_two: false,
    unit_number: false,
    business_name: false,
    attention_to: false,
    city: false,
    state: false,
    zip_code: false,
    country: false,
    phone: false,
    nickname: false,
    delivery_instructions: false,
  }
  let status = "permanent";
  let start_date = (new Date()).toJSON();
  let address;
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

  let submitErrors;
	async function submit() {
		const response = await post(`auth/sign-up`, { user, address, status, start_date });

		// TODO handle network errors
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
        unit_number: '', // optional
        business_name: '', // optional
        attention_to: '', // optional
        city: '',
        state: '',
        zip_code: '',
        country: 'United States',
        phone: '', // optional
        delivery_instructions: '', // optional
      };
			goto('account');
		}
    if (submitErrors != null) {
      errorsPresent.open()
    }
  }
  let errorsPresent;
  
	function verify(event) {
    $validAddress.validate($origAddress, {abortEarly: false})
    .then(function() {
      address = $origAddress;
      submit();
    })
    .catch(function(err) {
      const tempInvalid = {
        line_one: false,
        line_two: false,
        unit_number: false,
        business_name: false,
        attention_to: false,
        city: false,
        state: false,
        zip_code: false,
        country: false,
        phone: false,
        nickname: false,
        delivery_instructions: false,
      };
      const tempErrors = [];
      for (const error of err.inner) {
        if (!tempInvalid[error.path]) {
          tempInvalid[error.path] = true;
          tempErrors.push(error.message);
        }
      }
      invalid = tempInvalid;
      errors = tempErrors;
    });
  }


  function previousStep(e) {
    $stepOneComplete = false;
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

<Dialog bind:this={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" on:MDCDialog:closed={previousStep}>
  <Title id="event-title">{submitErrors}</Title>
  <Actions>
    <Button action="all" default use={[InitialFocus]}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>

<ListErrors {errors}/>
<form on:submit|preventDefault={verify}>
  <Textfield input$name="address-1" class="fullWidth" variant="outlined" label="Address line 1" invalid="{invalid["line_one"]}" bind:value={$origAddress.line_one}/>
  <Textfield input$name="address-2" class="fullWidth" variant="outlined" label="Address line 2 (optional)" invalid="{invalid["line_two"]}" bind:value={$origAddress.line_two}/>
  <Textfield input$name="unit" class="fullWidth" variant="outlined" label="Unit number (optional)" invalid="{invalid["unit_number"]}" bind:value={$origAddress.unit_number}/>
  <Textfield input$name="business-name" class="fullWidth" variant="outlined" label="Business name (optional)" invalid="{invalid["business_name"]}" bind:value={$origAddress.business_name}/>
  <Textfield input$name="attention-to" class="fullWidth" variant="outlined" label="Attention to (optional)" invalid="{invalid["attention_to"]}" bind:value={$origAddress.attention_to}/>
  <div class="centerBlock">
    <Textfield input$name="city" class="thirdWidth" variant="outlined" label="City" invalid="{invalid["city"]}" bind:value={$origAddress.city}/>
    <Select variant="outlined" class="thirdWidth" invalid="{invalid["state"]}" bind:value={$origAddress.state} label="State">
      {#each states as state}
        <Option value={state} selected={$origAddress.state === state}>{state}</Option>
      {/each}
    </Select>
    <Textfield input$name="zip" class="thirdWidth" variant="outlined" label="Zip Code" invalid="{invalid["zip_code"]}" bind:value={$origAddress.zip_code}/>
  </div>
  <Textfield input$name="country" class="fullWidth" variant="outlined" label="Country" invalid="{invalid["country"]}" bind:value={$origAddress.country}/>
  <Textfield class="fullWidth" variant="outlined" label="Address specific phone number (optional)" invalid="{invalid["phone"]}" bind:value={$origAddress.phone}/>
  <Textfield class="fullWidth" variant="outlined" label="Package delivery instructions (optional)" invalid="{invalid["delivery_instructions"]}" bind:value={$origAddress.delivery_instructions}/>
  <Textfield class="fullWidth" variant="outlined" label="Address nickname (optional)" invalid="{invalid["nickname"]}" bind:value={$origAddress.nickname}/>
  <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Submit</Label></Button>
</form>
<Button color="gray" class="submitButton" variant="unelevated"  on:click={previousStep} ><Label class="submitButtonLabel">Previous Step</Label></Button>
