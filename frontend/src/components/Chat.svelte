<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import io from 'socket.io-client';
	import { user } from '../stores/auth';

	let currentUsername: string;
	user.subscribe((value) => {
		currentUsername = value;
	});

	const messages = writable<string[]>([]);
	const unreadMessages = writable(0);

	let messageInput = '';
	let socket: any;
	let messageContainer: HTMLElement;

	onMount(() => {
		socket = io(import.meta.env.VITE_BACKEND_URL);

		socket.on('chat message', (data: any) => {
			messages.update((current) => [...current, `${data.username}: ${data.message}`]);
			if (typeof window !== 'undefined' && document.visibilityState === 'hidden') {
				unreadMessages.update((n) => n + 1);
			}
			tick().then(() => scrollToBottom());
		});

		socket.on('previous messages', (msgs: any[]) => {
			messages.set(msgs.map((msg) => `${msg.username}: ${msg.message}`));
			tick().then(() => scrollToBottom());
		});

		if (typeof window !== 'undefined') {
			document.addEventListener('visibilitychange', handleVisibilityChange);
		}

		return () => {
			socket.disconnect();
			if (typeof window !== 'undefined') {
				document.removeEventListener('visibilitychange', handleVisibilityChange);
			}
			socket.off('chat message');
			socket.off('previous messages');
		};
	});

	onDestroy(() => {
		if (socket) {
			socket.off('chat message');
			socket.off('previous messages');
		}
	});

	function handleVisibilityChange() {
		if (typeof window !== 'undefined' && document.visibilityState === 'visible') {
			unreadMessages.set(0);
		}
	}

	$: if (typeof window !== 'undefined') {
		document.title = $unreadMessages > 0 ? `(${$unreadMessages}) Live Chat` : 'QuitSmarter';
	}

	function sendMessage() {
		if (messageInput.trim()) {
			socket.emit('chat message', { username: currentUsername, message: messageInput });
			messageInput = '';
		}
	}

	function checkForEnter(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function scrollToBottom() {
		if (messageContainer) {
			messageContainer.scrollTop = messageContainer.scrollHeight;
		}
	}
</script>

<div
	class="container mx-auto py-10 px-6 bg-gradient-to-r from-gray-900 to-green-700 text-white rounded-3xl shadow-lg opacity-80"
>
	<div class="chat-container flex flex-col h-96 overflow-hidden rounded-lg">
		<div class="header bg-gray-800 opacity-80 text-white text-lg font-semibold p-3">
			Chat With Other Users
		</div>
		<ul
			bind:this={messageContainer}
			class="messages flex-1 overflow-y-auto p-3 space-y-2 bg-gray-700"
		>
			{#each $messages as message}
				<li class="bg-gray-600 opacity-80 text-gray-100 p-2 rounded shadow-sm">{message}</li>
			{/each}
		</ul>
		<div class="input-group flex p-2 bg-gray-800 rounded-b-lg">
			<input
				type="text"
				bind:value={messageInput}
				on:keydown={checkForEnter}
				placeholder="Type a message..."
				class="flex-1 p-2.5 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out bg-gray-700 placeholder-gray-400 text-white"
			/>
			<button
				on:click={sendMessage}
				class="ml-2 px-4 sm:px-8 py-2.5 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
			>
				Send
			</button>
		</div>
	</div>
</div>
