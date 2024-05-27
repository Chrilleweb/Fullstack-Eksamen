<script lang="ts">
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '../../stores/auth';
	import { loadingBar } from '../../stores/loadingStore';
	let username: string = '';
	let password: string = '';
	let message: string = '';
	let loading: boolean = false; // Loading state

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true; // Start loading
		loadingBar.set(true); // Start loading bar

		try {
			const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			if (response.status === 429) {
				message = 'Too many attempts. Try again later.';
				throw new Error(message);
			}

			const data = await response.json();

			message = data.message;

			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}

			localStorage.setItem('token', data.token);
			isAuthenticated.set(true);
			goto('/');
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			loading = false; // End loading
			loadingBar.set(false); // End loading bar
		}
	}

	function handleForgotPassword() {
		goto('/request-reset');
	}
</script>

<svelte:head>
	<title>Login - QuitSmarter</title>
	<meta name="description" content="Login to QuitSmarter" />
</svelte:head>

<div class="mx-auto bg-gray-900 p-6 rounded-md shadow-md opacity-80 text-white">
	<div class="flex mb-4">
		<img src="/svg/logo.svg" alt="QuitSmarter Logo" width="50" height="50" class="mr-14" />
		<h1 class="text-2xl font-semibold content-center">Login</h1>
	</div>
	{#if message}
		<p class="text-red-500 mb-4">{message}</p>
	{/if}
	<form on:submit={handleSubmit}>
		<div class="mb-6">
			<label for="username" class="block text-sm font-medium">Username:</label>
			<input
				type="text"
				id="username"
				name="username"
				autocomplete="username"
				class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
				placeholder="john123"
				bind:value={username}
				required
				disabled={loading}
			/>
		</div>
		<div class="mb-4">
			<label for="password" class="block text-sm font-medium">Password:</label>
			<input
				type="password"
				id="password"
				name="password"
				autocomplete="current-password"
				class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
				placeholder="••••••••"
				bind:value={password}
				required
				disabled={loading}
			/>
		</div>
		<div class="text-center mb-4">
			<a class="text-blue-500 hover:underline" href="/request-reset" on:click={handleForgotPassword}
				>Forgot password?</a
			>
		</div>
		<a class="text-blue-500 hover:underline mb-4 block" href="/signup"
			>Don't have an account? Sign up here</a
		>
		<button
			type="submit"
			class="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150"
			disabled={loading}
		>
			{#if loading}
				Loading...
			{:else}
				Login
			{/if}
		</button>
	</form>
</div>
