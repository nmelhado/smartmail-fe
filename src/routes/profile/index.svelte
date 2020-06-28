<script>
	import { goto, stores } from '@sapper/app';
  import { get } from '../utils/helper.js';
	import Profile from '../../components/Profile/Profile.svelte'; 
	import ProfileMobile from '../../components/Profile/ProfileMobile.svelte'; 

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
    <ProfileMobile checkConnection={checkConnection}/>
  {:else}
    <Profile checkConnection={checkConnection}/>
  {/if}
{/if}