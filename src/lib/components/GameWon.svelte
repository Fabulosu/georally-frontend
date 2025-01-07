<script lang="ts">
    export let yourMoves: number = 0;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
        <div class="animate-bounce-in transform rounded-2xl bg-white p-8 shadow-xl">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg 
                    class="h-12 w-12 text-green-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>

            <div class="mb-8 text-center">
                <h2 class="text-3xl font-bold text-gray-900">Victory!</h2>
                <p class="mt-2 text-gray-600">Congratulations! You won the race!</p>
            </div>

            <div class="mb-6 flex justify-center gap-4">
                <div class="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-green-200/70 p-4">
                    <p class="text-sm font-medium text-gray-700">Your Route</p>
                    <p class="text-2xl font-bold text-green-500">{yourMoves}</p>
                    <p class="text-sm text-gray-600">moves</p>
                </div>
            </div>

            <div class="mb-6">
                <div class="rounded-lg bg-green-50 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg 
                                class="h-5 w-5 text-green-400" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                            >
                                <path 
                                    fill-rule="evenodd" 
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800">
                                You completed the route in {yourMoves} moves!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-3">
                <a
                    href="/play"
                    class="flex w-full transform justify-center rounded-full border border-transparent bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Play Again
                </a>
                <button
                    class="flex w-full transform justify-center rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:scale-105 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    View Leaderboard
                </button>
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