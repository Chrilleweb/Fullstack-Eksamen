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
			const response = await fetch(`http://localhost:8080/api/reset-password/${token}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ newPassword })
			});

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
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="text-xl font-bold mb-3">Reset Your Password</h1>
	{#if message}
		{#if message.includes('Password has been reset successfully')}
			<p class="text-green-500 mb-4">{message}</p>
			<a class="text-blue-500 mb-4 block" href="/login">Login here!</a>
		{:else}
			<p class="text-red-500 mb-4">{message}</p>
		{/if}
	{/if}
	<form on:submit|preventDefault={resetPassword}>
		<div class="mb-4">
			<label for="newPassword" class="block text-sm font-medium text-gray-700">New Password:</label>
			<input
				type="password"
				id="newPassword"
				bind:value={newPassword}
				class="form-input mt-1 block w-full"
				required
			/>
		</div>
		<div class="mb-4">
			<label for="confirmPassword" class="block text-sm font-medium text-gray-700"
				>Confirm New Password:</label
			>
			<input
				type="password"
				id="confirmPassword"
				bind:value={confirmPassword}
				class="form-input mt-1 block w-full"
				required
			/>
		</div>
		<button
			type="submit"
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			disabled={processing}
		>
			{#if processing}Processing...{:else}Reset Password{/if}
		</button>
	</form>
</div>
