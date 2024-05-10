<script lang="ts">
	import { isAuthenticated, user } from '../../auth/auth';
	import ErrorAdmin from '../../components/ErrorAdmin.svelte';
	import Confirmation from '../../components/Confirmation.svelte';
	export let data;
	const userName = data.props.userName;
	const userId = data.props.userId;
	const userRole = data.props.userRole;
	const dataUsers = data.props.dataUsers;
	user.set(userName);

	let showConfirmation = false;
	let userIdToDelete: number | null = null;
	let usernameToDelete: string | null = null;

	function askDeleteConfirmation(id: number) {
		userIdToDelete = id;
		usernameToDelete = dataUsers.find(
			(user: { id: number }) => user.id === userIdToDelete
		)?.username;
		showConfirmation = true;
	}

	async function deleteUser() {
		if (userIdToDelete !== null) {
			try {
				const url = `http://localhost:8080/auth/admin/${userIdToDelete}`;
				const response = await fetch(url, {
					method: 'DELETE',
					credentials: 'include'
				});

				if (response.ok) {
					location.reload();
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

	function handleRoleChange(event: Event, userId: number) {
		const select = event.target as HTMLSelectElement;
		updateRole(userId, select.value);
	}

	async function updateRole(id: number, role: string) {
		try {
			const url = `http://localhost:8080/auth/admin/${id}`;
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ role }),
				credentials: 'include'
			});

			if (response.ok) {
				location.reload();
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Admin" />
</svelte:head>

{#if userId && userRole === 'admin' && isAuthenticated}
	<div class="container mx-auto py-8">
		<h1 class="text-3xl text-center mb-4">Admin page</h1>
		<p class="text-lg text-gray-700 leading-relaxed">Welcome, {userName}!</p>
		<table class="min-w-full leading-normal mt-4">
			<thead>
				<tr>
					<th
						class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
						>Username</th
					>
					<th
						class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
						>Email</th
					>
					<th
						class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
						>Role</th
					>
					<th
						class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
						>Actions</th
					>
				</tr>
			</thead>
			<tbody>
				{#each dataUsers as user}
					<tr>
						<td class="px-5 py-2 border-b border-gray-200 bg-white text-sm">{user.username}</td>
						<td class="px-5 py-2 border-b border-gray-200 bg-white text-sm">{user.email}</td>
						<td class="px-5 py-2 border-b border-gray-200 bg-white text-sm">{user.role}</td>
						<td class="px-5 py-2 border-b border-gray-200 bg-white text-sm">
							<button
								on:click={() => askDeleteConfirmation(user.id)}
								class="text-red-500 hover:text-red-700">Delete</button
							>
							<select
								bind:value={user.role}
								on:change={(event) => handleRoleChange(event, user.id)}
								class="block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							>
								<option value="admin">Admin</option>
								<option value="user">User</option>
							</select>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<Confirmation
		isOpen={showConfirmation}
		message="Are you sure you want to delete {usernameToDelete}?"
		onConfirm={deleteUser}
		onCancel={cancelDelete}
	/>
{:else}
	<ErrorAdmin />
{/if}
