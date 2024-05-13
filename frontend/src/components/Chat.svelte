<script lang="ts">
	import io from 'socket.io-client';
	import { onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { user } from '../auth/auth';

	let currentUsername: string;
	user.subscribe((value) => {
		currentUsername = value;
	});

	// Store for holding chat messages
	const messages = writable<string[]>([]);

	let messageInput = ''; // Model for the message input field
	let socket: any;
	let messageContainer: HTMLElement;

	onMount(() => {
		// Connect to the WebSocket server
		socket = io('http://localhost:8080');

		// Listen for incoming chat messages
		socket.on('chat message', async (data: any) => {
			messages.update((current) => {
				return [...current, `${data.username}: ${data.message}`];
			});
			await tick();
			scrollToBottom();
		});

		// Receive previous messages on connection
		socket.on('previous messages', async (msgs: any[]) => {
			msgs.forEach((msg) => {
				messages.update((current) => [...current, `${msg.username}: ${msg.message}`]);
			});
			await tick();
			scrollToBottom();
		});

		return () => {
			socket.disconnect(); // Cleanup the socket connection when the component is destroyed
		};
	});

	// Send message to the server
	function sendMessage() {
		if (messageInput.trim()) {
			const msgData = { username: currentUsername, message: messageInput };
			socket.emit('chat message', msgData);
			messageInput = ''; // Clear input after sending
		}
	}

	// Function to handle "Enter" key press for sending messages
	function checkForEnter(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevent the default enter key behavior
			sendMessage();
		}
	}

	function scrollToBottom() {
		messageContainer.scrollTop = messageContainer.scrollHeight;
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
