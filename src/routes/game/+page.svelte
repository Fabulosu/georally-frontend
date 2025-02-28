<script lang="ts">
	import GameCountdown from '$lib/components/GameCountdown.svelte';
	import GameLost from '$lib/components/GameLost.svelte';
	import GameWon from '$lib/components/GameWon.svelte';
	import OpponentDisconnect from '$lib/components/OpponentDisconnect.svelte';
	import OpponentLeft from '$lib/components/OpponentLeft.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
	import { Icon, PaperAirplane, Check, Home, GlobeEuropeAfrica, Map } from 'svelte-hero-icons';
	import { io } from 'socket.io-client';
	import { onMount, onDestroy } from 'svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	let socket = io(PUBLIC_BACKEND_URL);
	let gameId: string | null,
		start: string | null,
		middle: string | null,
		target: string | null,
		banned: string | null,
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

	let correctFX: HTMLAudioElement | null = null;
	let wrongFX: HTMLAudioElement | null = null;
	let winFX: HTMLAudioElement | null = null;

	onMount(() => {
		correctFX = new Audio('/sounds/correct.wav');
		if (correctFX) correctFX.volume = 0.5;

		winFX = new Audio('/sounds/win.wav');
		if (winFX) winFX.volume = 0.5;

		wrongFX = new Audio('/sounds/wrong.wav');
		if (wrongFX) wrongFX.volume = 0.5;

		userId = window.localStorage.getItem('userId');
		lastGameId = window.localStorage.getItem('lastGameId');

		const params = new URLSearchParams(window.location.search);
		gameId = params.get('gameId');
		start = params.get('startCountry');
		middle = params.get('middleCountry');
		target = params.get('endCountry');
		banned = params.get('bannedCountry');
		difficulty = params.get('difficulty');
		path = [start];

		if (lastGameId === gameId) {
			const savedPathString = window.localStorage.getItem('path');
			savedPath = savedPathString ? JSON.parse(savedPathString) : [];
		} else {
			window.localStorage.removeItem('path');
			savedPath = [];
		}

		socket.emit('verifyGame', { gameId, start, middle, target, banned: banned === 'null' ? null : banned, difficulty });

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

					if (path.includes(middle)) {
						visitedMiddleCountry = true;
						(document.getElementById('middleCountryIcon') as HTMLElement)?.classList.remove(
							'scale-50 -rotate-180 opacity-0'
						);
						(document.getElementById('middleCountryIcon') as HTMLElement)?.classList.add(
							'scale-100 rotate-0 opacity-80'
						);
					}
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

		if (banned) {
			const elements = document.getElementsByName(banned);
			elements.forEach((element) => {
				(element as HTMLElement).classList.add('fill-red-500');
				if ((element as HTMLElement).classList.contains('hidden')) {
					(element as HTMLElement).classList.remove('hidden');
					(element as HTMLElement).classList.add('fill-red-500/75');
				}
			});
		}

		const allPathElements = document.querySelectorAll('[name]');
		allPathElements.forEach((element) => {
			const name = element.getAttribute('name');
			if (name !== start && name !== middle && name !== target && name !== banned) {
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
			wrongFX?.play();
		});

		socket.on('correctAnswer', (data) => {
			currentCountry = data.neighbour;
			path = [...path, currentCountry];
			userInput = '';

			window?.localStorage.setItem('path', JSON.stringify(path));

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
				gameWon = true;
				socket.emit('gameOver', { gameId, userId, moves: path.length });
				window?.localStorage.removeItem('path');
				winFX?.play();
			} else {
				correctFX?.play();
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

<main class="min-h-screen bg-gradient-to-br px-6" hidden={!gameStarted} style="background-image: url('/background.jpg'); background-size: cover;">
	<div class="mx-auto max-w-7xl p-6">
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
			<div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-green-600 p-6 shadow-xl transition-all duration-300 hover:scale-102 hover:shadow-2xl">
				<div class="relative z-10 flex items-center justify-between">
					<div>
						<h2 class="text-sm font-medium text-green-100 uppercase tracking-wider">Start Country</h2>
						<p class="mt-2 text-2xl font-bold text-white">{start}</p>
					</div>
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
						<Icon 
							src={PaperAirplane} 
							class="h-8 w-8 text-white transform -rotate-45 group-hover:scale-110 transition-transform duration-300" 
							solid 
						/>
					</div>
				</div>
				<div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</div>
			<div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 shadow-xl transition-all duration-300 hover:scale-102 hover:shadow-2xl">
				<div class="relative z-10 flex items-center justify-between">
					<div>
						<h2 class="text-sm font-medium text-yellow-100 uppercase tracking-wider">Middle Country</h2>
						<p class="mt-2 text-2xl font-bold text-white">{middle}</p>
					</div>
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
						<Icon 
							id="middleCountryIcon"
							src={Check}
							class={`h-8 w-8 text-white transition-all duration-500 ${
								visitedMiddleCountry 
									? 'rotate-0 scale-100 opacity-100' 
									: '-rotate-180 scale-50 opacity-0'
							}`}
							solid
						/>
					</div>
				</div>
				<div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</div>
			<div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 p-6 shadow-xl transition-all duration-300 hover:scale-102 hover:shadow-2xl">
				<div class="relative z-10 flex items-center justify-between">
					<div>
						<h2 class="text-sm font-medium text-blue-100 uppercase tracking-wider">Target Country</h2>
						<p class="mt-2 text-2xl font-bold text-white">{target}</p>
					</div>
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
						<Icon 
							src={Home} 
							class="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" 
							solid 
						/>
					</div>
				</div>
				<div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</div>
		</div>
		<div class="mb-8">
			<div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
				<div class="flex items-center gap-3 mb-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
						<Icon src={Map} class="h-5 w-5 text-white" solid />
					</div>
					<h2 class="text-sm font-medium text-orange-100 uppercase tracking-wider">Your Journey</h2>
				</div>
				<p class="mt-2 text-xl font-medium text-white leading-relaxed">
					{path.map((country) => country).join(' → ')}
				  </p>
				  
			</div>
		</div>
		<div class="flex gap-4 mb-4">
			<div class="relative flex-1">
				<input
					type="text"
					bind:value={userInput}
					placeholder="Type a neighbor country"
					disabled={gameWon || gameOver || opponentDisconnected || opponentLeft}
					class="w-full rounded-xl border-2 border-orange-300 bg-white/90 backdrop-blur-sm px-6 py-4 text-lg text-orange-800 placeholder-orange-300
						focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20
						disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-300"
					on:keydown={(e) => {
						if (e.key === 'Enter') submitNeighbour();
					}}
				/>
				<div class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-300">
					<Icon src={GlobeEuropeAfrica} class="h-6 w-6" solid />
				</div>
			</div>
	
			<button
				on:click={submitNeighbour}
				disabled={gameWon || gameOver || opponentDisconnected || opponentLeft}
				class="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold
					hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/20
					disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
					transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
			>
				Submit
			</button>
		</div>
		<div
			class="rounded-xl border-2 border-orange-400 bg-white p-4 shadow-lg"
			style="background-color: lightblue;"
		>
			<div class="relative h-[500px] w-full overflow-hidden">
				<WorldMap />
			</div>
		</div>
	</div>
</main>

{#if gameOver}
	<GameLost {opponentMoves} yourMoves={path.length} />
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
	<div class="fixed inset-0 z-50 flex items-center justify-center" style="background-image: url('/background.jpg'); background-size: cover;">
		<div class="text-center">
			<div class="mt-4 text-6xl font-bold text-white" hidden={opponentConnected}>
				Waiting for opponent!
			</div>
		</div>
	</div>
{/if}

{#if !gameStarted && opponentConnected}
	<GameCountdown />
{/if}
