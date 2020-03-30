<script>
  import { addressStepOneComplete } from '../routes/stores.js';
  import AddressChangeOne from './AddressChangeOne';
  import Paper from '@smui/paper';
  
</script>

<style>
  #paper-back {
    position: fixed;
    background-color: rgba(80, 80, 80, 0.3);
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 95;
  }

  #paper-holder {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 96;
  }
</style>

<div id="paper-back">
  <div id="paper-holder">
    <Paper>
      {#if !$addressStepOneComplete}
        <AddressChangeOne />
      {:else}
      {/if}
    </Paper>
  </div>
</div>