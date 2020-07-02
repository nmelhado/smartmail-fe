<script>
  import Button, {Label, Icon} from '@smui/button';
  import { createEventDispatcher } from 'svelte';
	import { get } from '../routes/utils/helper.js';

  export let page, limit, count, mobile;

  const dispatch = createEventDispatcher();

  function changePage() {
      dispatch('changePage');
  }

  const lastPage = Math.ceil(count/limit)
</script>

<style>
  .pagination {
    text-align: center;
    color: var(--gray);
  }

  .ellipses {
    cursor: default;
  }

  #mainButtons {
    width: 630px;
    display: inline-flex;
    justify-content: space-between;
    border: solid 1px var(--lightGray);
    border-radius: 0 0 20px 20px;
    border-top: none;
  }

  #mainButtonsM {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
  }

  .mobileButtons {
    cursor: pointer;
    padding: .2em;
    min-width: 25px;
  }
</style>

<div class="pagination">
  {#if mobile}
    <div id="mainButtonsM">
      {#if page == 1}
        <div class="mobileButtons" ><Label></Label></div>
        <div class="mobileButtons" on:click={() => {page = 1; changePage();}} disabled><Label style="color: var(--primaryAccent);">1</Label></div>
      {:else}
        <div class="mobileButtons" on:click={() => {page--; changePage();}}><Icon class="material-icons" style="color: var(--darkGray);">navigate_before</Icon></div>
        <div class="mobileButtons" on:click={() => {page = 1; changePage();}}><Label style="color: var(--darkGray);">1</Label></div>
      {/if}
      {#if page > 2}
        {#if page > 3}
          <span>. . .</span>
        {/if}
        <div class="mobileButtons" on:click={() => {page--; changePage();}}><Label style="color: var(--darkGray);">{page - 1}</Label></div>
      {/if}
      {#if page != 1 && page != lastPage}
        <div class="mobileButtons" ><Label style="color: var(--primaryAccent);">{page}</Label></div>
      {/if}
      {#if page < lastPage - 1}
        <div class="mobileButtons" on:click={() => {page++; changePage();}}><Label style="color: var(--darkGray);">{page + 1}</Label></div>
        {#if page < lastPage - 2}
          <span class="ellipses">. . .</span>
        {/if}
      {/if}
      {#if page == lastPage}
        <div class="mobileButtons" on:click={() => {page = lastPage; changePage();}} disabled><Label style="color: var(--primaryAccent);">{lastPage}</Label></div>
        <div class="mobileButtons" ><Label></Label></div>
      {:else}
        <div class="mobileButtons" on:click={() => {page = lastPage; changePage();}}><Label style="color: var(--darkGray);">{lastPage}</Label></div>
        <div class="mobileButtons" on:click={() => {page++; changePage();}}><Icon class="material-icons" style="color: var(--darkGray);">navigate_next</Icon></div>
      {/if}
    </div>
  {:else}
    <div id="mainButtons">
      {#if page == 1}
        <Button color="secondary" on:click={() => {}} disabled><Label></Label></Button>
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {page = 1; changePage();}} disabled><Label style="color: var(--primaryAccent);">1</Label></Button>
      {:else}
        <Button color="secondary" on:click={() => {page--; changePage();}}><Icon class="material-icons" style="color: var(--darkGray);">navigate_before</Icon></Button>
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {page = 1; changePage();}}><Label style="color: var(--darkGray);">1</Label></Button>
      {/if}
      {#if page > 2}
        {#if page > 4}
          <span>. . .</span>
        {/if}
        {#if page > 3}
          <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {page = page - 2; changePage();}}><Label style="color: var(--darkGray);">{page - 2}</Label></Button>
        {/if}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {page--; changePage();}}><Label style="color: var(--darkGray);">{page - 1}</Label></Button>
      {/if}
      {#if page != 1 && page != lastPage}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {}} disabled><Label style="color: var(--primaryAccent);">{page}</Label></Button>
      {/if}
      {#if page < lastPage - 1}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {page++; changePage();}}><Label style="color: var(--darkGray);">{page + 1}</Label></Button>
        {#if page < lastPage - 2}
          <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {page = page + 2; changePage();}}><Label style="color: var(--darkGray);">{page + 2}</Label></Button>
        {/if}
        {#if page < lastPage - 3}
          <span class="ellipses">. . .</span>
        {/if}
      {/if}
      {#if page == lastPage}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {page = lastPage; changePage();}} disabled><Label style="color: var(--primaryAccent);">{lastPage}</Label></Button>
        <Button color="secondary" on:click={() => {}} disabled><Label></Label></Button>
      {:else}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {page = lastPage; changePage();}}><Label style="color: var(--darkGray);">{lastPage}</Label></Button>
        <Button color="secondary" on:click={() => {page++; changePage();}}><Icon class="material-icons" style="color: var(--darkGray);">navigate_next</Icon></Button>
      {/if}
    </div>
  {/if}

</div>