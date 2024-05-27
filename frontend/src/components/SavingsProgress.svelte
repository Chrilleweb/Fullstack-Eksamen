<script lang="ts">
	export let savedMoney: number;
	export let currency: string;
	export let conversionRates: Record<string, number>;

	// Define items and their prices in base currency (DKK)
	const items = [
		{ name: 'Movie Ticket', price: 120 },
		{ name: 'New Shoes', price: 800 },
		{ name: 'Smartphone', price: 3000 },
		{ name: 'Laptop', price: 7000 },
		{ name: 'Vacation', price: 15000 },
		{ name: 'Motorbike', price: 50000 },
		{ name: 'Car', price: 200000 },
		{ name: 'Luxury Watch', price: 500000 },
		{ name: 'House', price: 5000000 }
	];

	let currentItem = items[0];
	let progress = 0;

	// Calculate progress towards the next item
	$: {
		const currentConversionRate = conversionRates[currency] || 1;
		const nextItem =
			items.find((item) => savedMoney < item.price * currentConversionRate) ||
			items[items.length - 1];
		currentItem = nextItem;
		progress = Math.min((savedMoney / (currentItem.price * currentConversionRate)) * 100, 100);
	}

	function formatNumber(number: number): string {
		return number.toLocaleString('de-DE', {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		});
	}
</script>

<div class="text-lg md:text-xl">
	<p class="mb-4">
		Progress to buy: <span class="font-bold">{currentItem.name}</span>
		<span class="block"
			>{formatNumber(currentItem.price * conversionRates[currency])} {currency}</span
		>
	</p>
	<div class="w-full bg-gray-300 rounded-full h-4 overflow-hidden mb-2 opacity-80">
		<div
			class="bg-green-700 h-full transition-width duration-300 opacity-80"
			style="width: {progress}%"
		></div>
	</div>
	<p class="text-sm">
		{formatNumber(progress)}% towards your next goal <br />
		(You only need {formatNumber(currentItem.price * conversionRates[currency] - savedMoney)}
		{currency} more to buy {currentItem.name})
	</p>
</div>
