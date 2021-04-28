<script>
	import { goto, stores } from '@sapper/app';
	import ListErrors from '../../components/ListErrors.svelte';
	import { post } from '../utils/helper.js';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield';
  // import Icon from '@smui/textfield/icon/index';  
  import Button, {Label} from '@smui/button';
  import Dialog, {Content, Title, Actions, InitialFocus} from '@smui/dialog';
  import queryString from "query-string"

  let queryParams;

  if(typeof window !== 'undefined') {
    queryParams = queryString.parse(window.location.search)
    if (!queryParams.token || queryParams.token == "") {
      goto('forgot-password')
    }
  }

	const { session } = stores();

  let successUser = {
    name: ''
  }

  let passwordInfo = {
    password: '',
    verifyPassword: ''
  }

  let submitErrors;
  
  const validPassword = yup.object().shape({
    password: yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must be shorter than 30 characters"),
    verifyPassword: yup.string()
  });
  
  let errors = [];
  let invalid = {
    password: false,
    matching: false
  };
  
  function verify(event) {
    validPassword.validate(passwordInfo)
    .then(function() {
      if (passwordInfo.password == passwordInfo.verifyPassword) {
        invalid['matching'] = false;
        submit();
      } else {
        invalid['matching'] = true;
        errors = ['Passwords must match']
      }
    })
    .catch(function(err) {
      const tempInvalid = {
        password: false,
        matching: false
      };
      const tempErrors = [];
      for (const error of err.inner) {
        if (!tempInvalid[error.path]) {
          tempInvalid[error.path] = true;
          tempErrors.push(error.message);
        }
      }
      if (passwordInfo.password == passwordInfo.verifyPassword) {
        invalid['matching'] = true;
        errors = ['Passwords must match']
      }
      invalid = tempInvalid;
      errors = tempErrors;
    });
  }

	async function submit() {
		const response = await post(`api/auth/reset-password`, { password: passwordInfo.password, token: queryParams.token });

    submitErrors = response.error;
    console.log(submitErrors)

		if (response.success) {
      successUser.name = response.name;
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
	<title>smartmail - Reset Password</title>
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
  <Title id="event-title">Password Reset Successfully</Title>
  <Content id="dialog-content">Thanks {successUser.name}. Your password has been reset.</Content>
  <Actions>
    <Button touch color="secondary" variant="outlined" on:click={login} default use={[InitialFocus]}>
      <Label>Back to Log In</Label>
    </Button>
  </Actions>
</Dialog>

<div class="auth-page">
	<div class="container page">
    <h1>Reset Your Password</h1>
    <p id="logInLink">
      <a href="/login">Don't need to reset your password? Go back to Log In</a>
    </p>

    <ListErrors {errors}/>

    <form on:submit|preventDefault={verify}>
      <Textfield variant="outlined" label="Password" bind:invalid="{invalid["password"]}" class="fullWidth" type="password" bind:value={passwordInfo.password}/>
      <Textfield variant="outlined" label="Confirm password" bind:invalid="{invalid["matching"]}" class="fullWidth" type="password" bind:value={passwordInfo.verifyPassword}/>
      <br>
      <Button touch color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Reset Password</Label></Button>
    </form>
	</div>
</div>