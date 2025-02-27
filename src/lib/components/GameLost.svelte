<script lang="ts">
	export let yourMoves: number = 0;
	export let opponentMoves: number = 0;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
	<div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
		<div class="animate-scale-in transform rounded-3xl bg-white p-8 shadow-2xl border border-orange-100">
			<div class="mx-auto mb-8 relative">
				<div class="absolute -inset-4 bg-orange-100 rounded-full animate-pulse-slow"></div>
				<div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
					<svg class="h-14 w-14 text-white animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
					</svg>
				</div>
			</div>
			<div class="mb-8 text-center space-y-2">
				<h2 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Game Over!</h2>
				<p class="text-lg text-gray-600">Your opponent was faster this time!</p>
			</div>
			<div class="mb-8 grid grid-cols-2 gap-6">
				<div class="transform hover:scale-105 transition-transform duration-300 cursor-pointer">
					<div class="flex h-40 w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-orange-50 to-orange-100 p-6 shadow-md border border-orange-200">
						<div class="flex items-center gap-2">
							<svg class="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
							</svg>
							<p class="text-sm font-semibold text-gray-700">Their Route</p>
						</div>
						<p class="text-4xl font-bold text-orange-600 my-2">{opponentMoves}</p>
						<p class="text-sm text-gray-600">moves</p>
					</div>
				</div>
				<div class="transform hover:scale-105 transition-transform duration-300 cursor-pointer">
					<div class="flex h-40 w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-orange-50 to-orange-100 p-6 shadow-md border border-orange-200">
						<div class="flex items-center gap-2">
							<svg class="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
								<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
							</svg>
							<p class="text-sm font-semibold text-gray-700">Your Route</p>
						</div>
						<p class="text-4xl font-bold text-orange-600 my-2">{yourMoves}</p>
						<p class="text-sm text-gray-600">moves</p>
					</div>
				</div>
			</div>
			<div class="mb-8">
				<div class="rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-4 border border-orange-100">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<svg class="h-6 w-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-base font-medium text-orange-800">
								Don't give up! You were only <span class="font-bold">{yourMoves - opponentMoves}</span> moves away!
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="space-y-4">
				<a href="/play" 
				   class="group flex w-full transform items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
					Try Again
					<svg class="ml-2 h-5 w-5 transform transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
					</svg>
				</a>
				
				<a href="/leaderboard" 
				   class="flex w-full transform items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
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

	@keyframes pulse-slow {
	0%, 100% { opacity: 0.5; }
	50% { opacity: 0.15; }
	}

	@keyframes spin-slow {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
	}

	.animate-scale-in {
	animation: scale-in 0.5s ease-out;
	}

	.animate-pulse-slow {
	animation: pulse-slow 3s ease-in-out infinite;
	}

	.animate-spin-slow {
	animation: spin-slow 8s linear infinite;
	}
</style>
