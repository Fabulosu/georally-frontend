<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';

	let socket = io(PUBLIC_BACKEND_URL, { autoConnect: false });
	let status = 'Connecting...';
	let gameId: string;
	let playersInQueue: number;
	let inQueue = false;
	let difficulty = 'easy';

	let userId: string | null;

	onMount(() => {
		socket.on('connect', () => {
			status = 'Searching for worthy opponents...';
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

			status = `Game found! Starting from ${data.start} to ${data.target}`;

			setTimeout(() => {
				window.location.href = `/game?gameId=${gameId}&startCountry=${data.start}&middleCountry=${data.middle}&endCountry=${data.target}&difficulty=${data.difficulty}`;
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

<main class="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
	<nav class="bg-white shadow-md">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex-shrink-0">
					<a href="/" class="text-2xl font-bold text-orange-500">GeoRally</a>
				</div>
				<div class="hidden md:block">
					<div class="ml-10 flex items-center space-x-4">
						<a href="/" class="rounded-md px-3 py-2 font-medium text-gray-600 hover:text-orange-600"
							>Leaderboard</a
						>
					</div>
				</div>
			</div>
		</div>
	</nav>

	{#if inQueue}
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-center">
				<div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
					<div class="text-center">
						<h2 class="text-2xl font-bold text-gray-900">Finding Match</h2>
						<p class="mt-2 text-gray-600">{status}</p>
					</div>
					<div class="my-12 flex justify-center">
						<div class="relative h-32 w-32">
							<div class="absolute inset-0 animate-spin">
								<div
									class="h-32 w-32 rounded-full border-4 border-b-orange-300 border-l-transparent border-r-transparent border-t-orange-500"
								></div>
							</div>
							<div class="absolute inset-0 flex items-center justify-center">
								<svg
									class="h-16 w-16 text-orange-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
									/>
								</svg>
							</div>
						</div>
					</div>
					<div class="space-y-4 text-center">
						<div class="text-sm text-gray-500">
							<span class="font-medium">Players in queue:</span>
							<span class="ml-2">{playersInQueue}</span>
						</div>
						<div class="text-sm text-gray-500">
							<span class="font-medium">Estimated wait time:</span>
							<span class="ml-2">~30 seconds</span>
						</div>
					</div>
					<div class="mt-8 flex justify-center">
						<button
							on:click={cancelSearch}
							class="rounded-full bg-gray-200 px-6 py-2 font-medium text-gray-700 transition hover:bg-gray-300"
						>
							Cancel Search
						</button>
					</div>
				</div>
				<div class="mt-8 w-full max-w-md rounded-xl bg-white p-6 shadow-md">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">While you wait...</h3>
					<div class="space-y-3">
						<div class="flex items-start space-x-3">
							<svg
								class="h-6 w-6 text-orange-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p class="text-sm text-gray-600">
								Remember: You can only move to countries that share a border!
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<svg
								class="h-6 w-6 text-orange-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
								/>
							</svg>
							<p class="text-sm text-gray-600">
								Plan your route carefully - the shortest path wins!
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<svg
								class="h-6 w-6 text-orange-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p class="text-sm text-gray-600">
								Quick decisions are key - you're racing against time!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-center">
				<div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
					<div class="text-center">
						<h2 class="text-2xl font-bold text-gray-900">Game Settings</h2>
						<p class="mt-2 text-gray-600">Select difficulty levels and play mode</p>
					</div>

					<div class="mt-8 space-y-6">
						<div class="space-y-4">
							<p class="text-sm font-medium text-gray-700">Select Difficulty Levels</p>
							<div class="space-y-3">
								<label class="flex items-center space-x-3">
									<input
										on:change={() => (difficulty = 'easy')}
										checked={difficulty === 'easy'}
										type="radio"
										class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
									/>
									<span class="text-gray-700">Easy</span>
								</label>
								<label class="flex items-center space-x-3">
									<input
										on:change={() => (difficulty = 'normal')}
										checked={difficulty === 'normal'}
										type="radio"
										class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
									/>
									<span class="text-gray-700">Normal</span>
								</label>
								<label class="flex items-center space-x-3">
									<input
										on:change={() => (difficulty = 'hard')}
										checked={difficulty === 'hard'}
										type="radio"
										class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
									/>
									<span class="text-gray-700">Hard</span>
								</label>
							</div>
						</div>

						<div class="space-y-4">
							<button
								on:click={startGame}
								class="w-full rounded-full bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600"
							>
								Play Game
							</button>
							<button
								class="w-full rounded-full border-2 border-orange-500 bg-white px-6 py-3 font-medium text-orange-500 transition hover:bg-orange-50"
							>
								Play with Friends
							</button>
						</div>
					</div>
				</div>

				<div class="mt-8 w-full max-w-md rounded-xl bg-white p-6 shadow-md">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Game Modes</h3>
					<div class="space-y-3">
						<div class="flex items-start space-x-3">
							<svg
								class="h-6 w-6 text-orange-500"
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
							<p class="text-sm text-gray-600">
								Easy: Perfect for beginners, with more time and hints available
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<svg
								class="h-6 w-6 text-orange-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p class="text-sm text-gray-600">
								Normal: Balanced gameplay with moderate time limits
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<svg
								class="h-6 w-6 text-orange-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							<p class="text-sm text-gray-600">
								Hard: Challenge yourself with shorter time limits and complex routes
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>