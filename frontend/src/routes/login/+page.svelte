<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import { isAuthenticated } from '../../auth/auth';
	let username: string = '';
	let password: string = '';
	let message: string = '';

	async function handleSubmit(event: Event) {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:8080/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			message = data.message;

			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}

			Cookies.set('token', data.token, { expires: 1 });
			isAuthenticated.set(true);
			goto('/');
		} catch (error) {
			console.error('Login failed:', error);
		}
	}

	function handleForgotPassword() {
		goto('/request-reset');
	}
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login" />
</svelte:head>

<div class="mt-8 mx-auto bg-white p-6 rounded-md shadow-md">
	<h1 class="text-2xl font-semibold mb-4 text-center">Login</h1>
	{#if message}
		<p class="text-red-500 mb-4">{message}</p>
	{/if}
	<form on:submit={handleSubmit}>
		<div class="mb-6">
			<label for="username" class="block text-sm font-medium text-gray-600">Username:</label>
			<input
				type="text"
				id="username"
				name="username"
				autocomplete="username"
				class="form-input mt-1 block w-full border rounded-md p-2"
				bind:value={username}
				required
			/>
		</div>
		<div class="mb-4">
			<label for="password" class="block text-sm font-medium text-gray-600">Password:</label>
			<input
				type="password"
				id="password"
				name="password"
				autocomplete="current-password"
				class="form-input mt-1 block w-full border rounded-md p-2"
				bind:value={password}
				required
			/>
		</div>
		<div class="text-center mb-4">
			<a class="text-blue-500 hover:underline" href="/request-reset" on:click={handleForgotPassword}
				>Forgot password?</a
			>
		</div>
		<a class="text-blue-500 mb-4 block" href="/signup">Don't have an account? Sign up here</a>
		<button
			type="submit"
			class="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
		>
			Login
		</button>
	</form>
</div>
