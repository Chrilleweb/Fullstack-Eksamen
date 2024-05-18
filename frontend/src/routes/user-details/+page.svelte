<script lang="ts">
	import { isAuthenticated, user } from '../../auth/auth';
	import ErrorAuth from '../../components/ErrorAuth.svelte';
	import Confirmation from '../../components/Confirmation.svelte';
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import BackArrow from '../../components/backArrow.svelte';
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
	<div
		class="bg-gradient-to-r from-gray-500 to-blue-900 p-6 rounded-t-lg flex justify-between items-center"
	>
		<h1 class="text-4xl font-extrabold text-white">User Profile</h1>
		<img src="/svg/user-details.svg" alt="User Icon" class="w-12 h-12" />
	</div>
	<div class="bg-gradient-to-r from-gray-500 to-blue-900 p-6 rounded-b-lg space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="space-y-2">
				<p class="text-lg text-gray-800">
					<span class="font-bold text-white">Username:</span>
					{username}
				</p>
				<p class="text-lg text-gray-800">
					<span class="font-bold text-white">Email:</span>
					{userEmail}
				</p>
				<p class="text-lg text-gray-800">
					<span class="font-bold text-white">Role:</span>
					{userRole}
				</p>
			</div>
		</div>
		<div class="flex justify-center md:justify-end space-x-2 mt-4 md:mt-0">
			<button
				on:click={() => askDeleteConfirmation(userId)}
				class="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-150 flex items-center space-x-1"
			>
				<img src="/svg/delete-icon.svg" alt="Delete Icon" class="w-4 h-4" />
				<span class="sm:text-base text-xs">Delete User</span>
			</button>
			<button
				on:click={() => goto('/request-reset')}
				class="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-150 flex items-center space-x-1"
			>
				<img src="/svg/reset-icon.svg" alt="Reset Icon" class="w-4 h-4" />
				<span class="sm:text-base text-xs">Request Password Reset</span>
			</button>
		</div>
        <BackArrow />
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
