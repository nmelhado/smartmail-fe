<script>
	import { goto, stores } from '@sapper/app';
  import { get } from '../utils.js';
	import Account from '../../components/Account.svelte'; 

  const { session } = stores();
  
  async function checkConnection() {
    try {
      const response = await get(`auth/check-credentials`);
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
  <Account checkConnection={checkConnection}/>
{/if}