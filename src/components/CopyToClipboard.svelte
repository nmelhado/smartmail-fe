<script>
  import { createEventDispatcher } from "svelte";
  import IconButton from '@smui/icon-button';

  export let text;

  const dispatch = createEventDispatcher();

  const copy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => dispatch("copy"), e => dispatch("fail"));
  };
</script>

<style>
  .smartIDSpacer {
    margin-right: 0.4em; 
  }
/* Paste these in the parent style section */
  /* * :global(.material-icons) {
    vertical-align: sub;
  }

  * :global(.copy-icons) {
    color: var(--gray);
  } */

</style>

<span on:click={copy}><strong><span class="smartIDSpacer">{text.substring(0, 4)}</span>{text.substring(4)}</strong></span>
<IconButton class="material-icons copy" on:click={copy}>content_copy</IconButton>