<script lang="ts">
	export let isOpen: boolean = false;
	export let message: string = '';
	export let onConfirm: () => void;
	export let onCancel: () => void;

	function handleConfirm() {
		onConfirm();
		isOpen = false;
	}

	function handleCancel() {
		onCancel();
		isOpen = false;
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center px-4">
		<div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto p-6 space-y-4">
			<p class="text-lg text-gray-900">{message}</p>
			<div class="flex justify-between">
				<button
					class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					on:click={handleCancel}
				>
					Cancel
				</button>
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					on:click={handleConfirm}
				>
					Confirm
				</button>
			</div>
		</div>
	</div>
{/if}
