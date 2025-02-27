<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
	<div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
		<div class="animate-scale-in transform rounded-3xl bg-white p-8 shadow-2xl border border-green-100">
			<div class="mx-auto mb-8 relative">
				<div class="absolute -inset-4 bg-green-100 rounded-full animate-pulse-slow"></div>
				<div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
					<svg class="h-14 w-14 text-white animate-victory" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
					</svg>
				</div>
			</div>
			<div class="mb-8 text-center space-y-3">
				<h2 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600">
					Victory!
				</h2>
				<div class="space-y-2">
					<p class="text-lg text-gray-600">Your opponent has left the game</p>
					<p class="text-sm text-gray-500">Victory achieved by forfeit</p>
				</div>
			</div>
			<div class="space-y-4">
				<a href="/play" 
				   class="group flex w-full transform items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
					Play Again
					<svg class="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</a>
				<a href="/leaderboard"
				   class="flex w-full transform items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
					View Leaderboard
					<svg class="ml-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
					</svg>
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

	@keyframes pulse-slow {
	0%, 100% { opacity: 0.5; transform: scale(1); }
	50% { opacity: 0.15; transform: scale(1.05); }
	}

	@keyframes victory {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.1) rotate(10deg); }
	}

	.animate-scale-in {
	animation: scale-in 0.5s ease-out;
	}

	.animate-pulse-slow {
	animation: pulse-slow 3s ease-in-out infinite;
	}

	.animate-victory {
	animation: victory 2s ease-in-out infinite;
	}
</style>
