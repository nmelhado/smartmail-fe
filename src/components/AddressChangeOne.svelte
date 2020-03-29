<script>
  import { addressType, addressStepOneComplete } from '../routes/stores.js';
  import Button, {Label} from '@smui/button';
  import Paper, {Title, Subtitle, Content} from '@smui/paper';
  import Chip, {Set, Icon, Checkmark, Text} from '@smui/chips';
  
  let error = false;
  const longTerm = "Long-term";
  const temporary = "Temporary"

	function verify(event) {
    if ($addressType == null || $addressType == "") {
      error = true;
      console.log("No option selected");
    } else {
      console.log("Completed step one");
      if ($addressType === longTerm) {
        $addressType = "long_term"
      } else if ($addressType === temporary) {
        $addressType = "temporary"
      }
      error = false;
      $addressStepOneComplete = true;
    }
  }
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

  #paper-inner {
    margin: 15px 55px;
  }

  #chip-holder {
    display: flex;
  }

  .error {
    color: darkred;
    border: solid 1px darkred;
  }
</style>

<div id="paper-back">
  <div id="paper-holder">
    <Paper>
      <div id="paper-inner">
        <Title>Create an Address Change</Title>
        <Content>
          {#if error}
            <p class="error">Please select the address change type:</p>
          {:else}
            <p>Please select the address change type:</p>
          {/if}
          <div id="chip-holder">
            <Set chips={[longTerm, temporary]} let:chip choice bind:selected={$addressType}>
              <Chip tabindex="0">{chip}</Chip>
            </Set>
          </div>
          <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel" on:click={verify}>Next Step</Label></Button>
        </Content>
        </div>
    </Paper>
  </div>
</div>