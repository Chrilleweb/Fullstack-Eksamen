<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import { page } from '$app/stores';
	import { isAuthenticated, user } from '../auth/auth';
	const allowedPages = ['/home', '/admin'];

	let currentUsername: string;
	user.subscribe((value) => {
		currentUsername = value;
	});

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
</script>

{#if allowedPages.includes($page.url.pathname) && currentUsername && isAuthenticated}
	<header class="bg-gray-800 text-white py-4 sticky top-0 opacity-90">
		<nav class="flex justify-center">
			<ul class="flex space-x-4">
				<li>
					<button on:click={logout} class="hover:text-gray-300">Logout</button>
				</li>
				<li>
					<p>{currentUsername}</p>
				</li>
			</ul>
		</nav>
	</header>
{/if}
