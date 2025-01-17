<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
	<div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
		<div class="animate-bounce-in transform rounded-2xl bg-white p-8 shadow-xl">
			<div
				class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
			>
				<svg class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>

			<div class="mb-8 text-center">
				<h2 class="text-3xl font-bold text-gray-900">You Win!</h2>
				<p class="mt-2 text-gray-600">Your opponent has left the game.</p>
			</div>

			<div class="space-y-3">
				<a
					href="/play"
					class="flex w-full transform justify-center rounded-full border border-transparent bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
				>
					Play Again
				</a>
				<a
					href="/leaderboard"
					class="flex w-full transform justify-center rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:scale-105 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
