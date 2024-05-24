<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let token: string;
	let newPassword: string;
	let confirmPassword: string;
	let message: string;
	let processing = false;

	onMount(() => {
		token = $page.params.token;
	});

	async function resetPassword(event: Event) {
		event.preventDefault();

		if (newPassword !== confirmPassword) {
			message = "Passwords don't match";
			return;
		}

		processing = true;

		try {
			const response = await fetch(
				import.meta.env.VITE_BACKEND_URL + `/api/reset-password/${token}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ newPassword })
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Password reset failed');
			}

			message = data.message;
		} catch (error) {
			message = (error as Error).message;
		} finally {
			processing = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Your Password</title>
	<meta name="description" content="Reset Your Password" />
</svelte:head>

<div
	class="container mx-auto py-10 px-6 bg-gradient-to-r from-gray-900 to-green-700 text-white rounded-3xl shadow-lg opacity-80 w-full max-w-sm"
>
	<h1 class="text-3xl font-extrabold mb-6 text-center">Reset Your Password</h1>
	{#if message}
		{#if message.includes('Password has been reset successfully')}
			<p class="text-green-400 mb-4 text-center">{message}</p>
			<a class="text-blue-400 hover:text-blue-600 mb-4 block text-center" href="/login"
				>Login here!</a
			>
		{:else}
			<p class="text-red-400 mb-4 text-center">{message}</p>
		{/if}
	{/if}
	<form on:submit|preventDefault={resetPassword}>
		<div class="mb-6">
			<label for="newPassword" class="block text-sm font-medium text-gray-300">New Password:</label>
			<input
				type="password"
				id="newPassword"
				bind:value={newPassword}
				class="mt-1 block w-full border border-gray-600 rounded-lg p-2.5 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
				required
			/>
		</div>
		<div class="mb-6">
			<label for="confirmPassword" class="block text-sm font-medium text-gray-300"
				>Confirm New Password:</label
			>
			<input
				type="password"
				id="confirmPassword"
				bind:value={confirmPassword}
				class="mt-1 block w-full border border-gray-600 rounded-lg p-2.5 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
				required
			/>
		</div>
		<button
			type="submit"
			class="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150"
			disabled={processing}
		>
			{#if processing}Processing...{:else}Reset Password{/if}
		</button>
	</form>
</div>
