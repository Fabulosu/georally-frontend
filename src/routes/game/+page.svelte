<script lang="ts">
	import GameCountdown from '$lib/components/GameCountdown.svelte';
	import GameLost from '$lib/components/GameLost.svelte';
	import GameWon from '$lib/components/GameWon.svelte';
	import OpponentDisconnect from '$lib/components/OpponentDisconnect.svelte';
	import OpponentLeft from '$lib/components/OpponentLeft.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
	import { io } from 'socket.io-client';
	import { onMount, onDestroy } from 'svelte';

	let socket = io('https://georally-backend-production.up.railway.app');
	let gameId: string | null,
		start: string | null,
		middle: string | null,
		target: string | null,
		difficulty: string | null;

	let error = '';
	let userInput = '';

	let currentCountry: string | null;
	let path: any[] = [];

	let savedPath: any[] = [];
	let userId: string | null;
	let lastGameId: string | null;

	let gameStarted = false;
	let visitedMiddleCountry = false;
	let gameOver = false;
	let gameWon = false;

	let opponentConnected = false;
	let opponentDisconnected = false;
	let opponentLeft = false;
	let opponentMoves = 0;

	onMount(() => {
		userId = window.localStorage.getItem('userId');
		lastGameId = window.localStorage.getItem('lastGameId');

		const params = new URLSearchParams(window.location.search);
		gameId = params.get('gameId');
		start = params.get('startCountry');
		middle = params.get('middleCountry');
		target = params.get('endCountry');
		difficulty = params.get('difficulty');
		path = [start];

		if (lastGameId === gameId) {
			const savedPathString = window.localStorage.getItem('path');
			savedPath = savedPathString ? JSON.parse(savedPathString) : [];
		} else {
			window.localStorage.removeItem('path');
			savedPath = [];
		}

		socket.emit('verifyGame', { gameId, start, middle, target, difficulty });

		socket.on('gameVerified', (data) => {
			if (data.invalid === true) {
				window.location.href = '/';
				console.log('Invalid game');
			} else {
				if (savedPath.length > 0 && savedPath !== path) {
					path = savedPath;
					currentCountry = savedPath[savedPath.length - 1];
					path.forEach((country) => {
						if (country !== start && country !== middle && country !== target) {
							const elements = document.getElementsByName(country);
							elements.forEach((element) => {
								(element as HTMLElement).classList.add('fill-orange-500');
								if (difficulty === 'hard') {
									(element as HTMLElement).classList.remove('hidden');
								}
							});
						}
					});
				} else {
					currentCountry = start;
					path = [currentCountry];
				}

				window.localStorage.setItem('lastGameId', gameId ? gameId : '');
				console.log('Game verified');
			}
		});

		if (start) {
			const elements = document.getElementsByName(start);
			elements.forEach((element) => {
				(element as HTMLElement).classList.add('fill-green-500');
				if ((element as HTMLElement).classList.contains('hidden')) {
					(element as HTMLElement).classList.remove('hidden');
					(element as HTMLElement).classList.add('fill-green-500/75');
				}
			});
		}

		if (middle) {
			const elements = document.getElementsByName(middle);
			elements.forEach((element) => {
				(element as HTMLElement).classList.add('fill-yellow-500');
				if ((element as HTMLElement).classList.contains('hidden')) {
					(element as HTMLElement).classList.remove('hidden');
					(element as HTMLElement).classList.add('fill-yellow-500/75');
				}
			});
		}

		if (target) {
			const elements = document.getElementsByName(target);
			elements.forEach((element) => {
				(element as HTMLElement).classList.add('fill-blue-500');
				if ((element as HTMLElement).classList.contains('hidden')) {
					(element as HTMLElement).classList.remove('hidden');
					(element as HTMLElement).classList.add('fill-blue-500/75');
				}
			});
		}

		const allPathElements = document.querySelectorAll('[name]');
		allPathElements.forEach((element) => {
			const name = element.getAttribute('name');
			if (name !== start && name !== middle && name !== target) {
				if (difficulty === 'hard') {
					(element as HTMLElement).classList.add('hidden');
				}
			}
		});

		socket.on('gameStarted', () => {
			gameStarted = true;
		});

		socket.emit('rejoinGame', { gameId, userId });

		socket.on('wrongAnswer', (data) => {
			error = `${data.neighbour} is not a neighbour country of ${data.country}`;
			userInput = '';
			setTimeout(() => {
				error = '';
			}, 2000);
		});

		socket.on('correctAnswer', (data) => {
			currentCountry = data.neighbour;
			path = [...path, currentCountry];
			userInput = '';

			window?.localStorage.setItem('path', JSON.stringify(path));

			console.log(data);

			if (currentCountry) {
				if (currentCountry === middle) {
					visitedMiddleCountry = true;
				}
				const elements = document.getElementsByName(currentCountry);
				elements.forEach((element) => {
					(element as HTMLElement).classList.add('fill-orange-500');
					if (difficulty === 'hard') {
						(element as HTMLElement).classList.remove('hidden');
					}
				});
			}

			if (currentCountry === target && path.includes(middle)) {
				console.log(start, middle, target, currentCountry);
				gameWon = true;
				socket.emit('gameOver', { gameId, userId, moves: path.length });
				window?.localStorage.removeItem('path');
			}
		});

		socket.on('opponentConnected', () => {
			opponentConnected = true;
		});

		socket.on('opponentDisconnect', () => {
			opponentDisconnected = true;
		});

		socket.on('opponentReconnect', () => {
			opponentDisconnected = false;
		});

		socket.on('opponentLeft', () => {
			opponentLeft = true;
			opponentDisconnected = false;
		});

		socket.on('opponentWon', (data) => {
			gameOver = true;
			opponentMoves = data.opponentMoves;
			window?.localStorage.removeItem('path');
		});

		socket.on('gameWon', () => {
			gameWon = true;
			window?.localStorage.removeItem('path');
		});
	});

	function submitNeighbour() {
		if (!visitedMiddleCountry && userInput === target) {
			error = `You must visit the middle country first!`;
			userInput = '';
			setTimeout(() => {
				error = '';
			}, 2000);
			return;
		}

		if (!visitedMiddleCountry) {
			socket.emit('submit-neighbour', {
				gameId,
				country: currentCountry,
				neighbour: userInput,
				targetCountry: middle
			});
		} else {
			socket.emit('submit-neighbour', {
				gameId,
				country: currentCountry,
				neighbour: userInput,
				targetCountry: target
			});
		}
	}

	onDestroy(() => {
		if (socket) {
			socket.disconnect();
		}
	});
