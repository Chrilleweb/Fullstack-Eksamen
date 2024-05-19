<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type QuitInfoType = {
		userId: number;
		quit_date: string;
		cigarettes_per_day: number;
	} | null;

	export let userId: number; // Accept userId as a prop

	const quitInfo = writable<QuitInfoType>(null);
	let quitDate = '';
	let isFormVisible = false;
	let cigarettesPerDay = 0;
	let savings = { savedCigarettes: 0, savedMoney: 0 };

	function ensureLocalDateString(dateString: string): string {
		const [year, month, day] = dateString.split('-').map(Number);
		const date = new Date(year, month - 1, day + 2);
		// Check if the date has been interpreted as the day before in the local timezone
		if (date.getDate() != day) {
			date.setDate(date.getDate());
		}
		// Return a string in the format YYYY-MM-DD
		return date.toISOString().slice(0, 10);
	}

	// Function to fetch quit info
	async function fetchQuitInfo() {
		if (!userId) {
			console.error('No user ID provided');
			return;
		}
		try {
			const response = await fetch(`http://localhost:8080/auth/quit-info/${userId}`, {
				method: 'GET',
				credentials: 'include'
			});
			const data = await response.json();
			if (response.ok) {
				quitInfo.set(data);
				// Initialize form fields
				quitDate = data.quit_date ? ensureLocalDateString(data.quit_date.slice(0, 10)) : '';
				cigarettesPerDay = data.cigarettes_per_day || 0;
				calculateSavings(data.quit_date, data.cigarettes_per_day);
			} else if (response.status === 404) {
				quitInfo.set(null); // Set to null to indicate no quit info exists yet
			} else {
				console.error('Error fetching quit info:', data.message);
			}
		} catch (error) {
			console.error('Failed to fetch quit info:', error);
		}
	}

	// Function to add or update quit info
	async function saveQuitInfo() {
		if (!quitDate) {
			console.error('Start date is empty');
			return;
		}

		const method = $quitInfo ? 'PUT' : 'POST';
		const url = $quitInfo
			? `http://localhost:8080/auth/quit-info/${userId}`
			: 'http://localhost:8080/auth/quit-info';

		try {
			const response = await fetch(url, {
				method,
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId,
					quit_date: quitDate,
					cigarettes_per_day: cigarettesPerDay
				})
			});
			const data = await response.json();
			if (response.ok) {
				fetchQuitInfo(); // Re-fetch the latest quit info after saving
			} else {
				console.error('Error saving quit info:', data.message);
			}
		} catch (error) {
			console.error('Failed to save quit info:');
		}
	}

	// Calculate saved cigarettes and money
	function calculateSavings(quitDate: string, cigarettesPerDay: number) {
		if (!quitDate || !cigarettesPerDay) {
			savings = { savedCigarettes: 0, savedMoney: 0 };
			return;
		}

		const quitDateObj = new Date(quitDate);
		const now = new Date();
		const daysSinceStart = Math.floor(
			(now.getTime() - quitDateObj.getTime()) / (1000 * 60 * 60 * 24)
		);
		const partialDayFactor = (now.getHours() * 60 + now.getMinutes()) / (24 * 60); // Fraction of the current day that has passed

		const savedCigarettes = daysSinceStart * cigarettesPerDay + partialDayFactor * cigarettesPerDay;
		const savedMoney = (savedCigarettes / 20) * 60; // The cost per cigarette pack (20 cigarettes) is 60 kr

		savings = { savedCigarettes: Math.floor(savedCigarettes), savedMoney: Math.floor(savedMoney) };
	}

	// Ensure only numeric input for cigarettes per day
	function handleCigarettesInput(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, ''); // Remove any non-digit characters
		cigarettesPerDay = parseInt(input.value) || 0; // Update the value in the component
	}

	// Fetch quit info on component mount
	onMount(fetchQuitInfo);

	function toggleForm() {
		isFormVisible = !isFormVisible; // Toggle the form visibility
	}
</script>

<div
	class="container mx-auto py-10 px-6 bg-gradient-to-r from-gray-900 to-green-700 text-white rounded-3xl shadow-lg opacity-80 mb-10"
>
	{#if $quitInfo}
		<button
			on:click={toggleForm}
			class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150 mb-4"
		>
			{isFormVisible ? 'Hide Quit Info' : 'Update Quit Info'}
		</button>
	{:else}
		<button
			on:click={toggleForm}
			class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150 mb-4"
		>
			When did you stop smoking?
		</button>
	{/if}

	{#if isFormVisible}
		<div class="p-6 rounded-lg mb-4">
			<h2 class="text-2xl font-semibold mb-4">Update Info - When did you stop smoking?</h2>
			<div class="mb-4">
				<label for="quitDate" class="block text-sm font-medium">Quit Date</label>
				<input
					id="quitDate"
					type="date"
					bind:value={quitDate}
					class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<div class="mb-4">
				<label for="cigarettesPerDay" class="block text-sm font-medium">Cigarettes Per Day</label>
				<input
					id="cigarettesPerDay"
					type="number"
					placeholder="Cigarettes per day"
					on:input={handleCigarettesInput}
					bind:value={cigarettesPerDay}
					class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<button
				on:click={saveQuitInfo}
				class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150"
			>
				Save Changes
			</button>
		</div>
	{/if}

	{#if $quitInfo}
		<div class="p-6">
			<h2 class="text-2xl font-semibold mb-4">Savings</h2>
			<p>You have saved <span class="font-bold">{savings.savedCigarettes}</span> cigarettes.</p>
			<p>This is equivalent to <span class="font-bold">{savings.savedMoney} kr</span>.</p>
		</div>
	{/if}
</div>
