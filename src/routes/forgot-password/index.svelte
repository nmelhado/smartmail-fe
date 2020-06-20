<script>
	import { goto, stores } from '@sapper/app';
	import ListErrors from '../../components/ListErrors.svelte';
	import { post } from '../utils/helper.js';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield'
  import Icon from '@smui/textfield/icon/index';  
  import Button, {Label} from '@smui/button';
  import Dialog, {Content, Title, Actions, InitialFocus} from '@smui/dialog';

	const { session } = stores();

  let user = {
    email: ''
  }

  let successUser = {
    email: '',
    name: ''
  }

  let submitErrors;
  
  const validUser = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is not valid")
  });
  
  let errors = [];
  let invalidEmail = false;
  
  function verify(event) {
    validUser.validate(user)
    .then(function() {
      submit();
    })
    .catch(function(err) {
      invalidEmail = false;
      const tempErrors = [];
      for (const error of err.inner) {
        invalidEmail = true;
        tempErrors.push(error.message);
      }
      errors = tempErrors;
    });
  }

	async function submit() {
		const response = await post(`api/auth/forgot-password`, { email: user.email });

		// TODO handle network errors
    submitErrors = response.error;
    console.log(submitErrors)

		if (response.success) {
      successUser.name = response.name;
      successUser.email = user.email;
      resetSuccess.open()
		}
    if (submitErrors != null) {
      errorsPresent.open()
    }
  }
  let errorsPresent, resetSuccess;

  function login() {
    goto('login');
  }

</script>
<style>
  form {
    width: 100%;
    max-width: 900px;
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    margin: 1em 0 2em;
  }

  #logInLink {
    text-align: center;
    color: var(--secondaryAccent)
  }
</style>

<svelte:head>
	<title>smartmail - Forgot Password</title>
</svelte:head>

<!-- Error Dialog -->
<Dialog bind:this={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" >
  <Title id="event-title">{submitErrors}</Title>
  <Actions>
    <Button action="all" default use={[InitialFocus]}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>

<!-- Success Dialog -->
<Dialog bind:this={resetSuccess} aria-labelledby="event-title" aria-describedby="event-content">
  <Title id="event-title">Password Reset Requested</Title>
  <Content id="dialog-content">Sorry you forgot your password, {successUser.name}. We've sent a password reset email to: {successUser.email}<br><br>Please use the link in the email to reset your password within the hour.</Content>
  <Actions>
    <Button color="secondary" variant="outlined" on:click={login} default use={[InitialFocus]}>
      <Label>Back to Log In</Label>
    </Button>
  </Actions>
</Dialog>

<div class="auth-page">
	<div class="container page">
    <h1>Forgot Your Password</h1>
    <p id="logInLink">
      <a href="/login">Know your password? Go back to Log In</a>
    </p>

    <ListErrors {errors}/>

    <form on:submit|preventDefault={verify}>
      <Textfield input$name="email" variant="outlined" withLeadingIcon label="Email associated with your account" type="email" invalid="{invalidEmail}" class={$session.mobile ? "fullWidth" : "halfWidth"} bind:value={user.email}>
        <Icon class="material-icons">email</Icon>
      </Textfield>
      <br>
      <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Reset Password</Label></Button>
    </form>
	</div>
</div>