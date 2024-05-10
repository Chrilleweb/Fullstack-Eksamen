<script lang="ts">
	let username: string = '';
	let email: string = '';
	let password: string = '';
	let confirmPassword: string = '';
	let message: string = '';

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (password !== confirmPassword) {
			message = "Passwords don't match";
			return;
		}

		try {
			const response = await fetch('http://localhost:8080/api/signup', {
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
		}
	}
</script>

<svelte:head>
	<title>Sign up</title>
	<meta name="description" content="Sign up" />
</svelte:head>

<div class="mt-8 mx-auto bg-white p-6 rounded-md shadow-md">
	<h1 class="text-2xl font-semibold mb-4 text-center">Sign Up</h1>
	{#if message === 'User registered successfully'}
		<p class="text-green-500 mb-4">{message}</p>
		<a class="text-blue-500 mb-4 block" href="/login">Login here!</a>
	{:else}
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
		<div class="mb-4">
			<label for="password" class="block text-sm font-medium text-gray-600">Password:</label>
			<input
				type="password"
				id="password"
				name="password"
				autocomplete="new-password"
				class="form-input mt-1 block w-full border rounded-md p-2"
				bind:value={password}
				required
			/>
		</div>
		<div class="mb-6">
			<label for="confirmPassword" class="block text-sm font-medium text-gray-600"
				>Confirm Password:</label
			>
			<input
				type="password"
				id="confirmPassword"
				name="confirmPassword"
				class="form-input mt-1 block w-full border rounded-md p-2"
				bind:value={confirmPassword}
				required
			/>
		</div>
		<a class="text-blue-500 mb-4 block" href="/login">Already have an account? Login here</a>
		<button
			type="submit"
			class="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
		>
			Sign Up
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
