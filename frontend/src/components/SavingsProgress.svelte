<script lang="ts">
	export let savedMoney: number;
	export let currency: string;
	export let conversionRates: Record<string, number>;

	// Define items and their prices in base currency (DKK)
	const items = [
		{ name: 'New Pair of Shoes', price: 800 },
		{ name: 'Smartphone', price: 3000 },
		{ name: 'Laptop', price: 7000 },
		{ name: 'Vacation', price: 15000 },
		{ name: 'Car', price: 200000 }
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

<div class="savings-progress md:text-xl">
	<h2 class="text-xl font-semibold mb-2">What You Can Buy</h2>
	<p class="mb-2">Clear view of what you can afford by the money you saved !</p>
	<p class="mb-4">
		Progress to buy: <span class="font-bold">{currentItem.name}</span> ({formatNumber(
			currentItem.price * conversionRates[currency]
		)}
		{currency})
	</p>
	<div class="w-full bg-gray-300 rounded-full h-4 overflow-hidden mb-2">
		<div class="bg-green-500 h-full transition-width duration-300" style="width: {progress}%"></div>
	</div>
	<p class="text-sm">
		{formatNumber(progress)}% towards your next goal (Money saved: {formatNumber(savedMoney)}
		{currency})
	</p>
</div>