</script>

<main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" hidden={!gameStarted}>
	<div class="mx-auto max-w-7xl">
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
			<div
				class="transform rounded-lg bg-green-500 p-4 shadow-lg transition duration-300 hover:scale-105"
			>
				<h2 class="text-sm font-medium text-blue-100">Start Country</h2>
				<p class="mt-1 text-xl font-semibold text-white">{start}</p>
			</div>
			<div
				class="transform rounded-lg bg-yellow-500 p-4 shadow-lg transition duration-300 hover:scale-105"
			>
				<h2 class="text-sm font-medium text-indigo-100">Middle Country</h2>
				<p class="mt-1 text-xl font-semibold text-white">{middle}</p>
			</div>
			<div
				class="transform rounded-lg bg-blue-500 p-4 shadow-lg transition duration-300 hover:scale-105"
			>
				<h2 class="text-sm font-medium text-purple-100">Target Country</h2>
				<p class="mt-1 text-xl font-semibold text-white">{target}</p>
			</div>
		</div>
		<div
			class="mb-6 transform rounded-lg bg-orange-400 p-4 shadow-lg transition duration-300 hover:shadow-xl"
		>
			<h2 class="text-sm font-medium text-blue-100">Your Path</h2>
			<p class="mt-2 text-lg font-medium text-white">
				{path.map((country) => country).join(' → ')}
			</p>
		</div>
		<div class="mb-6 flex gap-4">
			<input
				type="text"
				bind:value={userInput}
				placeholder="Type a neighbor country"
				disabled={gameWon}
				class="flex-1 rounded-lg border-2 border-orange-300 bg-white px-4 py-2 text-orange-800 placeholder-orange-300
                    focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50
                    disabled:bg-gray-100 disabled:text-gray-500"
				on:keydown={(e) => {
					if (e.key === 'Enter') submitNeighbour();
				}}
			/>

			<button on:click={submitNeighbour} disabled={gameWon}>Submit</button>
		</div>
		<div
			class="rounded-xl border-2 border-orange-400 bg-white p-4 shadow-lg"
			style="background-color: lightblue;"
		>
			<div class="relative h-[500px] w-full overflow-hidden">
				<WorldMap />
			</div>
		</div>
		<div
			class="mt-6 transform rounded-xl bg-gradient-to-br from-white to-blue-50 p-6 shadow-md transition duration-300 hover:shadow-lg"
		>
			<h3 class="mb-4 text-lg font-semibold text-orange-500">Game Tips</h3>
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
					<p class="text-sm text-orange-500">
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
					<p class="text-sm text-orange-500">Plan your route carefully - the shortest path wins!</p>
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
					<p class="text-sm text-orange-500">
						Quick decisions are key - you're racing against time!
					</p>
				</div>
			</div>
		</div>
	</div>
</main>

{#if gameOver}
	<GameLost opponentMoves={opponentMoves} yourMoves={path.length} />
{/if}

{#if gameWon}
	<GameWon yourMoves={path.length} />
{/if}

{#if opponentDisconnected && !gameOver && !gameWon}
	<OpponentDisconnect />
{/if}

{#if opponentLeft && !gameOver && !gameWon}
	<OpponentLeft />
{/if}

{#if !opponentConnected}
	<div class="fixed inset-0 flex items-center justify-center bg-white z-50">
		<div class="text-center">
			<div class="text-6xl font-bold text-orange-500 mt-4" hidden={opponentConnected}>Waiting for opponent!</div>
		</div>
	</div>
{/if}

{#if !gameStarted && opponentConnected}
	<GameCountdown />
{/if}
