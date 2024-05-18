<script>
	import { page } from '$app/stores';
	const allowedPages = ['/', '/login', '/signup'];
</script>

{#if allowedPages.includes($page.url.pathname)}
<header class="py-4 sticky top-0">
	<nav class="flex flex-col md:flex-row justify-between items-center py-4 px-10 ">
	  <div class="flex items-center">
		<a href="/" class="flex items-center text-2xl font-bold text-white">
		  <img src="/svg/logo.svg" alt="Task Manager Logo" width="50" height="50" class="mr-2" />
		  QuitSmarter
		</a>
	  </div>
	  <ul class="flex space-x-4 text-white">
		<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
		  <a href="/" class=" hover:text-gray-200">Welcome</a>
		</li>
		<li aria-current={$page.url.pathname === '/login' ? 'page' : undefined}>
		  <a href="/login" class=" hover:text-gray-200">Login</a>
		</li>
		<li aria-current={$page.url.pathname === '/signup' ? 'page' : undefined}>
		  <a href="/signup" class=" hover:text-gray-200">Sign up</a>
		</li>
	  </ul>
	</nav>
  </header>
  
{/if}
