<script>
	import { goto, stores } from '@sapper/app';
  import { post } from '../routes/utils.js';
  import { address as origAddress, validAddress, addressStepTwoComplete, addressStepThreeComplete, address_type, start_date, end_date } from '../routes/stores.js';
	import ListErrors from './ListErrors.svelte';
  import Textfield from '@smui/textfield'
  import Select, {Option} from '@smui/select';
  import Button, {Label} from '@smui/button';
  import {Title as PaperTitle, Subtitle, Content} from '@smui/paper';
  import { createEventDispatcher } from 'svelte';

  const { session } = stores();

  const dispatch = createEventDispatcher();

  function processNewMonth() {
      dispatch('processNewMonth');
  }

  if (!$origAddress.delivery_instructions) {
    $origAddress.delivery_instructions = '';
  }
  
  export let cancel;

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
  let address;

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

  export let submitErrors, errorsPresent;
	async function submit() {
		const response = await post(`manage/change_address`, { address, status: $address_type, start_date: $start_date, end_date: $end_date });

		// TODO handle network errors
		submitErrors = response.error;

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
      errorsPresent.open();
    }
  }
  
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
    $addressStepTwoComplete = false;
  }

</script>

<style>
  .alignRight {
    text-align: right;
  }

  #tight {
    width: 80%;
    margin: 0 auto;
  }

  .centerBlock {
    display: flex;
    justify-content: space-between;
  }
</style>

<div id="paper-inner">
  <PaperTitle>Create an Address Change</PaperTitle>
  <Content>
    <p>(Step 3 of 3) Please provide the new address information:</p>
    <ListErrors {errors}/>
    <form on:submit|preventDefault={verify}>
      <div id="tight">
        <Textfield  class="fullWidth" variant="outlined" label="Address line 1" invalid="{invalid["line_one"]}" bind:value={$origAddress.line_one}/>
        <Textfield  class="fullWidth" variant="outlined" label="Address line 2 (optional)" invalid="{invalid["line_two"]}" bind:value={$origAddress.line_two}/>
        <Textfield  class="fullWidth" variant="outlined" label="Unit number (optional)" invalid="{invalid["unit_number"]}" bind:value={$origAddress.unit_number}/>
        <Textfield  class="fullWidth" variant="outlined" label="Business name (optional)" invalid="{invalid["business_name"]}" bind:value={$origAddress.business_name}/>
        <Textfield  class="fullWidth" variant="outlined" label="Attention to (optional)" invalid="{invalid["attention_to"]}" bind:value={$origAddress.attention_to}/>
        <div class="centerBlock">
          <Textfield class="thirdWidth" variant="outlined" label="City" invalid="{invalid["city"]}" bind:value={$origAddress.city}/>
          <Select variant="outlined" class="thirdWidth" invalid="{invalid["state"]}" bind:value={$origAddress.state} label="State">
            {#each states as state}
              <Option value={state} selected={$origAddress.state === state}>{state}</Option>
            {/each}
          </Select>
          <Textfield class="thirdWidth" variant="outlined" label="Zip Code" invalid="{invalid["zip_code"]}" bind:value={$origAddress.zip_code}/>
        </div>
        <Textfield  class="fullWidth" variant="outlined" label="Country" invalid="{invalid["country"]}" bind:value={$origAddress.country}/>
        <Textfield  class="fullWidth" variant="outlined" label="Address specific phone number (optional)" invalid="{invalid["phone"]}" bind:value={$origAddress.phone}/>
        <Textfield  class="fullWidth" variant="outlined" label="Package delivery instructions (optional)" invalid="{invalid["delivery_instructions"]}" bind:value={$origAddress.delivery_instructions}/>
        <Textfield  class="fullWidth" variant="outlined" label="Address nickname (optional)" invalid="{invalid["nickname"]}" bind:value={$origAddress.nickname}/>
      </div>
      <div class="alignRight">
        <Button color="secondary" class="tightButton" variant="unelevated"><Label class="tightButtonLabel">Submit</Label></Button>
      </div>
    </form>
    <div class="alignRight">
      <Button color="gray" class="tightButton" variant="unelevated"  on:click={previousStep} ><Label class="tightButtonLabel">Previous Step</Label></Button>
    </div>
  </Content>
</div>
