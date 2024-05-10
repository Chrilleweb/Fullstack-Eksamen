<script lang="ts">
	import { isAuthenticated, user } from '../../auth/auth';
	import ErrorAuth from '../../components/ErrorAuth.svelte';
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
	<h1>YOU ARE ADMIN</h1>
	<a class="text-blue-500" href="/admin">Admin page</a>
{/if}

{#if userId && isAuthenticated}
	<div class="container mx-auto py-8">
		<h1 class="text-3xl text-center mb-4">Home</h1>
		<p class="text-lg text-gray-700 leading-relaxed">Welcome, {username}!</p>
		<p class="text-lg text-gray-700 leading-relaxed">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies nisl. Phasellus
			ultricies sem a massa ultricies, ac tincidunt est laoreet. Proin pulvinar felis at sem
			malesuada, et ultricies purus posuere.
		</p>
	</div>
{:else}
	<ErrorAuth />
{/if}
