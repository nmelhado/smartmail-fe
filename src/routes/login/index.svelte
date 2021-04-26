<script>
	import { goto, stores } from '@sapper/app';
	import ListErrors from '../../components/ListErrors.svelte';
	import { post } from '../utils/helper.js';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield/styled'
  import { Icon as CommonIcon } from '@smui/common';
  import Button, {Label} from '@smui/button';
  import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';

	const { session } = stores();

  let user = {
    email: '',
    password: ''
  }

  let submitErrors;
  
  const validUser = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is not valid"),
    password: yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must be shorter than 30 characters")
  });
  
  let errors = [];
  let invalidEmail = false;
  let invalidPassword = false;
  
  function verify(event) {
    validUser.validate(user, {abortEarly: false})
    .then(function() {
      submit();
    })
    .catch(function(err) {
      const tempInvalid = {
        email: false,
        password: false
      };
      const tempErrors = [];
      invalidEmail = false;
      invalidPassword = false;
      for (const error of err.inner) {
        switch (error.path) {
          case "email":
            invalidEmail = true;
            tempErrors.push(error.message);
            break;
          case "password":
            invalidPassword = true;
            tempErrors.push(error.message);
            break;
          default:
            break;
        }
      }
      errors = tempErrors;
    });
  }

	async function submit() {
		const response = await post(`api/auth/login`, { email: user.email, password: user.password });

		// TODO handle network errors
    submitErrors = response.error;
    console.log(submitErrors)

		if (response.user) {
			$session.user = response.user;
			$session.addresses = response.addresses;
			goto('dashboard');
		}
    if (submitErrors != null) {
      errorsPresent = true;
    }
  }
  let errorsPresent = false;
</script>
<style>
  form {
    width: 100%;
    max-width: 900px;
    text-align: center;
    margin: 0 auto;
  }

  .links {
    text-align: center;
    color: var(--secondaryAccent)
  }
</style>

<svelte:head>
	<title>smartmail - Sign in</title>
</svelte:head>

<Dialog bind:open={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" >
  <Title id="event-title">{submitErrors}</Title>
  <Actions>
    <Button action="all" default use={[InitialFocus]}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>

<div class="auth-page">
	<div class="container page">
    <h1>Sign In</h1>
    <p class="links">
      <a href="/sign-up">Need an account?</a>
    </p>

    <ListErrors {errors}/>

    <form on:submit|preventDefault={verify}>
      <Textfield variant="outlined" input$autocomplete="email" type="email" bind:invalid="{invalidEmail}" class="{$session.mobile ? "fullWidth" : "halfWidth"} {invalidEmail ? "mdc-text-field--invalid" : ""}" bind:value={user.email} required>
        <svelte:fragment slot="label">
          <CommonIcon
            class="material-icons"
            style="font-size: 1em; line-height: normal; vertical-align: top;"
            >email</CommonIcon
          > Email
        </svelte:fragment>
      </Textfield>
      <br>
      <Textfield variant="outlined" label="Password" bind:invalid="{invalidPassword}" class="{$session.mobile ? "fullWidth" : "halfWidth"} {invalidPassword ? "mdc-text-field--invalid" : ""}" type="password" bind:value={user.password} required/>
      <br>
      <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Sign In</Label></Button>
    </form>

    <p class="links">
      <a href="/forgot-password">Forgot your password?</a>
    </p>
	</div>
</div>