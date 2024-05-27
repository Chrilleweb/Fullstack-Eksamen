<script lang="ts">
	import { isAuthenticated, user } from '../../stores/auth';
	import ErrorAdmin from '../../components/ErrorAdmin.svelte';
	import Confirmation from '../../components/Confirmation.svelte';
	import BackArrow from '../../components/backArrow.svelte';
	import { writable } from 'svelte/store';

	export let data;
	const userName = data.props.userName;
	const userId = data.props.userId;
	const userRole = data.props.userRole;
	const initialDataUsers = data.props.dataUsers;
	user.set(userName);

	let showConfirmation = false;
	let userIdToDelete: number | null = null;
	let usernameToDelete: string | null = null;

	// Using a writable store to manage the user list
	const dataUsers = writable(initialDataUsers);

	function askDeleteConfirmation(id: number) {
		userIdToDelete = id;
		usernameToDelete = initialDataUsers.find(
			(user: { id: number }) => user.id === userIdToDelete
		)?.username;
		showConfirmation = true;
	}

	async function deleteUser() {
		if (userIdToDelete !== null) {
			try {
				const url = import.meta.env.VITE_BACKEND_URL + `/auth/admin/${userIdToDelete}`;
				const response = await fetch(url, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				});

				if (response.ok) {
					dataUsers.update((users) =>
						users.filter((user: { id: number }) => user.id !== userIdToDelete)
					);
				} else {
					const errorData = await response.json();
					console.error('Error deleting user:', errorData.message);
				}
			} catch (error) {
				console.error('Fetch error:', error);
			} finally {
				showConfirmation = false; // Close the confirmation dialog
				userIdToDelete = null; // Reset the deletion ID
			}
		}
	}

	function cancelDelete() {
		showConfirmation = false;
		userIdToDelete = null;
	}

	function handleRoleChange(event: Event, userId: number) {
		const select = event.target as HTMLSelectElement;
		updateRole(userId, select.value);
	}

	async function updateRole(id: number, role: string) {
		try {
			const url = import.meta.env.VITE_BACKEND_URL + `/auth/admin/${id}`;
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({ role })
			});

			if (response.ok) {
				dataUsers.update((users) => {
					const index = users.findIndex((user: { id: number }) => user.id === id);
					if (index !== -1) {
						users[index].role = role;
					}
					return users;
				});
			} else {
				const errorData = await response.json();
				console.error('Error updating role:', errorData.message);
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<svelte:head>
	<title>Admin - QuitSmarter</title>
	<meta name="description" content="Admin page to QuitSmarter" />
</svelte:head>

{#if userId && userRole === 'admin' && isAuthenticated}
	<div
		class="container mx-auto py-10 px-6 bg-gradient-to-r from-gray-900 to-green-700 text-white rounded-3xl shadow-lg opacity-80"
	>
		<h1 class="text-4xl text-center mb-6 font-extrabold">Admin Page</h1>
		<div class="overflow-auto rounded-lg shadow-md">
			<table class="min-w-full leading-normal">
				<thead>
					<tr>
						<th
							class="px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
							>Username</th
						>
						<th
							class="px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
							>Email</th
						>
						<th
							class="px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
							>Role</th
						>
						<th
							class="px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody>
					{#each $dataUsers as user}
						<tr>
							<td class="px-5 py-2 border-b border-gray-700 bg-gray-800 text-sm text-gray-300"
								>{user.username}</td
							>
							<td class="px-5 py-2 border-b border-gray-700 bg-gray-800 text-sm text-gray-300"
								>{user.email}</td
							>
							<td class="px-5 py-2 border-b border-gray-700 bg-gray-800 text-sm text-gray-300">
								<select
									bind:value={user.role}
									on:change={(event) => handleRoleChange(event, user.id)}
									class="block w-full mt-2 py-2 px-3 border border-gray-600 bg-gray-800 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								>
									<option value="admin">Admin</option>
									<option value="user">User</option>
								</select>
							</td>
							<td class="px-5 py-2 border-b border-gray-700 bg-gray-800 text-sm text-gray-300">
								<button
									on:click={() => askDeleteConfirmation(user.id)}
									class="text-red-400 hover:text-red-600 transition duration-150">Delete</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<BackArrow />
	<Confirmation
		isOpen={showConfirmation}
		message="Are you sure you want to delete {usernameToDelete}?"
		onConfirm={deleteUser}
		onCancel={cancelDelete}
	/>
{:else}
	<ErrorAdmin />
{/if}
