<script>
  import { address as origAddress, validAddress, addressStepTwoComplete, addressStepThreeComplete, address_type, start_date, end_date } from '../../routes/utils/stores.js';
	import ListErrors from '../ListErrors.svelte';
  import Textfield from '@smui/textfield'
  import Select, {Option} from '@smui/select';
  import Dialog, {Title, Content as DialogContent, Actions, InitialFocus} from '@smui/dialog';
  import Button, {Label} from '@smui/button';
  import { post } from '../../routes/utils/helper.js';
  import {Title as PaperTitle, Subtitle, Content} from '@smui/paper';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function processNewMonth() {
      dispatch('processNewMonth');
  }

  if (!$origAddress.delivery_instructions) {
    $origAddress.delivery_instructions = '';
  }
  
  // export let cancel;

  let errors = [];
  let invalid = {
    line_one: false,
    line_two: false,
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

  export let addressValidationError, startCompare, compareAddress, loading;

	async function verifyAddress(testAddress) {
    loading = true;
    const response = await post(`api/manage/verify_address`, testAddress);
    loading = false;
    if (response["0"]) {
      addressValidationError.open();
    } else {
      compareAddress = JSON.parse(JSON.stringify(testAddress));
      compareAddress.line_one = response.street1;
      compareAddress.line_two = response.street2;
      compareAddress.zip_code = `${response.zip.split("-")[0]}-${response.Zip4}`;
      compareAddress.city = response.city;

      startCompare.open();
    }
  }
  
	function verify(event) {
    $validAddress.validate($origAddress, {abortEarly: false})
    .then(function() {
      verifyAddress($origAddress);
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
        <Textfield input$name="address-1" class="fullWidth" variant="outlined" label="Address line 1" invalid="{invalid["line_one"]}" bind:value={$origAddress.line_one}/>
        <Textfield input$name="address-2" class="fullWidth" variant="outlined" label="Address line 2 (optional)" invalid="{invalid["line_two"]}" bind:value={$origAddress.line_two}/>
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
