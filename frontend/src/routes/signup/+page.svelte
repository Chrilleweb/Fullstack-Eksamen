<script lang="ts">
	let username: string = '';
	let email: string = '';
	let password: string = '';
	let confirmPassword: string = '';
	let message: string = '';
	let loading: boolean = false; // Loading state

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (password !== confirmPassword) {
			message = "Passwords don't match";
			return;
		}

		loading = true; // Start loading

		try {
			const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Signup failed');
			}

			message = data.message;
		} catch (error) {
			message = (error as Error).message;
		} finally {
			loading = false; // End loading
		}
	}
</script>

<svelte:head>
	<title>Sign up</title>
	<meta name="description" content="Sign up" />
</svelte:head>

<div class="mx-auto bg-gray-900 p-6 rounded-md shadow-md opacity-80 text-white">
	<div class="flex mb-4">
		<img src="/svg/logo.svg" alt="QuitSmarter Logo" width="50" height="50" class="mr-11" />
		<h1 class="text-2xl font-semibold content-center">Sign up</h1>
	</div>
	{#if message === 'User registered successfully'}
		<p class="text-green-500 mb-4">{message}</p>
		<a class="text-blue-500 mb-4 block" href="/login">Login here!</a>
	{:else}
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
			<label for="email" class="block text-sm font-medium">Email:</label>
			<input
				type="email"
				id="email"
				name="email"
				autocomplete="email"
				class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
				placeholder="name@email.com"
				bind:value={email}
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
				autocomplete="new-password"
				class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
				placeholder="••••••••"
				bind:value={password}
				required
				disabled={loading}
			/>
		</div>
		<div class="mb-6">
			<label for="confirmPassword" class="block text-sm font-medium">Confirm Password:</label>
			<input
				type="password"
				id="confirmPassword"
				name="confirmPassword"
				class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
				placeholder="••••••••"
				bind:value={confirmPassword}
				required
				disabled={loading}
			/>
		</div>
		<a class="text-blue-500 mb-4 block" href="/login">Already have an account? Login here</a>
		<button
			type="submit"
			class="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150"
			disabled={loading}
		>
			{#if loading}
				<span>Loading...</span>
			{:else}
				Sign Up
			{/if}
		</button>
	</form>
</div>

<style>
	input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
	}
</style>
