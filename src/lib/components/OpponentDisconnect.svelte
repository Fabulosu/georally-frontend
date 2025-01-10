<script lang="ts">
	import { onMount } from "svelte";

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

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
        <div class="animate-bounce-in transform rounded-2xl bg-white p-8 shadow-xl">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>

            <div class="mb-8 text-center">
                <h2 class="text-3xl font-bold text-gray-900">Opponent Disconnected</h2>
                <p class="mt-2 text-gray-600">Your opponent has disconnected from the game.</p>
                <p class="mt-4 text-xl font-semibold text-orange-500">
                    Waiting for reconnection: <span id="countdown">{Math.floor(timeLeft)}</span>s
                </p>
            </div>

            <div class="relative pt-1">
                <div class="h-2 w-full rounded-full bg-gray-200">
                    <div id="progress-bar" class="h-2 rounded-full bg-orange-500 transition-all duration-1000" style="width: 100%"></div>
                </div>
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