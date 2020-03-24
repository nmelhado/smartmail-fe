<script>
	import { goto, stores } from '@sapper/app';
	import SignUpOne from '../../components/SignUpOne.svelte';
  import { post } from '../utils.js';
  import { stepOneComplete } from '../stores.js';

  $stepOneComplete = false;

	const { session } = stores();
  let address ={
    nickname: '',
    line_one: '',
    line_two: null,
    unit_number: null,
    business_name: null,
    attention_to: null,
    city: '',
    state: '',
    zip_code: '',
    country: '',
    phone: null,
  };
  let status = '';
  let start_date = '';
	let errors = null;

	async function submit(event) {
		const response = await post(`http://localhost:8080/signup`, { user, address, status, start_date });

		// TODO handle network errors
		errors = response.errors;

		if (response.user) {
			$session.user = response.user;
			$session.token = response.token;
			$session.expires = response.expires;
			goto('/');
		}
	}
</script>

<style>
  #loginLink {
    text-align: center;
    color: var(--secondaryAccent)
  }
</style>

<svelte:head>
	<title>Sign up • Conduit</title>
</svelte:head>

<div class="auth-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-6 offset-md-3 col-xs-12">
				<h1 class="text-xs-center">Sign up</h1>
				<p id="loginLink">
					<a href="/login">Already have an account?</a>
				</p>

        {#if !$stepOneComplete}
          <SignUpOne/>
        {:else}
          <p>Step 2!</p>
        {/if}
			</div>
		</div>
	</div>
</div>