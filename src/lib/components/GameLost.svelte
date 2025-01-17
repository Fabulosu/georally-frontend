<script lang="ts">
	export let yourMoves: number = 0;
	export let opponentMoves: number = 0;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
	<div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
		<div class="animate-bounce-in transform rounded-2xl bg-white p-8 shadow-xl">
			<div
				class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100"
			>
				<svg
					class="h-12 w-12 text-orange-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
					/>
				</svg>
			</div>

			<div class="mb-8 text-center">
				<h2 class="text-3xl font-bold text-gray-900">Game Over!</h2>
				<p class="mt-2 text-gray-600">Your opponent was faster than you!</p>
			</div>

			<div class="mb-6 grid grid-cols-2 gap-4">
				<div
					class="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-orange-100 p-4"
				>
					<p class="text-sm font-medium text-gray-700">Their Route</p>
					<p class="text-2xl font-bold text-orange-500">{opponentMoves}</p>
					<p class="text-sm text-gray-600">moves</p>
				</div>
				<div
					class="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-orange-100 p-4"
				>
					<p class="text-sm font-medium text-gray-700">Your Route</p>
					<p class="text-2xl font-bold text-orange-500">{yourMoves}</p>
					<p class="text-sm text-gray-600">moves</p>
				</div>
			</div>

			<div class="space-y-3">
				<a
					href="/play"
					class="flex w-full transform justify-center rounded-full border border-transparent bg-orange-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
				>
					Play Again
				</a>
				<a
					href="/leaderboard"
					class="flex w-full transform justify-center rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:scale-105 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
				>
					View Leaderboard
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes bounce-in {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		50% {
			opacity: 0.9;
			transform: scale(1.1);
		}
		70% {
			opacity: 1;
			transform: scale(0.9);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-bounce-in {
		animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}
</style>
