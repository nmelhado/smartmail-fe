<script>
  import { validUser, user, smartIDOptions, stepOneComplete } from '../routes/stores.js';
	import ListErrors from './ListErrors.svelte';

  let errors, incomplete = [];
  
	function verify(event) {
    $validUser.validate($user, {abortEarly: false})
    .then(function() {
      $stepOneComplete = true;
      console.log("Finished Step One");
    })
    .catch(function(err) {
      const tempIncomplete = [];
      const tempErrors = [];
      for (const error of err.inner) {
        if (!tempIncomplete.includes(error.path)) {
          tempIncomplete.push(error.path);
          tempErrors.push(error.message);
        }
      }
      incomplete = tempIncomplete;
      errors = tempErrors;
    });
  }
</script>

<style>
  form {
    width: 100%;
    max-width: 900px;
  }

  input[type=text],
  input[type=email],
  input[type=password] {
    font-family: inherit;
    font-size: 1em;
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    box-sizing: border-box;
    border: 1px solid var(--lightGray);
    border-radius: 4px;
    transition: all 150ms ease;
    background: var(--white);
  }

  input::placeholder {
    color: var(--primaryAccentFade);
    font-style: italic;
  }

  input:focus::-webkit-input-placeholder { color:transparent; }
  input:focus:-moz-placeholder { color:transparent; } /* Firefox 18- */
  input:focus::-moz-placeholder { color:transparent; } /* Firefox 19+ */
  input:focus:-ms-input-placeholder { color:transparent; } /* oldIE ;) */

  input:focus {
    outline: none;
    box-shadow: 0 0 12px 0 var(--secondary);
    border-color: var(--gray);
  }

  input:disabled {
    color: #ccc;
  }

  /* Change Autocomplete styles in Chrome*/
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px rgb(248, 251, 255) inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* Change Autocomplete styles in Chrome*/
  input:-webkit-autofill:hover{
    -webkit-box-shadow: 0 0 0px 1000px rgb(248, 251, 255) inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  input[type=text].halfWidth {
    width: 49%;
    width: calc(50% - 2px);
  }

  button {
    color: var(--white);
    background-color: var(--primary);
    border: none;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    outline: none;
    border-radius: 4px;
    display: block;
    margin: 12px auto;
    line-height: 1.8;
    font-size: 1.3em;
    padding: 10px 18px;
    width: 100%;
    max-width: 340px;
    transition: all 150ms ease;
    cursor: pointer;
  }

  button:disabled {
    background-color: var(--gray);
  }

  button:focus:not(:disabled) {
    box-shadow: 0 0 12px 0 var(--secondary);
  }

  button:hover:not(:disabled) {
    background-color: var(--primaryAccent);
  }

  label {
    display: inline-block;
    color: var(--primaryAccent);
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 4px;
    text-transform: uppercase;
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

  input[type=text].incomplete,
  input[type=email].incomplete,
  input[type=password].incomplete {
    border: 1px solid darkred;
  }

  label.incomplete {
    color: darkred;
  }
</style>

<ListErrors {errors}/>
<form on:submit|preventDefault={verify}>
  <input class="halfWidth {incomplete.includes("first_name") ? "incomplete" : ""}" type="text" placeholder="Your First Name" bind:value={$user.first_name}>
  <input class="halfWidth {incomplete.includes("last_name") ? "incomplete" : ""}" type="text" placeholder="Your Last Name" bind:value={$user.last_name}>
  <input class="{incomplete.includes("phone") ? "incomplete" : ""}" type="text" placeholder="Phone" bind:value={$user.phone}>
  <input class="{incomplete.includes("email") ? "incomplete" : ""}" type="email" placeholder="Email" bind:value={$user.email}>
  <input class="{incomplete.includes("password") ? "incomplete" : ""}" type="password" placeholder="Password" bind:value={$user.password}>
  <div id="smartIDSection">
    <label class="sectionLabel {incomplete.includes("smart_id") ? "incomplete" : ""}">Select your smartID:</label>
    <br>
    {#each $smartIDOptions as smartIDOption}
      <label class="radioLabel"><input type="radio" value={smartIDOption} bind:group={$user.smart_id}>  {smartIDOption}</label>
      <br>
    {/each}
  </div>
  <button>
    Next Step
  </button>
</form>