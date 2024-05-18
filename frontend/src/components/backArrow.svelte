<button
	on:click={() => window.history.back()}
	on:keydown={(event) => {
		if (event.key === 'Enter') window.history.back();
	}}
>
	<img class="mt-4" src="/svg/backArrow.svg" alt="Back" height="40" width="40" />
</button>
