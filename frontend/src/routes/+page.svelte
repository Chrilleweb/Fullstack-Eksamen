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
	<div
		class="container mb-10 mx-auto py-10 px-6 bg-gradient-to-r from-gray-900 to-green-700 text-white rounded-3xl shadow-lg opacity-80"
	>
		<h1 class="text-3xl font-extrabold text-white">Admin Dashboard</h1>
		<a class="text-blue-400 hover:text-blue-600 transition duration-150" href="/admin"
			>Access Admin Page</a
		>
	</div>
{/if}

{#if userId && isAuthenticated}
	<div class="container mx-auto pb-8">
		<QuitInfo {userId} />
		<Chat />
	</div>
{:else}
	<div
		class="container mx-auto py-10 px-6 bg-gradient-to-r from-gray-900 to-green-700 text-white rounded-3xl shadow-lg opacity-80"
	>
		<h1 class="text-4xl text-center mb-6 font-extrabold">Welcome to QuitSmarter!</h1>
		<p class="text-lg leading-relaxed text-center px-10 border-b-2 pb-6">
			Congratulations on taking the first step towards a healthier lifestyle! QuitSmarter is
			designed to support you on your journey to becoming smoke-free. By logging in, you've unlocked
			a powerful tool to track the cigarettes you haven't smoked and the money you've saved.
		</p>
		<p class="text-lg leading-relaxed text-center px-10 pt-6">
			But that's not all — our community features live chat where you can share experiences, tips,
			and encouragement with others who are quitting too. Every step forward is a victory, and
			QuitSmarter is here to celebrate each one with you. Let's make your smoke-free journey
			successful together!
		</p>
		<div class="flex justify-center space-x-6 pt-8">
			<a
				href="/login"
				class="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition duration-150"
				>Login</a
			>
			<a
				href="/signup"
				class="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition duration-150"
				>Sign up</a
			>
		</div>
	</div>
{/if}
