<script lang="ts">
	import { isAuthenticated, user } from '../auth/auth';
	import Chat from '../components/Chat.svelte';
	import QuitInfo from '../components/QuitInfo.svelte';
	export let data;
	const username = data.props.userName;
	const userId = data.props.userId;
	const userRole = data.props.role;
	user.set(username);
</script>

<svelte:head>
	<title>QuitSmarter</title>
	<meta
		name="description"
		content="QuitSmarter - Track your journey to becoming smoke-free, see how much you've saved, and connect with others on the same path."
	/>
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
	<div class="container mx-auto py-8 bg-green-700 opacity-80 text-white rounded-3xl">
		<h1 class="text-3xl text-center mb-4 font-bold">Welcome to QuitSmarter!</h1>
		<p class="text-lg leading-relaxed text-center px-8 border-b-2 pb-6">
			Congratulations on taking the first step towards a healthier lifestyle! QuitSmarter is
			designed to support you on your journey to becoming smoke-free. By logging in, you've unlocked
			a powerful tool to track the cigarettes you haven't smoked and the money you've saved.
		</p>
		<p class="text-lg leading-relaxed text-center px-8 pt-6">
			But that's not all — our community features live chat where you can share experiences, tips,
			and encouragement with others who are quitting too. Every step forward is a victory, and
			QuitSmarter is here to celebrate each one with you. Let's make your smoke-free journey
			successful together!
		</p>
		<div class="flex justify-center space-x-4 pt-6">
			<a
				href="/login"
				class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150"
				>Login</a
			>
			<a
				href="/signup"
				class="bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-900 transition duration-150"
				>Sign up</a
			>
		</div>
	</div>
{/if}
