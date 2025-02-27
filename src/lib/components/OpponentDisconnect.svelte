<script lang="ts">
	import { onMount } from 'svelte';

	let timeLeft: number = 30;
	const totalTime: number = 30;

	onMount(() => {
		const progressBar = document.getElementById('progress-bar') as HTMLElement | null;

		if (progressBar) {
			const startTime: number = Date.now();

			const updateProgress = () => {
				const elapsed: number = Math.floor((Date.now() - startTime) / 1000);
				timeLeft = Math.max(totalTime - elapsed, 0);

				const percentage: number = (timeLeft / totalTime) * 100;
				progressBar.style.width = `${percentage}%`;

				if (timeLeft > 0) {
					requestAnimationFrame(updateProgress);
				}
			};

			requestAnimationFrame(updateProgress);
		} else {
			console.error('Required DOM elements not found!');
		}
	});
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
	<div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
		<div class="animate-scale-in transform rounded-3xl bg-white p-8 shadow-2xl border border-orange-100">
			<div class="mx-auto mb-8 relative">
				<div class="absolute -inset-4 bg-orange-100 rounded-full animate-pulse-warning"></div>
				<div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
					<svg class="h-14 w-14 text-white animate-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
			</div>
			<div class="mb-8 text-center space-y-3">
				<h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
					Opponent Disconnected
				</h2>
				<p class="text-lg text-gray-600">
					Your opponent has temporarily lost connection to the game
				</p>
				<div class="mt-6 flex flex-col items-center space-y-2">
					<p class="text-lg font-medium text-gray-700">Waiting for reconnection</p>
					<p class="text-4xl font-bold text-orange-500 tabular-nums">
						<span id="countdown" class="animate-pulse">{Math.floor(timeLeft)}</span>
						<span class="text-2xl">s</span>
					</p>
				</div>
			</div>
			<div class="relative pt-1">
				<div class="h-3 w-full rounded-full bg-gray-100 shadow-inner overflow-hidden">
					<div id="progress-bar" 
					     class="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 animate-pulse-subtle"
					     style="width: 100%">
					</div>
				</div>
			</div>
			<div class="mt-6">
				<div class="rounded-xl bg-orange-50 p-4 border border-orange-100">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-orange-400 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-orange-700">
								The game will continue automatically when your opponent reconnects
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes scale-in {
	0% { transform: scale(0.9); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
	}

	@keyframes pulse-warning {
	0%, 100% { opacity: 0.5; transform: scale(1); }
	50% { opacity: 0.15; transform: scale(1.05); }
	}

	@keyframes warning {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(0.95); }
	}

	@keyframes pulse-subtle {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.8; }
	}

	.animate-scale-in {
	animation: scale-in 0.5s ease-out;
	}

	.animate-pulse-warning {
	animation: pulse-warning 2s ease-in-out infinite;
	}

	.animate-warning {
	animation: warning 2s ease-in-out infinite;
	}

	.animate-pulse-subtle {
	animation: pulse-subtle 2s ease-in-out infinite;
	}
</style>
