<script>
	import { goto, stores } from '@sapper/app';
	import { post } from '../routes/utils/helper.js';
  import Button, {Label, Group} from '@smui/button';

  const { session } = stores();

  export let exclude;

	function dashboard() {
    goto('/dashboard');
  }

	function myAccount() {
    goto('/account');
  }

	function contacts() {
    goto('/my_contacts');
  }

	function tracking() {
    goto('/tracking');
  }

	async function logout(event) {
		await post(`api/auth/logout`);
    $session.user = null;
    $session.addresses = null;
    $session.contacts = null;
    goto('/');
  }
</script>

<style>
  #accountButtons {
    margin: 1em 0 3em;
    text-align: center;
  }

  @media (max-width: 824px) {
    #accountButtons {
      display: none;
    }
  }

</style>

<div id="accountButtons">
  <Group variant="outlined">
    {#if exclude != "dashboard"}
      <Button color="secondary" on:click={dashboard} variant="outlined"><Label>Dashboard</Label></Button>
    {/if}
    {#if exclude != "account"}
      <Button color="secondary" on:click={myAccount} variant="outlined"><Label>Manage Account</Label></Button>
    {/if}
    {#if exclude != "my_contacts"}
      <Button color="secondary" on:click={contacts} variant="outlined"><Label>My Contacts</Label></Button>
    {/if}
    {#if exclude != "tracking"}
      <Button color="secondary" on:click={tracking} variant="outlined"><Label>Tracking</Label></Button>
    {/if}
    <Button color="secondary" on:click={logout} variant="outlined"><Label>Log Out</Label></Button>
  </Group>
</div>