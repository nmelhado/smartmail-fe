<script>
	import { goto, stores } from '@sapper/app';
	import ListErrors from '../_components/ListErrors.svelte';
	import { post } from 'utils.js';

	const { session } = stores();

  let user = {
    smart_id: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
  };
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

<svelte:head>
	<title>Sign up • Conduit</title>
</svelte:head>

<div class="auth-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-6 offset-md-3 col-xs-12">
				<h1 class="text-xs-center">Sign up</h1>
				<p class="text-xs-center">
					<a href="/login">Have an account?</a>
				</p>

				<ListErrors {errors}/>

				<form on:submit|preventDefault={submit}>
					<fieldset class="form-group">
						<input class="form-control form-control-lg" type="text" placeholder="Your First Name" bind:value={user.first_name}>
					</fieldset>
					<fieldset class="form-group">
						<input class="form-control form-control-lg" type="text" placeholder="Your Last Name" bind:value={user.last_name}>
					</fieldset>
					<fieldset class="form-group">
						<input class="form-control form-control-lg" type="text" placeholder="Phone" bind:value={user.phone}>
					</fieldset>
					<fieldset class="form-group">
						<input class="form-control form-control-lg" type="text" placeholder="Email" bind:value={user.email}>
					</fieldset>
					<fieldset class="form-group">
						<input class="form-control form-control-lg" type="password" placeholder="Password" bind:value={user.password}>
					</fieldset>
					<button class="btn btn-lg btn-primary pull-xs-right">
						Sign up
					</button>
				</form>
			</div>
		</div>
	</div>
</div>