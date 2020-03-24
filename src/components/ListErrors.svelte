<script>
	export let errors;
</script>

<style>
	ul {
		margin: 0;
		padding: 0;
  }
  
  li {
    color: darkred;
    font-family: inherit;
    font-size: 1em;
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    box-sizing: border-box;
    border: 1px solid darkred;
    border-radius: 4px;
    transition: all 150ms ease;
    background: var(--veryLightGray);
    list-style-type: none;
  }
</style>

{#if errors}
	<ul class="error-messages">
		{#each errors as error}
			<li>{error}</li>
		{/each}
	</ul>
{/if}