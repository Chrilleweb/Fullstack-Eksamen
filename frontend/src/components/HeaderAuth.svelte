<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import { page } from '$app/stores';
	import { isAuthenticated, user } from '../auth/auth';
	const allowedPages = ['/home', '/admin', '/user-details'];

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
	<header class="py-4 md:sticky top-0 z-50">
		<nav class="flex flex-col md:flex-row justify-between items-center py-4 px-10 ">
		  <div class="flex items-center">
			<a href="/" class="flex items-center text-2xl font-bold text-white">
			  <img src="/svg/logo.svg" alt="Task Manager Logo" width="50" height="50" class="mr-2" />
			  QuitSmarter
			</a>
		  </div>
		  <ul class="flex space-x-4 text-white items-center">
			<li>
				<a class=" hover:text-gray-800" href="home">Home</a>
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
{/if}
