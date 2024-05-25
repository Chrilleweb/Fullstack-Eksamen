<script lang="ts">
	import Header from '../components/Header.svelte';
	import './styles.css';
	import 'nprogress/nprogress.css';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import { loadingBar } from '../stores/loadingStore';

	NProgress.configure({
		showSpinner: false,
		minimum: 0.16
	});

	$: {
		if ($navigating || $loadingBar) {
			NProgress.start();
		} else NProgress.done();
	}

	let year = new Date().getFullYear();
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>@ {year} QuitSmarter. All rights reserved.</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 15px;
		font-size: 13px;
		opacity: 0.7;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
