<script lang="ts">
	import { isAuthenticated, user } from '../../stores/auth';
	import ErrorAuth from '../../components/ErrorAuth.svelte';
	import Confirmation from '../../components/Confirmation.svelte';
	import { goto } from '$app/navigation';
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
			const url = import.meta.env.VITE_BACKEND_URL + '/api/logout';
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				localStorage.removeItem('token');
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
				const url = import.meta.env.VITE_BACKEND_URL + `/auth/home/delete-user`;
				const response = await fetch(url, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
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
	<title>User Details - QuitSmarter</title>
	<meta name="description" content="User details to QuitSmarter" />
</svelte:head>

{#if userId && isAuthenticated}
	<div
		class="bg-gradient-to-r from-gray-900 to-green-700 p-6 rounded-t-3xl flex justify-between items-center opacity-80"
	>
		<h1 class="text-4xl font-extrabold text-white">User Profile</h1>
		<img src="/svg/user-details.svg" alt="User Icon" class="w-12 h-12" />
	</div>
	<div class="bg-gradient-to-r from-gray-900 to-green-700 p-6 rounded-b-3xl space-y-6 opacity-80">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="space-y-4 p-4 rounded-lg">
				<p
					class="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
				>
					<span class="font-semibold text-gray-300">Username:</span>
					{username}
				</p>
				<p
					class="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
				>
					<span class="font-semibold text-gray-300">Email:</span>
					{userEmail}
				</p>
				<p
					class="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
				>
					<span class="font-semibold text-gray-300">Role:</span>
					{userRole}
				</p>
			</div>
		</div>
		<div class="flex justify-center md:justify-end space-x-2 mt-4 md:mt-0">
			<button
				on:click={() => askDeleteConfirmation(userId)}
				class="bg-red-800 text-white px-3 py-1 rounded-md hover:bg-red-900 transition duration-150 flex items-center space-x-1"
			>
				<img src="/svg/delete-icon.svg" alt="Delete Icon" class="w-4 h-4" />
				<span class="sm:text-base text-xs">Delete User</span>
			</button>
			<button
				on:click={() => goto('/request-reset')}
				class="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-150 flex items-center space-x-1"
			>
				<img src="/svg/reset-icon.svg" alt="Reset Icon" class="w-4 h-4" />
				<span class="sm:text-base text-xs">Request Password Reset</span>
			</button>
		</div>
	</div>
	<BackArrow />
	<Confirmation
		isOpen={showConfirmation}
		message="Are you sure you want to delete {username}?"
		onConfirm={deleteUser}
		onCancel={cancelDelete}
	/>
{:else}
	<ErrorAuth />
{/if}
