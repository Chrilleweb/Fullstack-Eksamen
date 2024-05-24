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
			const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/request-reset', {
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
	<meta name="description" content="Request Reset Password" />
</svelte:head>
<div class="container mx-auto py-10 max-w-sm">
	<div
		class="py-10 px-6 bg-gradient-to-r from-gray-900 to-green-700 text-white rounded-3xl shadow-lg opacity-80 w-full max-w-sm"
	>
		<h1 class="text-3xl font-extrabold mb-6 text-center">Reset Password</h1>
		{#if $message}
			<p class="toast show">{$message}</p>
		{/if}
		<form on:submit={handleResetRequest}>
			<div class="mb-6">
				<label for="email" class="block text-sm font-medium text-gray-300">Email:</label>
				<input
					type="email"
					id="email"
					name="email"
					autocomplete="email"
					class="mt-1 block w-full border border-gray-600 rounded-lg p-2.5 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
					bind:value={email}
					required
				/>
			</div>
			<button
				type="submit"
				class="w-full bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
				disabled={$loading}
			>
				{#if $loading}
					Processing...
				{:else}
					Send Reset Link
				{/if}
			</button>
		</form>
	</div>
	<BackArrow />
</div>
