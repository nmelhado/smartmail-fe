<script>
	import { goto, stores } from '@sapper/app';
	import Account from '../../components/Account.svelte'; 

  const { session } = stores();

  if (!$session.user || !$session.user.first_name || $session.user.first_name == "") {
    goto('login');
  }
</script>


{#if $session.user}
  <Account />
{/if}