<script>
	import SignUpOne from '../../components/SignUpOne.svelte';
	import SignUpTwo from '../../components/SignUpTwo.svelte';
  import { stepOneComplete } from '../stores.js';

  $stepOneComplete = false;

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
</script>

<style>
  #loginLink {
    text-align: center;
    color: var(--secondaryAccent)
  }

  .auth-page {
    text-align: center;
  }
</style>

<svelte:head>
	<title>smartmail - Sign up</title>
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
          <SignUpTwo/>
        {/if}
			</div>
		</div>
	</div>
</div>