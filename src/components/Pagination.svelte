<script context="module">
	let totalComponents = 0;
	export function paginate(items, currentPage, pageSize) {
		return items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	}
</script>

<script>
  import Button, {Label, Icon} from '@smui/button';

  export let currentPage, pageSize, itemsLength, togglePageNumbers;

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
</style>

<div class="pagination">
  {#if currentPage == 1}
    <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = 1}} disabled><Label style="color: var(--primaryAccent);">1</Label></Button>
  {:else}
    <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = 1}}><Label style="color: var(--darkGray);">1</Label></Button>
  {/if}
  {#if currentPage > 2}
    {#if currentPage > 4}
      <span>. . .</span>
    {/if}
    {#if currentPage > 3}
      <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = currentPage - 2}}><Label style="color: var(--darkGray);">{currentPage - 2}</Label></Button>
    {/if}
    <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage--}}><Label style="color: var(--darkGray);">{currentPage - 1}</Label></Button>
  {/if}
  {#if currentPage != 1 && currentPage != lastPage}
    <Button color="secondary" on:click={() => {}} disabled><Label style="color: var(--primaryAccent);">{currentPage}</Label></Button>
  {/if}
  {#if currentPage < lastPage - 1}
    <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage++}}><Label style="color: var(--darkGray);">{currentPage + 1}</Label></Button>
    {#if currentPage < lastPage - 2}
      <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = currentPage + 2}}><Label style="color: var(--darkGray);">{currentPage + 2}</Label></Button>
    {/if}
    {#if currentPage < lastPage - 3}
      <span class="ellipses">. . .</span>
    {/if}
  {/if}
  {#if currentPage == lastPage}
    <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = lastPage}} disabled><Label style="color: var(--primaryAccent);">{lastPage}</Label></Button>
  {:else}
    <Button color="secondary" on:click={() => {togglePageNumbersFunc(); currentPage = lastPage}}><Label style="color: var(--darkGray);">{lastPage}</Label></Button>
  {/if}
</div>