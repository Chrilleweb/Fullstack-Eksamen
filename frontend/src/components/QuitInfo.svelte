<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { loadingBar } from '../stores/loadingStore';
	import SavingsProgress from './SavingsProgress.svelte';

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
	const savings = writable({ savedCigarettes: 0, savedMoney: 0 });

	const defaultCurrency = 'DKK';
	let currency = localStorage.getItem('currency') || defaultCurrency;

	const conversionRates = {
		DKK: 1,
		USD: 0.15,
		EUR: 0.13,
		SEK: 1.56,
		NOK: 1.55
	};

	const packEquivalent: Record<string, number> = {
		DKK: 60,
		USD: 9,
		EUR: 8,
		SEK: 94,
		NOK: 93
	};
	let equivalentValue = packEquivalent[currency];
	$: equivalentValue = packEquivalent[currency];

	function ensureLocalDateString(dateString: string): string {
		const [year, month, day] = dateString.split('-').map(Number);
		const date = new Date(Date.UTC(year, month - 1, day));
		return date.toISOString().slice(0, 10);
	}

	// Function to fetch quit info
	async function fetchQuitInfo() {
		if (!userId) {
			console.error('No user ID provided');
			return;
		}
		try {
			const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/auth/quit-info/${userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
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
	async function saveQuitInfo(event: Event) {
		event.preventDefault();
		if (!quitDate) {
			console.error('Start date is empty');
			return;
		}
		loadingBar.set(true); // Start loading bar

		const method = $quitInfo ? 'PUT' : 'POST';
		const url = $quitInfo
			? import.meta.env.VITE_BACKEND_URL + `/auth/quit-info/${userId}`
			: import.meta.env.VITE_BACKEND_URL + '/auth/quit-info';

		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({
					userId,
					quit_date: quitDate,
					cigarettes_per_day: cigarettesPerDay
				})
			});
			const data = await response.json();
			if (response.ok) {
				if (!$quitInfo) {
					location.reload();
				}
				await fetchQuitInfo();
			} else {
				console.error('Error saving quit info:', data.message);
			}
		} catch (error) {
			console.error('Failed to save quit info:', error);
		} finally {
			loadingBar.set(false); // End loading bar
		}
	}

	function calculateSavings(quitDate: string, cigarettesPerDay: number) {
		if (!quitDate || !cigarettesPerDay) {
			savings.set({ savedCigarettes: 0, savedMoney: 0 });
			return;
		}

		const quitDateObj = new Date(quitDate);
		const now = new Date();
		const minutesSinceStart = (now.getTime() - quitDateObj.getTime()) / (1000 * 60);
		const minutesPerDay = 24 * 60;

		const savedCigarettes = (minutesSinceStart / minutesPerDay) * cigarettesPerDay;
		const savedMoneyInKr = (savedCigarettes / 20) * 60;

		// Type assertion to ensure currency is one of the keys of conversionRates
		const savedMoney = savedMoneyInKr * conversionRates[currency as keyof typeof conversionRates];

		savings.set({
			savedCigarettes: parseFloat(savedCigarettes.toFixed(1)),
			savedMoney: parseFloat(savedMoney.toFixed(1))
		});
	}

	function handleCigarettesInput(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, '');
		cigarettesPerDay = parseInt(input.value) || 0;
	}

	function handleCurrencyChange(event: Event) {
		currency = (event.target as HTMLSelectElement).value;
		localStorage.setItem('currency', currency);
		if ($quitInfo) {
			calculateSavings($quitInfo.quit_date, $quitInfo.cigarettes_per_day);
		}
	}

	function formatNumber(number: number): string {
		return number.toLocaleString('de-DE', {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		});
	}

	onMount(() => {
		fetchQuitInfo();
		const interval = setInterval(() => {
			if ($quitInfo) {
				calculateSavings($quitInfo.quit_date, $quitInfo.cigarettes_per_day);
			}
		}, 1000); // Update savings every 1 second
		return () => clearInterval(interval);
	});

	function toggleForm() {
		isFormVisible = !isFormVisible; // Toggle the form visibility
	}
</script>

<div
	class="container mx-auto py-10 px-6 bg-gradient-to-r from-gray-900 to-green-700 text-white rounded-3xl shadow-lg opacity-80 mb-10"
>
	{#if $quitInfo}
		<h2 class="text-2xl font-semibold mb-4 ml-6">Savings</h2>
	{/if}

	{#if $quitInfo}
		<div class="flex items-center mb-4 ml-6 space-x-4">
			<select
				id="currency"
				bind:value={currency}
				on:change={handleCurrencyChange}
				class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-20 p-2.5 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
			>
				<option value="DKK">DKK</option>
				<option value="USD">USD</option>
				<option value="EUR">EUR</option>
				<option value="SEK">SEK</option>
				<option value="NOK">NOK</option>
			</select>
			<button
				on:click={toggleForm}
				class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-150"
			>
				{isFormVisible ? 'Hide Quit Info' : 'Update Quit Info'}
			</button>
		</div>
	{:else}
		<button
			on:click={toggleForm}
			class="bg-green-700 text-white px-4 py-2 my-4 rounded-md hover:bg-green-800 transition duration-150 justify-center w-full text-center"
		>
			When did you stop smoking?
		</button>
	{/if}

	{#if isFormVisible}
		<form on:submit={saveQuitInfo} class="px-6 rounded-lg mb-4">
			<h2 class="text-2xl font-semibold mb-1">Update Info - When did you stop smoking?</h2>
			<p class="mb-4">
				One pack of cigarettes is equivalent to {equivalentValue} <span>{currency}</span>
			</p>
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
				type="submit"
				class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition duration-150"
			>
				Save Changes
			</button>
		</form>
	{/if}

	{#if $quitInfo}
		<div class="px-6">
			<p class="md:text-xl" transition:fade>
				You have saved <span class="font-bold">{formatNumber($savings.savedCigarettes)}</span> cigarettes
			</p>
			<p class="md:text-xl mb-4" transition:fade>
				This is equivalent to <span class="font-bold">{formatNumber($savings.savedMoney)}</span>
				{currency}
			</p>
			<SavingsProgress savedMoney={$savings.savedMoney} {currency} {conversionRates} />
		</div>
	{/if}
</div>
