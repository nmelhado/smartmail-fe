<script context="module">
	let totalComponents = 0;
	export function paginate(items, currentPage, pageSize) {
		return items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	}
</script>

<script>
  import Button, {Label, Icon} from '@smui/button';

  export let currentPage, pageSize, itemsLength, togglePageNumbers, mobile;

  const lastPage = Math.ceil(itemsLength/pageSize)

  function togglePageNumbersFunc() {
    togglePageNumbers = togglePageNumbers == false;
  }
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
      {#if currentPage == 1}
        <div class="mobileButtons" ><Label></Label></div>
        <div class="mobileButtons" on:click={() => {togglePageNumbersFunc(); currentPage = 1}} disabled><Label style="color: var(--primaryAccent);">1</Label></div>
      {:else}
        <div class="mobileButtons" on:click={() => {togglePageNumbersFunc(); currentPage--}}><Icon class="material-icons" style="color: var(--darkGray);">navigate_before</Icon></div>
        <div class="mobileButtons" on:click={() => {togglePageNumbersFunc(); currentPage = 1}}><Label style="color: var(--darkGray);">1</Label></div>
      {/if}
      {#if currentPage > 2}
        {#if currentPage > 3}
          <span>. . .</span>
        {/if}
        <div class="mobileButtons" on:click={() => {togglePageNumbersFunc(); currentPage--}}><Label style="color: var(--darkGray);">{currentPage - 1}</Label></div>
      {/if}
      {#if currentPage != 1 && currentPage != lastPage}
        <div class="mobileButtons" ><Label style="color: var(--primaryAccent);">{currentPage}</Label></div>
      {/if}
      {#if currentPage < lastPage - 1}
        <div class="mobileButtons" on:click={() => {togglePageNumbersFunc(); currentPage++}}><Label style="color: var(--darkGray);">{currentPage + 1}</Label></div>
        {#if currentPage < lastPage - 2}
          <span class="ellipses">. . .</span>
        {/if}
      {/if}
      {#if currentPage == lastPage}
        <div class="mobileButtons" on:click={() => {togglePageNumbersFunc(); currentPage = lastPage}} disabled><Label style="color: var(--primaryAccent);">{lastPage}</Label></div>
        <div class="mobileButtons" ><Label></Label></div>
      {:else}
        <div class="mobileButtons" on:click={() => {togglePageNumbersFunc(); currentPage = lastPage}}><Label style="color: var(--darkGray);">{lastPage}</Label></div>
        <div class="mobileButtons" on:click={() => {togglePageNumbersFunc(); currentPage++}}><Icon class="material-icons" style="color: var(--darkGray);">navigate_next</Icon></div>
      {/if}
    </div>
  {:else}
    <div id="mainButtons">
      {#if currentPage == 1}
        <Button color="secondary" on:click={() => {}} disabled><Label></Label></Button>
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = 1}} disabled><Label style="color: var(--primaryAccent);">1</Label></Button>
      {:else}
        <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage--}}><Icon class="material-icons" style="color: var(--darkGray);">navigate_before</Icon></Button>
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = 1}}><Label style="color: var(--darkGray);">1</Label></Button>
      {/if}
      {#if currentPage > 2}
        {#if currentPage > 4}
          <span>. . .</span>
        {/if}
        {#if currentPage > 3}
          <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = currentPage - 2}}><Label style="color: var(--darkGray);">{currentPage - 2}</Label></Button>
        {/if}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage--}}><Label style="color: var(--darkGray);">{currentPage - 1}</Label></Button>
      {/if}
      {#if currentPage != 1 && currentPage != lastPage}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {}} disabled><Label style="color: var(--primaryAccent);">{currentPage}</Label></Button>
      {/if}
      {#if currentPage < lastPage - 1}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage++}}><Label style="color: var(--darkGray);">{currentPage + 1}</Label></Button>
        {#if currentPage < lastPage - 2}
          <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = currentPage + 2}}><Label style="color: var(--darkGray);">{currentPage + 2}</Label></Button>
        {/if}
        {#if currentPage < lastPage - 3}
          <span class="ellipses">. . .</span>
        {/if}
      {/if}
      {#if currentPage == lastPage}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = lastPage}} disabled><Label style="color: var(--primaryAccent);">{lastPage}</Label></Button>
        <Button color="secondary" on:click={() => {}} disabled><Label></Label></Button>
      {:else}
        <Button style="padding: 0; width: 48px;"  color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = lastPage}}><Label style="color: var(--darkGray);">{lastPage}</Label></Button>
        <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage++}}><Icon class="material-icons" style="color: var(--darkGray);">navigate_next</Icon></Button>
      {/if}
    </div>
  {/if}

</div>