<script>
	import { goto, stores } from '@sapper/app';
	import ListErrors from '../../components/ListErrors.svelte';
	import { post } from '../utils.js';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield'
  import Icon from '@smui/textfield/icon/index';  
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
  let invalid = {
    email: false,
    password: false
  }
  
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

	async function submit() {
		const response = await post(`auth/login`, { email: user.email, password: user.password });

		// TODO handle network errors
    submitErrors = response.error;
    console.log(submitErrors)

		if (response.user) {
			$session.user = response.user;
			$session.addresses = response.addresses;
			$session.contacts = response.contacts;
			goto('account');
		}
    if (submitErrors != null) {
      errorsPresent.open()
    }
  }
  let errorsPresent;
</script>
<style>
  form {
    width: 100%;
    max-width: 900px;
    text-align: center;
    margin: 0 auto;
  }

  #signUpLink {
    text-align: center;
    color: var(--secondaryAccent)
  }
</style>

<svelte:head>
	<title>smartmail - Sign in</title>
</svelte:head>

<Dialog bind:this={errorsPresent} aria-labelledby="event-title" aria-describedby="event-content" >
  <Title id="event-title">{submitErrors}</Title>
  <Actions>
    <Button action="all" default use={[InitialFocus]}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>

<div class="auth-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-6 offset-md-3 col-xs-12">
				<h1 class="text-xs-center">Sign In</h1>
				<p id="signUpLink" class="text-xs-center">
					<a href="/sign-up">Need an account?</a>
				</p>

        <ListErrors {errors}/>

        <form on:submit|preventDefault={verify}>
          <Textfield input$name="email" variant="outlined" withLeadingIcon label="Email" type="email" invalid="{invalid["email"]}" class={$session.mobile ? "fullWidth" : "halfWidth"} bind:value={user.email}>
            <Icon class="material-icons">email</Icon>
          </Textfield>
          <br>
          <Textfield variant="outlined" label="Password" invalid="{invalid["password"]}" class={$session.mobile ? "fullWidth" : "halfWidth"} type="password" bind:value={user.password}/>
          <br>
          <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Sign In</Label></Button>
        </form>

			</div>
		</div>
	</div>
</div>