<script>
	import { stores } from '@sapper/app';
  import { post } from '../../routes/utils/helper.js';
	import ListErrors from '../ListErrors.svelte';
  import Textfield from '@smui/textfield';
  import Button, {Label} from '@smui/button';
  import Dialog, {Title, Content, Actions, InitialFocus} from '@smui/dialog';
  import Loading from '../Loading.svelte';
  import * as yup from 'yup';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function refreshPage() {
      dispatch('refreshPage');
  }

	const { session } = stores();
  let errors = [];
  let invalid = {
    smart_id: false,
    email: false,
    phone: false,
  }

  let contact = {
    smart_id: "",
    email: "",
    phone: "",
  }

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validContact =yup.object().shape({
    smart_id: yup.string()
      .required("Please select your smartID")
      .test('len', 'smartIDs should contain 8 characters', val => val.replace(/\s/g, '').length === 8),
    email: yup.string().email("Email is not valid"),
    // phone: yup.string().matches(phoneRegExp, "Phone number is not valid"),
    phone: yup.string(),
  });

  let loading = false;

  let submitErrors;
  
	function verify(event) {
    contact.phone = contact.phone.replace(/[()\- /]/gi, '')
    validContact.validate(contact, {abortEarly: false})
    .then(function() {
      contact.smart_id = contact.smart_id.replace(/\s/g, '');
      submit();
    })
    .catch(function(err) {
      const tempInvalid = {
        smart_id: false,
        email: false,
        phone: false,
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
    })
  }

	async function submit() {
    loading= true;
		const response = await post(`api/manage/add_contact`, { contact });

		// TODO handle network errors
		submitErrors = response.error;

		if (response.contact) {
      refreshPage()
		}
    loading= false;
    if (submitErrors != null) {
      errorsPresent = true;
    }
  }

  let errorsPresent = false;
</script>

<style>
  form {
    width: 100%;
    max-width: 400px;
    text-align: center;
    padding: 2em 0;
    border: solid 1px var(--lightGray);
    margin: 3em auto 1.5em;
    color: var(--gray);
  }

  * :global(.formInputs) {
    width: 90%;
  }

  hr {
    height: 1px;
    color: var(--primaryAccentFade);
    background-color: var(--primaryAccentFade);
    border: none;
    margin: 1.5em 0;
  }
  p {
    margin: 1em auto;
    padding: 0;
  }
</style>

{#if loading}
  <Loading />
{/if}

<!-- Error creating account -->
<Dialog bind:open={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" >
  <Title id="event-title">{submitErrors}</Title>
  <Actions>
    <Button touch default use={[InitialFocus]}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>

<ListErrors {errors}/>
<form on:submit|preventDefault={verify}>
  <Textfield class="formInputs" variant="outlined" label="smartID" bind:invalid="{invalid["smart_id"]}" bind:value={contact.smart_id}/>
  <hr/>
  <Textfield class="formInputs" variant="outlined" label="e-mail" bind:invalid="{invalid["email"]}" bind:value={contact.email}/>
  <p>or</p>
  <Textfield class="formInputs" variant="outlined" label="phone number" bind:invalid="{invalid["phone"]}" bind:value={contact.phone}/>
  <Button touch color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Add Contact</Label></Button>
</form>