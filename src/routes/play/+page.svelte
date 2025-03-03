<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import type { PageData } from './$types';
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';

	let socket = io(PUBLIC_BACKEND_URL, { autoConnect: false });
	let status = 'Connecting...';
	let gameId: string;
	let playersInQueue: number;
	let inQueue = false;
	let difficulty = 'easy';
	let gameFound = false;

	let userId: string | null;

	export let data: PageData;
	const session = data.session;

	onMount(() => {
		socket.on('connect', () => {
			status = 'Searching for worthy opponents...';
			if (session?.user._id) {
				socket.emit('joinQueue', { userId: session.user._id, username: session.user.username, difficulty });
			}
			socket.emit('joinQueue', { difficulty });
			inQueue = true;
		});

		userId = window.localStorage.getItem('userId');

		socket.on('updateClientCount', (count: number) => {
			playersInQueue = count;
		});

		socket.on('joinedQueue', (data: any) => {
			window.localStorage.setItem('userId', data.userId ? data.userId : '');
		});

		socket.on('gameStart', (data: any) => {
			gameId = data.gameId;
			userId = data.userId;

			status = `Opponent found! Starting game with ${data.opponent.username}`;
			gameFound = true;
			setTimeout(() => {
				window.location.href = `/game?gameId=${gameId}&startCountry=${data.start}&middleCountry=${data.middle}&endCountry=${data.target}&bannedCountry=${data.banned}&difficulty=${data.difficulty}`;
			}, 2000);
		});

		socket.on('playerDisconnected', (data: any) => {
			status = data.message || 'Opponent left the game.';
		});
	});

	function startGame() {
		socket.connect();
	}

	function cancelSearch() {
		socket.disconnect();
		inQueue = false;
	}

	onDestroy(() => {
		if (socket) socket.disconnect();
	});
</script>

