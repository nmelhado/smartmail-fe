<script>
	import { goto, stores } from '@sapper/app';
	import { post } from '../utils/helper.js';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text/index';
  import { Icon as CommonIcon } from '@smui/common';
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
  
  let emailError = "";
  let invalidEmail = false;
  
  function verify() {
    validUser.validate(user)
    .then(function() {
      submit();
    })
    .catch(function(err) {
      for (const error of err.errors) {
        invalidEmail = true;
        emailError = error;
      }
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
      resetSuccess = true;
		}
    if (submitErrors != null) {
      errorsPresent = true;
    }
  }
  let errorsPresent, resetSuccess = false;

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
<Dialog bind:open={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" >
  <Title id="event-title">{submitErrors}</Title>
  <Actions>
    <Button touch action="all" default use={[InitialFocus]}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>

<!-- Success Dialog -->
<Dialog bind:open={resetSuccess} aria-labelledby="event-title" aria-describedby="event-content">
  <Title id="event-title">Password Reset Requested</Title>
  <Content id="dialog-content">Sorry you forgot your password, {successUser.name}. We've sent a password reset email to: {successUser.email}<br><br>Please use the link in the email to reset your password within the hour.</Content>
  <Actions>
    <Button touch color="secondary" variant="outlined" on:click={login} default use={[InitialFocus]}>
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

    <form on:submit|preventDefault={verify}>
      <Textfield input$autocomplete="email" variant="outlined" type="email" bind:invalid="{invalidEmail}" class="{$session.mobile ? "fullWidth" : "halfWidth"}" bind:value={user.email} on:change={()=>invalidEmail=false}>
        <HelperText class="{$session.mobile ? "fullWidth" : "halfWidth"} errorHelper" validationMsg slot="helper">
          {emailError}
        </HelperText>
        <svelte:fragment slot="label">
          <CommonIcon
            class="material-icons"
            style="font-size: 1em; line-height: normal; vertical-align: top;"
            >email</CommonIcon
          > Email associated with your account
        </svelte:fragment>
      </Textfield>
      <br>
      <Button touch color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Reset Password</Label></Button>
    </form>
	</div>
</div>