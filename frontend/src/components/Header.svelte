<script>
	import { page } from '$app/stores';
	const allowedPages = ['/', '/login', '/signup'];
</script>

{#if allowedPages.includes($page.url.pathname)}
	<header class="bg-gray-800 text-white py-4">
		<nav class="flex justify-center">
			<ul class="flex space-x-4">
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/" class="hover:text-gray-300">Welcome</a>
				</li>
				<li aria-current={$page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login" class="hover:text-gray-300">Login</a>
				</li>
				<li aria-current={$page.url.pathname === '/signup' ? 'page' : undefined}>
					<a href="/signup" class="hover:text-gray-300">Sign up</a>
				</li>
			</ul>
		</nav>
	</header>
{/if}
