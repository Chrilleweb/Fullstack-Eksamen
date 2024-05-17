<script lang="ts">
	import { isAuthenticated, user } from '../../auth/auth';
	import ErrorAuth from '../../components/ErrorAuth.svelte';
	import Confirmation from '../../components/Confirmation.svelte';
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	export let data;
	const username = data.props.userName;
	const userId = data.props.userId;
	const userEmail = data.props.userEmail;
	const userRole = data.props.role;
	user.set(username);

	let showConfirmation = false;
	let userIdToDelete: number | null = null;

	async function logout() {
		try {
			const url = 'http://localhost:8080/api/logout';
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				Cookies.remove('token');
				isAuthenticated.set(false);
				goto('/');
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	function askDeleteConfirmation(userId: number) {
		userIdToDelete = userId;
		showConfirmation = true;
	}

	async function deleteUser() {
		if (userIdToDelete !== null) {
			try {
				const url = `http://localhost:8080/auth/home/delete-user`;
				const response = await fetch(url, {
					method: 'DELETE',
					credentials: 'include'
				});

				if (response.ok) {
					logout();
				}
			} catch (error) {
				console.error('Fetch error:', error);
			}
		}
		showConfirmation = false; // Close the confirmation dialog
		userIdToDelete = null; // Reset the deletion ID
	}

	function cancelDelete() {
		showConfirmation = false;
		userIdToDelete = null;
	}
</script>

<svelte:head>
	<title>User Details</title>
	<meta name="description" content="User details" />
</svelte:head>

{#if userId && isAuthenticated}
	<div class="container mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
		<h1 class="text-3xl font-bold mb-4">User Details</h1>
		<div class="mb-4">
			<p><span class="font-semibold">Username:</span> {username}</p>
			<p><span class="font-semibold">Email:</span> {userEmail}</p>
			<p><span class="font-semibold">Role:</span> {userRole}</p>
		</div>
		<button
			on:click={() => askDeleteConfirmation(userId)}
			class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition duration-150"
			>Delete user</button
		>
        <button
            on:click={() => goto('/request-reset')}
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150"
            >Request Password Reset</button>
	</div>
	<Confirmation
		isOpen={showConfirmation}
		message="Are you sure you want to delete {username}?"
		onConfirm={deleteUser}
		onCancel={cancelDelete}
	/>
{:else}
	<ErrorAuth />
{/if}