<main class="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50">
	<nav class="bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="flex-shrink-0 animate-pulse">
                    <a href="/" class="text-2xl font-bold text-orange-500">GeoRally</a>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-center space-x-6">
                        <a
                            href="/leaderboard"
                            class="rounded-md px-4 py-2 font-medium text-gray-600 hover:text-orange-600 transition-colors duration-300"
                        >Leaderboard</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    {#if inQueue}
    <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-center space-y-8">
            <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-orange-100">
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                        Finding Match
                    </h2>
                    <p class="mt-2 text-lg text-gray-600">{status}</p>
                </div>
                <div class="my-12 flex justify-center">
                    <div class="relative h-36 w-36">
                        <div class="absolute inset-0 animate-spin-slow">
                            <div class="h-36 w-36 rounded-full border-4 border-b-orange-400 border-l-orange-200 border-r-orange-200 border-t-orange-500"></div>
                        </div>
                        <div class="absolute inset-0 animate-spin-reverse-slower">
                            <div class="h-28 w-28 m-4 rounded-full border-4 border-b-amber-400 border-l-amber-200 border-r-amber-200 border-t-amber-500"></div>
                        </div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <svg class="h-16 w-16 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 border border-orange-100">
                        <div class="flex justify-between items-center">
                            <div class="text-center flex-1">
                                <p class="text-sm font-medium text-gray-500">Players in queue</p>
                                <p class="mt-1 text-2xl font-bold text-orange-600">{playersInQueue}</p>
                            </div>
                            <div class="h-8 w-px bg-orange-200"></div>
                            <div class="text-center flex-1">
                                <p class="text-sm font-medium text-gray-500">Est. wait time</p>
                                <p class="mt-1 text-2xl font-bold text-orange-600">~30s</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-8 flex justify-center">
                    <button on:click={cancelSearch}
                            class="group relative rounded-xl bg-white px-8 py-3 font-medium text-gray-700 shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 hover:border-orange-200"
                            disabled={gameFound}>
                        <span class="relative">Cancel Search</span>
                    </button>
                </div>
            </div>
            <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-orange-100">
                <h3 class="text-xl font-bold text-gray-900 mb-6">While you wait...</h3>
                <div class="space-y-6">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="rounded-full bg-orange-100 p-3">
                                <svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900">Border Movement</h4>
                            <p class="mt-1 text-sm text-gray-600">You can only move to countries that share a border!</p>
                        </div>
                    </div>
					<div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="rounded-full bg-orange-100 p-3">
                                <svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900">Route</h4>
                            <p class="mt-1 text-sm text-gray-600">Plan your route carefully - the shortest path wins!</p>
                        </div>
                    </div>
					<div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="rounded-full bg-orange-100 p-3">
                                <svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900">Be quick</h4>
                            <p class="mt-1 text-sm text-gray-600">Quick decisions are key - you're racing against time!</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    {:else}
    <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-center space-y-8">
            <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-orange-100">
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                        Game Settings
                    </h2>
                    <p class="mt-2 text-lg text-gray-600">Choose your challenge level</p>
                </div>
                <div class="mt-8 space-y-6">
                    <div class="space-y-4">
                        <p class="text-lg font-semibold text-gray-700">Select Difficulty</p>
                        <div class="space-y-4">
                            <label class="relative block cursor-pointer">
                                <input type="radio"
                                       on:change={() => (difficulty = 'easy')}
                                       checked={difficulty === 'easy'}
                                       class="peer sr-only">
                                <div class="rounded-xl border-2 border-gray-200 p-4 transition-all hover:bg-orange-50 peer-checked:border-orange-500 peer-checked:bg-orange-50">
                                    <div class="flex items-center">
                                        <div class="flex-1">
                                            <h3 class="text-lg font-medium text-gray-900">Easy</h3>
                                            <p class="text-sm text-gray-500">Perfect for beginners</p>
                                        </div>
                                        <svg class="h-6 w-6 text-orange-500 opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                </div>
                            </label>
							<label class="relative block cursor-pointer">
                                <input type="radio"
                                       on:change={() => (difficulty = 'normal')}
                                       checked={difficulty === 'normal'}
                                       class="peer sr-only">
                                <div class="rounded-xl border-2 border-gray-200 p-4 transition-all hover:bg-orange-50 peer-checked:border-orange-500 peer-checked:bg-orange-50">
                                    <div class="flex items-center">
                                        <div class="flex-1">
                                            <h3 class="text-lg font-medium text-gray-900">Normal</h3>
                                            <p class="text-sm text-gray-500">Balanced gameplay with moderate time limits</p>
                                        </div>
                                        <svg class="h-6 w-6 text-orange-500 opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                </div>
                            </label>
							<label class="relative block cursor-pointer">
                                <input type="radio"
                                       on:change={() => (difficulty = 'hard')}
                                       checked={difficulty === 'hard'}
                                       class="peer sr-only">
                                <div class="rounded-xl border-2 border-gray-200 p-4 transition-all hover:bg-orange-50 peer-checked:border-orange-500 peer-checked:bg-orange-50">
                                    <div class="flex items-center">
                                        <div class="flex-1">
                                            <h3 class="text-lg font-medium text-gray-900">Hard</h3>
                                            <p class="text-sm text-gray-500">Challenge yourself with shorter time limits and complex routes</p>
                                        </div>
                                        <svg class="h-6 w-6 text-orange-500 opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="space-y-4 pt-6">
                        <button on:click={startGame}
                                class="group w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                            Play Game
                            <svg class="ml-2 inline-block h-5 w-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                        <button class="w-full rounded-xl border-2 border-orange-200 bg-white px-6 py-4 text-base font-semibold text-orange-600 transition-all duration-300 hover:bg-orange-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                            Play with Friends
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/if}
</main>

<style>

@keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes spin-reverse-slower {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
}

.animate-spin-slow {
    animation: spin-slow 4s linear infinite;
}

.animate-spin-reverse-slower {
    animation: spin-reverse-slower 6s linear infinite;
}
</style>