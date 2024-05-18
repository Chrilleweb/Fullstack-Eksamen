<script lang="ts">
	import { writable } from 'svelte/store';
	import BackArrow from '../../components/backArrow.svelte';

	let email: string = '';
	let message = writable('');
	let loading = writable(false);

	async function handleResetRequest(event: Event) {
		event.preventDefault();
		loading.set(true);
		message.set('');

		try {
			const response = await fetch('http://localhost:8080/api/request-reset', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || 'Failed to send reset email');
			}

			message.set(data.message);
		} catch (error) {
			message.set((error as Error).message);
		} finally {
			loading.set(false);
		}
	}
</script>

<svelte:head>
	<title>Reset Password</title>
</svelte:head>

<div class="mt-40 mx-auto bg-white p-6 rounded-md shadow-md w-full max-w-sm">
	<h1 class="text-2xl font-semibold mb-4 text-center">Reset Password</h1>
	{#if $message}
		<p class="toast show">{$message}</p>
	{/if}
	<form on:submit={handleResetRequest}>
		<div class="mb-6">
			<label for="email" class="block text-sm font-medium text-gray-600">Email:</label>
			<input
				type="email"
				id="email"
				name="email"
				autocomplete="email"
				class="form-input mt-1 block w-full border rounded-md p-2"
				bind:value={email}
				required
			/>
		</div>
		<button
			type="submit"
			class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
			disabled={$loading}
		>
			{#if $loading}
				Processing...
			{:else}
				Send Reset Link
			{/if}
		</button>
	</form>
	<BackArrow />
</div>
