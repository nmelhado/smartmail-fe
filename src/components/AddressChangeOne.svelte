<script>
  import { address_type, addressStepOneComplete } from '../routes/stores.js';
  import Button, {Label} from '@smui/button';
  import {Title, Subtitle, Content} from '@smui/paper';
  import Radio from '@smui/radio';
  import FormField from '@smui/form-field';
  
  let error = false;
  const longTerm = "Long-term";
  const temporary = "Temporary"

	function verify(event) {
    console.log("Hello");
    if ($address_type == null || $address_type == "") {
      error = true;
      console.log("No option selected");
    } else {
      console.log("Completed step one");
      error = false;
      $addressStepOneComplete = true;
    }
  }

</script>

<style>
  #paper-inner {
    margin: 15px 55px;
  }

  .error {
    color: darkred;
    border: solid 1px darkred;
  }

  .alignRight {
    text-align: right;
  }
</style>

<div id="paper-inner">
  <Title>Create an Address Change</Title>
  <Content>
    <p class="{error ? "error" : ""}">(Step 1 of 3) Please select the address change type:</p>
    <form on:submit|preventDefault={verify}>
      <FormField>
        <Radio bind:group={$address_type} value="long_term" />
        <span slot="label">{longTerm}</span>
      </FormField>
      <FormField>
        <Radio bind:group={$address_type} value="temporary" />
        <span slot="label">{temporary}</span>
      </FormField>
      <div class="alignRight">
        <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel" on:click={verify} diabled={$address_type == null || $address_type == "" ? true : false}>Next Step</Label></Button>
      </div>
    </form>
  </Content>
</div>