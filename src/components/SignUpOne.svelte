<script>
  import { validUser, user, smartIDOptions, stepOneComplete } from '../routes/stores.js';
	import ListErrors from './ListErrors.svelte';
  import Textfield from '@smui/textfield'
  import Icon from '@smui/textfield/icon/index';
  import Button, {Label} from '@smui/button';

  let errors = [];
  let invalid = {
    first_name: false,
    last_name: false,
    email: false,
    phone: false,
    password: false,
    smart_id: false,
  }
  
	function verify(event) {
    $user.phone = $user.phone.replace(/[()\- /]/gi, '')
    $validUser.validate($user, {abortEarly: false})
    .then(function() {
      $stepOneComplete = true;
      console.log("Finished Step One");
    })
    .catch(function(err) {
      const tempErrors = [];
      const tempInvalid = {
        first_name: false,
        last_name: false,
        email: false,
        phone: false,
        password: false,
        smart_id: false,
      };
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
</script>

<style>
  form {
    width: 100%;
    max-width: 900px;
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

  #smartIDSection {
    text-align: center;
  }

  label.invalid {
    color: darkred;
  }
</style>

<ListErrors {errors}/>
<form on:submit|preventDefault={verify}>
  <Textfield variant="outlined" label="First name" invalid="{invalid["first_name"]}" class="halfWidth" bind:value={$user.first_name}/>
  <Textfield variant="outlined" label="Last name" invalid="{invalid["last_name"]}" class="halfWidth" bind:value={$user.last_name}/>
  <Textfield variant="outlined" label="Phone" invalid="{invalid["phone"]}" class="fullWidth" bind:value={$user.phone}/>
  <Textfield variant="outlined" withLeadingIcon label="Email" type="email" invalid="{invalid["email"]}" class="fullWidth" bind:value={$user.email}>
     <Icon class="material-icons">email</Icon>
  </Textfield>
  <Textfield variant="outlined" label="Password" invalid="{invalid["password"]}" class="fullWidth" type="password" bind:value={$user.password}/>
  <div id="smartIDSection">
    <label class="sectionLabel {invalid["smart_id"] ? "invalid" : ""}">Select your smartID:</label>
    <br>
    {#each $smartIDOptions as smartIDOption}
      <label class="radioLabel"><input type="radio" value={smartIDOption} bind:group={$user.smart_id}>  {smartIDOption}</label>
      <br>
    {/each}
  </div>
  <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Next Step</Label></Button>
</form>