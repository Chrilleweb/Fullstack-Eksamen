<script lang="ts">
	import { isAuthenticated, user } from '../../auth/auth';
	import Chat from '../../components/Chat.svelte';
	import ErrorAuth from '../../components/ErrorAuth.svelte';
	import QuitInfo from '../../components/QuitInfo.svelte';
	export let data;
	const username = data.props.userName;
	const userId = data.props.userId;
	const userRole = data.props.role;
	user.set(username);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Home" />
</svelte:head>

{#if userRole === 'admin'}
	<div class="bg-gray-800 opacity-90 p-4 mb-4 rounded-lg z-0">
		<h1 class="text-2xl font-bold text-gray-100">Admin Dashboard</h1>
		<a class="text-blue-500 hover:text-blue-700" href="/admin">Access Admin Page</a>
	</div>
{/if}

{#if userId && isAuthenticated}
	<div class="container mx-auto py-8">
		<h1 class="text-3xl text-center mb-4">Live chat and information about your savings !</h1>
		<QuitInfo {userId} />
		<Chat />
	</div>
{:else}
	<ErrorAuth />
{/if}
