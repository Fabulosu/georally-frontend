<script lang="ts">
	export let yourMoves: number = 0;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
	<div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
		<div class="animate-scale-in transform rounded-3xl bg-white p-8 shadow-2xl border border-green-100">
			<div class="mx-auto mb-8 relative">
				<div class="absolute -inset-4 bg-green-100 rounded-full animate-pulse"></div>
				<div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
					<svg class="h-14 w-14 text-white animate-bounce-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
			</div>
			<div class="mb-8 text-center space-y-2">
				<h2 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Victory!</h2>
				<p class="text-lg text-gray-600">Congratulations! You won the race!</p>
			</div>
			<div class="mb-8 flex justify-center">
				<div class="transform hover:scale-105 transition-transform duration-300 cursor-pointer">
					<div class="flex h-40 w-40 flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-6 shadow-md border border-green-200">
						<p class="text-sm font-semibold text-gray-700">Your Route</p>
						<p class="text-4xl font-bold text-green-600 my-2">{yourMoves}</p>
						<p class="text-sm text-gray-600">moves</p>
					</div>
				</div>
			</div>
			<div class="mb-8">
				<div class="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-100">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<svg class="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-base font-medium text-green-800">
								You completed the route in <span class="font-bold">{yourMoves}</span> moves!
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="space-y-4">
				<a href="/play" 
				   class="group flex w-full transform items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
					Play Again
					<svg class="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</a>
				
				<a href="/leaderboard" 
				   class="flex w-full transform items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
					View Leaderboard
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes scale-in {
	0% { transform: scale(0.9); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
	}

	@keyframes bounce-subtle {
	0%, 100% { transform: translateY(-5%); }
	50% { transform: translateY(5%); }
	}

	.animate-scale-in {
	animation: scale-in 0.5s ease-out;
	}

	.animate-bounce-subtle {
	animation: bounce-subtle 2s ease-in-out infinite;
	}
</style>
