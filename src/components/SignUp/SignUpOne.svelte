<script>
  import { validUser, user, smartIDOptions, stepOneComplete } from '../../routes/utils/stores.js';
	import ListErrors from '../ListErrors.svelte';
  import Textfield from '@smui/textfield/styled'
  import { Icon as CommonIcon } from '@smui/common';
  import Button, {Label} from '@smui/button';
  import IconButton from '@smui/icon-button';

  let errors = [];

  let invalidFName = false;
  let invalidLName = false;
  let invalidEmail = false;
  let invalidPhone = false;
  let invalidPassword = false;
  let invalidConfirmPassword = false;
  let invalidSmartID = false;

  let confirmPassword = '';
  
	function verify(event) {
    $user.phone = $user.phone.replace(/[()\- /]/gi, '')
    $validUser.validate($user, {abortEarly: false})
    .then(function() {
      if ($user.password == confirmPassword) {
        $stepOneComplete = true;
      } else {
        invalidConfirmPassword = true;
        errors = ['Passwords must match']
      }
    })
    .catch(function(err) {
      const tempErrors = [];
      invalidFName = false;
      invalidLName = false;
      invalidEmail = false;
      invalidPhone = false;
      invalidPassword = false;
      invalidConfirmPassword = false;
      invalidSmartID = false;
      for (const error of err.inner) {
        switch (error.path) {
          case "first_name":
            invalidFName = true;
            tempErrors.push(error.message);
            break;
          case "last_name":
            invalidLName = true;
            tempErrors.push(error.message);
            break;
          case "email":
            invalidEmail = true;
            tempErrors.push(error.message);
            break;
          case "phone":
            invalidPhone = true;
            tempErrors.push(error.message);
            break;
          case "password":
            invalidPassword = true;
            tempErrors.push(error.message);
            break;
          case "confirm_password":
            invalidConfirmPassword = true;
            tempErrors.push(error.message);
            break;
          case "smart_id":
            invalidSmartID = true;
            tempErrors.push(error.message);
            break;
          default:
            break;
        }
      }
      if ($user.password != confirmPassword) {
        invalidConfirmPassword = true;
        tempErrors.push('Passwords must match');
      }
      errors = tempErrors;
    });
  }

  // Create 3 new options for smartIDs
  const letters = 'ABCDEFGHJKLMNPQRTUVWXY1234567890';  // selection of A-Z & 0-9 (No I, S, Z, or O)
  function refreshSmartID(e) {
    e.preventDefault();
    let smartID1='';  // declare empty string
    let smartID2='';  // declare empty string
    let smartID3='';  // declare empty string

    for(var i = 0; i < 8; i++) {  // loop 8 times
        smartID1 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
        smartID2 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
        smartID3 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
    }
    $smartIDOptions = [smartID1, smartID2, smartID3];
  }
</script>

<style>
  form {
    width: 100%;
    max-width: 600px;
    text-align: center;
    margin: 0 auto;
  }

  label {
    display: inline-block;
    color: var(--primaryAccent);
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 4px;
    font-size: 1.2em;
    letter-spacing: 1.9px;
    line-height: 2;
    text-align: center;
  }

  label:hover {
    color: var(--primary);
  }

  .sectionLabel {
    display: inline-block;
    color: var(--primaryAccent);
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 4px;
    letter-spacing: 1.9px;
    line-height: 2;
    text-align: center;
    font-size: 1.4em;
  }

  .sectionLabel:hover {
    color: var(--primaryAccent);
  }

  .radioLabel {
    text-align: left;
    margin: 20px auto;
  }

  input[type=radio]::after {
    border-radius:100%;
  }

  input[type=radio] {
    width: 20px;
    height: 20px;
    border-radius:100%;
  }

  input[type="radio"]:checked {
    background-color: var(--primaryAccent);
  }

  #smartIDSection {
    text-align: center;
  }

  p.invalid {
    color: darkred;
  }

  .centerBlock {
    display: flex;
    justify-content: space-between;
  }
</style>

<ListErrors {errors}/>
<form on:submit|preventDefault={verify}>
  <div class="centerBlock">
    <Textfield input$autocomplete="given-name" name="first-name" variant="outlined" label="First name" bind:invalid="{invalidFName}" class="halfWidth {invalidFName ? "mdc-text-field--invalid" : ""}" bind:value={$user.first_name} required/>
    <Textfield input$autocomplete="family-name" variant="outlined" label="Last name" bind:invalid="{invalidLName}" class="halfWidth {invalidLName ? "mdc-text-field--invalid" : ""}" bind:value={$user.last_name} required/>
  </div>
  <Textfield input$autocomplete="phone" type="tel" variant="outlined" label="Phone" bind:invalid="{invalidPhone}" class="fullWidth {invalidPhone ? "mdc-text-field--invalid" : ""}" bind:value={$user.phone} required/>
  <Textfield variant="outlined" input$autocomplete="email" type="email" bind:invalid="{invalidEmail}" class="fullWidth {invalidEmail ? "mdc-text-field--invalid" : ""}" bind:value={$user.email} required>
    <svelte:fragment slot="label">
      <CommonIcon
        class="material-icons"
        style="font-size: 1em; line-height: normal; vertical-align: top;"
        >email</CommonIcon
      > Email
    </svelte:fragment>
  </Textfield>
  <Textfield variant="outlined" label="Password" bind:invalid="{invalidPassword}" class="fullWidth {invalidPassword ? "mdc-text-field--invalid" : ""}" type="password" bind:value={$user.password} required/>
  <Textfield variant="outlined" label="Confirm password" bind:invalid="{invalidConfirmPassword}" class="fullWidth {invalidConfirmPassword ? "mdc-text-field--invalid" : ""}" type="password" bind:value={confirmPassword} required/>
  <div id="smartIDSection">
    <p class="sectionLabel {invalidSmartID ? "invalid" : ""}">Select your smartID&trade;:  <IconButton class="material-icons" on:click={refreshSmartID}>refresh</IconButton></p>
    <br>
    {#each $smartIDOptions as smartIDOption}
      <label class="radioLabel"><input type="radio" value={smartIDOption} bind:group={$user.smart_id}>  {smartIDOption.substring(0, 4)}  {smartIDOption.substring(4)}</label>
      <br>
    {/each}
  </div>
  <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Next Step</Label></Button>
</form>