<script>
	import { goto, stores } from '@sapper/app';
  import { get } from '../utils/helper.js';
	import Account from '../../components/Account/Account.svelte'; 
	import AccountMobile from '../../components/Account/AccountMobile.svelte'; 

  const { session } = stores();
  
  async function checkConnection() {
    try {
      const response = await get(`api/auth/check-credentials`);
      if (response && !response.ok) {
        delete($session.user);
        delete($session.addresses);
        goto('login');
      }
    } catch(err) {
      console.log(err);
    }
  }
  checkConnection();
</script>


{#if $session.user}
  {#if $session.mobile}
    <AccountMobile checkConnection={checkConnection}/>
  {:else}
    <Account checkConnection={checkConnection}/>
  {/if}
{/if}