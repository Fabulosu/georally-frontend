<script lang="ts">
	import GameCountdown from '$lib/components/GameCountdown.svelte';
	import GameLost from '$lib/components/GameLost.svelte';
	import GameWon from '$lib/components/GameWon.svelte';
	import OpponentDisconnect from '$lib/components/OpponentDisconnect.svelte';
	import OpponentLeft from '$lib/components/OpponentLeft.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
	import { Icon, PaperAirplane, Check, Home, GlobeEuropeAfrica, Map } from 'svelte-hero-icons';
	import { io } from 'socket.io-client';
	import { onMount, onDestroy, setContext } from 'svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import Timer from '$lib/components/Timer.svelte';

	let socket = io(PUBLIC_BACKEND_URL);

	// Game Data Variables
	let gameId: string | null,
		start: string | null,
		middle: string | null,
		target: string | null,
		banned: string | null,
		difficulty: string | null;

	// User Game Data Variables
	let error = '';
	let userInput = '';
	let currentCountry: string | null;
	let path: any[] = [];
	let userId: string | null;
	let lastGameId: string | null;
	let timeLeft = 0;
	let visitedMiddleCountry = false;

	// Game Variables
	let gameStarted = false; // This variable is set to true when both players connect for the first time
	let gamePaused = false; // Variable used to set the game to be paused or not
	let gameWon = false; // Variable to determine if the game is won
	let gameLost = false; // Variable to determine if the game is lost
	let gameEnded = false; // Variable used to determine if the game is ended or not

	// Opponent Game Data Variables
	let opponentJoined = false; // Variable used to check if the opponent has joined the room
	let opponentConnected = false; // Variable used to determine if the opponent is connected or not
	let opponentLeft = false; // Variable to determine if the opponent didn't reconnect after 30 seconds after disconnected
	let opponentMoves = 0; // Variable used to get the opponent moves 

	// Game Functions
	let saveDataInterval: any; // Interval used to save the game data to the backend every 1s
	let applyPenalty: any; // Function from the Timer component used to reduce the time from the timer
	let playCountdownAudio: boolean = true;

	// Audio Variables
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

		switch (difficulty) {
			case "easy":
				timeLeft = 0;
			case "normal":
				timeLeft = 300;
			case "hard": 
				timeLeft = 180;
			default:
				break;
		}

		const outOfTime = () => {
			socket.emit('gameOver', { gameId, userId, moves: path.length, reason: "Your ran out of time! Your opponent won!" });
		}

		setContext('noTimeLeft', { outOfTime });

		socket.emit('verifyGame', { userId, gameId, start, middle, target, banned: banned === 'null' ? null : banned, difficulty });

		socket.on('gameVerified', (data) => {
			if (data.invalid === true) {
				window.location.href = '/';
				console.log('Invalid game');
			} else {
				if (data.timeLeft > 0) timeLeft = data.timeLeft;
				if (data.path.length > 0 && data.path !== path) {
					path = data.path;
					currentCountry = data.path[data.path.length - 1];
					path.forEach((country) => {
						if (country !== start && country !== middle && country !== target) {
							const elements = document.getElementsByName(country);
							elements.forEach((element) => {
								(element as HTMLElement).classList.add('fill-orange-500');
								if (difficulty === 'hard' || difficulty === "normal") {
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
				if (difficulty === 'hard'  || difficulty === "normal") {
					(element as HTMLElement).classList.add('hidden');
				}
			}
		});

		socket.emit('joinGame', { gameId, userId });

		socket.on('wrongAnswer', (data) => {
			error = `${data.neighbour} is not a neighbour country of ${data.country}`;
			userInput = '';
			setTimeout(() => {
				error = '';
			}, 2000);
			wrongFX?.play();
			switch (difficulty) {
				case "easy":
					break;
				case "normal":
					applyPenalty(10);
				case "hard":
					applyPenalty(15);
				default:
					break;
			}
		});

		socket.on('correctAnswer', (data) => {
			currentCountry = data.neighbour;
			path = [...path, currentCountry];
			userInput = '';
			socket.emit('savePlayerData', {path, timeLeft});
			if (currentCountry) {
				if (currentCountry === middle) {
					visitedMiddleCountry = true;
				}
				const elements = document.getElementsByName(currentCountry);
				elements.forEach((element) => {
					(element as HTMLElement).classList.add('fill-orange-500');
					if (difficulty === 'hard'  || difficulty === "normal") {
						(element as HTMLElement).classList.remove('hidden');
					}
				});
			}

			if (currentCountry === target && path.includes(middle)) {
				gameWon = true;
				socket.emit('gameOver', { gameId, userId, moves: path.length, reason: "Your opponent reached the target country faster than you!" });
				clearInterval(saveDataInterval);
				winFX?.play();
			} else {
				correctFX?.play();
			}
		});

		saveDataInterval = setInterval(() => {
			socket.emit('savePlayerData', {path, timeLeft});
		}, 1000);

		socket.on('rejoinedGame', () => {
			playCountdownAudio = false;
		});

		// Game related events
		socket.on('gameStarted', () => {
			gameStarted = true;
		});

		socket.on('gameWon', () => {
			gameWon = true;
			gameEnded = true;
			clearInterval(saveDataInterval);
		});

		socket.on('gameLost', (data) => {
			gameLost = true;
			gameEnded = true;
			opponentMoves = data.opponentMoves;
			clearInterval(saveDataInterval);
		});

		// Opponent related events
		socket.on('opponentJoined', () => {
			opponentJoined = true;
			opponentConnected = true;
		});

		socket.on('opponentDisconnect', () => {
			gamePaused = true;
			opponentConnected = false;
		});

		socket.on('opponentReconnect', () => {
			opponentConnected = true;
			gamePaused = false;
		});

		socket.on('opponentLeft', () => {
			opponentLeft = true;
			opponentConnected = false;
			gameEnded = true;
		});
	});

	function submitNeighbour() {
		if (!visitedMiddleCountry && userInput === target) {
			error = `You must visit the middle country first!`;
			userInput = '';
			setTimeout(() => {
				error = '';
			}, 2000);
			wrongFX?.play();
			return;
		} else if (difficulty === "hard" && path.includes(userInput)) {
			error = `You can't go to a country you've already been to!`;
			userInput = '';
			setTimeout(() => {
				error = '';
			}, 2000);
			wrongFX?.play();
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
		clearInterval(saveDataInterval);
		if (socket) {
			socket.disconnect();
		}
	});
</script>

<main class="min-h-screen bg-gradient-to-br px-6" style="background-image: url('/background.jpg'); background-size: cover;">
	<div class="mx-auto max-w-7xl pt-2 px-6">
		<div class="mb-2 grid grid-cols-1 gap-2 md:grid-cols-3">
			{#if (difficulty === "normal" || difficulty === "hard") && gameStarted}
				<Timer bind:timeLeft={timeLeft} bind:exposedApplyPenalty={applyPenalty} timerPaused={!opponentConnected}/>
			{/if}
			<div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-green-600 p-5 shadow-xl transition-all duration-300 hover:scale-102 hover:shadow-2xl">
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
			<div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-5 shadow-xl transition-all duration-300 hover:scale-102 hover:shadow-2xl">
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
			<div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 p-5 shadow-xl transition-all duration-300 hover:scale-102 hover:shadow-2xl">
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
		<div class="mb-2">
			<div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 p-5 shadow-xl transition-all duration-300 hover:shadow-2xl">
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
		<div class="flex gap-4 mb-2">
			<div class="relative flex-1">
				<input
					type="text"
					bind:value={userInput}
					placeholder="Type a neighbor country"
					disabled={gameEnded || gamePaused}
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
				disabled={gameEnded || gamePaused}
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

{#if gameLost && gameEnded}
	<GameLost {opponentMoves} yourMoves={path.length} />
{/if}

{#if gameWon && gameEnded}
	<GameWon yourMoves={path.length} />
{/if}

{#if !opponentConnected && gamePaused && !gameEnded}
	<OpponentDisconnect />
{/if}

{#if opponentLeft && gameEnded}
	<OpponentLeft />
{/if}

{#if !opponentJoined}
	<div class="fixed inset-0 z-50 flex items-center justify-center" style="background-image: url('/background.jpg'); background-size: cover;">
		<div class="text-center">
			<div class="mt-4 text-6xl font-bold text-white" hidden={opponentJoined}>
				Waiting for opponent!
			</div>
		</div>
	</div>
{/if}

{#if !gameStarted && opponentJoined}
	<GameCountdown playAudio={playCountdownAudio} />
{/if}