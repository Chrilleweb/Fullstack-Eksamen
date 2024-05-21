<script lang="ts">
	import Cookies from 'js-cookie';
	import { page } from '$app/stores';
	import { isAuthenticated, user } from '../auth/auth';
	const allowedPages = ['/', '/admin', '/user-details', '/request-reset'];

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
				user.set('');
				location.reload();
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

{#if allowedPages.includes($page.url.pathname) && currentUsername && isAuthenticated}
	<header class="pt-4 md:sticky top-0 z-50">
		<nav class="flex flex-col md:flex-row justify-between items-center py-4 px-10">
			<div class="flex items-center">
				<a href="/" class="flex items-center text-2xl font-bold text-white">
					<img src="/svg/logo.svg" alt="QuitSmarter Logo" width="50" height="50" class="mr-2" />
					QuitSmarter
				</a>
			</div>
			<ul class="flex space-x-4 text-white items-center">
				<li>
					<a class=" hover:text-gray-800" href="/">Home</a>
				</li>
				<li>
					<button on:click={logout} class=" hover:text-gray-800">Logout</button>
				</li>
				<li>
					<a href="/user-details">
						<div class="flex">
							<img class="mr-2" src="/svg/userIcon.svg" alt="user" height="20" width="20" />
							<p class=" hover:text-gray-800">{currentUsername}</p>
						</div>
					</a>
				</li>
			</ul>
		</nav>
	</header>
{:else}
	<header class="py-4 md:sticky top-0">
		<nav class="flex flex-col md:flex-row justify-between items-center py-4 px-10">
			<div class="flex items-center">
				<a href="/" class="flex items-center text-2xl font-bold text-white">
					<img src="/svg/logo.svg" alt="QuitSmarter Logo" width="50" height="50" class="mr-2" />
					QuitSmarter
				</a>
			</div>
			<ul class="flex space-x-4 text-white">
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/" class=" hover:text-gray-800">Welcome</a>
				</li>
				<li aria-current={$page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login" class=" hover:text-gray-800">Login</a>
				</li>
				<li aria-current={$page.url.pathname === '/signup' ? 'page' : undefined}>
					<a href="/signup" class=" hover:text-gray-800">Sign up</a>
				</li>
			</ul>
		</nav>
	</header>
{/if}
