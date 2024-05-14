<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import io from 'socket.io-client';
	import { user } from '../auth/auth';

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
		socket = io('http://localhost:8080');

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
		document.title = $unreadMessages > 0 ? `(${$unreadMessages}) Live Chat` : 'Home';
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
	class="chat-container flex flex-col h-96 border border-gray-300 rounded-lg overflow-hidden shadow-lg"
>
	<div class="header bg-gray-800 opacity-80 text-white text-lg font-semibold p-3">Live Chat</div>
	<ul bind:this={messageContainer} class="messages flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
		{#each $messages as message}
			<li class="bg-gray-600 opacity-80 text-gray-100 p-2 rounded shadow-sm">{message}</li>
		{/each}
	</ul>
	<div class="input-group flex p-2 bg-gray-100">
		<input
			type="text"
			bind:value={messageInput}
			on:keydown={checkForEnter}
			placeholder="Type a message..."
			class="flex-1 p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
		/>
		<button
			on:click={sendMessage}
			class="ml-2 px-4 py-2 bg-gray-400 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
		>
			Send
		</button>
	</div>
</div>
