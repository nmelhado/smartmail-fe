<script>
  import { validUser, user, smartIDOptions, stepOneComplete } from '../../routes/utils/stores.js';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text/index';
  import { Icon as CommonIcon } from '@smui/common';
  import Button, {Label} from '@smui/button';
  import IconButton from '@smui/icon-button';

  let invalidFName = false;
  let fNameError = "";
  let invalidLName = false;
  let lNameError = "";
  let invalidEmail = false;
  let emailError = "";
  let invalidPhone = false;
  let phoneError = "";
  let invalidPassword = false;
  let passwordError = "";
  let invalidConfirmPassword = false;
  let confirmPasswordError = "";
  let invalidSmartID = false;
  // let smartIDError = "";

  let confirmPassword = '';
  
	function verify(event) {
    invalidFName = false;
    invalidLName = false;
    invalidEmail = false;
    invalidPhone = false;
    invalidPassword = false;
    invalidConfirmPassword = false;
    invalidSmartID = false;
    $user.phone = $user.phone.replace(/[()\- /]/gi, '')
    $validUser.validate($user, {abortEarly: false})
    .then(function() {
      if ($user.password == confirmPassword) {
        $stepOneComplete = true;
      } else {
        invalidConfirmPassword = true;
        confirmPasswordError = error.message;
      }
    })
    .catch(function(err) {
      for (const error of err.inner) {
        switch (error.path) {
          case "first_name":
            invalidFName = true;
            fNameError = error.message;
            break;
          case "last_name":
            invalidLName = true;
            lNameError = error.message;
            break;
          case "email":
            invalidEmail = true;
            emailError = error.message;
            break;
          case "phone":
            invalidPhone = true;
            phoneError = error.message;
            break;
          case "password":
            invalidPassword = true;
            passwordError = error.message;
            break;
          case "confirm_password":
            invalidConfirmPassword = true;
            confirmPasswordError = error.message;
            break;
          case "smart_id":
            invalidSmartID = true;
            // smartIDError = error.message;
            break;
          default:
            break;
        }
      }
      if ($user.password != confirmPassword) {
        invalidConfirmPassword = true;
        confirmPasswordError = error.message;
      }
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

<form on:submit|preventDefault={verify}>
  <div class="centerBlock">
    <div class="halfWidthContainer">
      <Textfield input$autocomplete="given-name" name="first-name" variant="outlined" label="First name" bind:invalid="{invalidFName}" class="fullWidth {invalidFName ? "mdc-text-field--invalid" : ""}" bind:value={$user.first_name} on:change={()=>invalidFName=false}>
        <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
          {fNameError}
        </HelperText>
      </Textfield>
    </div>
    <div class="halfWidthContainer">
      <Textfield input$autocomplete="family-name" variant="outlined" label="Last name" bind:invalid="{invalidLName}" class="fullWidth {invalidLName ? "mdc-text-field--invalid" : ""}" bind:value={$user.last_name} on:change={()=>invalidLName=false}>
        <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
          {lNameError}
        </HelperText>
      </Textfield>
    </div>
  </div>
  <Textfield input$autocomplete="phone" type="tel" variant="outlined" label="Phone" bind:invalid="{invalidPhone}" class="fullWidth {invalidPhone ? "mdc-text-field--invalid" : ""}" bind:value={$user.phone} on:change={()=>invalidPhone=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {phoneError}
    </HelperText>
  </Textfield>
  <Textfield variant="outlined" input$autocomplete="email" type="email" bind:invalid="{invalidEmail}" class="fullWidth {invalidEmail ? "mdc-text-field--invalid" : ""}" bind:value={$user.email} on:change={()=>invalidEmail=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {emailError}
    </HelperText>
    <svelte:fragment slot="label">
      <CommonIcon
        class="material-icons"
        style="font-size: 1em; line-height: normal; vertical-align: top;"
        >email</CommonIcon
      > Email
    </svelte:fragment>
  </Textfield>
  <Textfield variant="outlined" label="Password" bind:invalid="{invalidPassword}" class="fullWidth {invalidPassword ? "mdc-text-field--invalid" : ""}" type="password" bind:value={$user.password} on:change={()=>invalidPassword=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {passwordError}
    </HelperText>
  </Textfield>
  <Textfield variant="outlined" label="Confirm password" bind:invalid="{invalidConfirmPassword}" class="fullWidth {invalidConfirmPassword ? "mdc-text-field--invalid" : ""}" type="password" bind:value={confirmPassword} on:change={()=>invalidConfirmPassword=false}>
    <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
      {confirmPasswordError}
    </HelperText>
  </Textfield>
  <div id="smartIDSection">
    <p class="sectionLabel {invalidSmartID ? "invalid" : ""}">Select your smartID&trade;:  <IconButton class="material-icons" on:click={refreshSmartID}>refresh</IconButton></p>
    <br>
    {#each $smartIDOptions as smartIDOption}
      <label class="radioLabel"><input type="radio" value={smartIDOption} bind:group={$user.smart_id}  on:change={()=>invalidSmartID=false}>  {smartIDOption.substring(0, 4)}  {smartIDOption.substring(4)}</label>
      <br>
    {/each}
  </div>
  <Button touch color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Next Step</Label></Button>
</form>