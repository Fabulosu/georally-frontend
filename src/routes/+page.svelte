<script lang="ts">
	import { PUBLIC_BACKEND_URL } from "$env/static/public";
	import { onMount } from "svelte";

	let isHowToPlayOpen = false;

	let statsData = {
		totalPlayers: 0,
		gamesPlayedToday: 0,
		activePlayers: 0,
		totalGames: 0
	};

	onMount(async () => {

		const stats = await fetch(PUBLIC_BACKEND_URL + '/game/stats');
		statsData = await stats.json();
	});
</script>

<main class="min-h-screen bg-gradient-to-b from-orange-50 via-orange-100 to-orange-50">
    <nav class="bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="flex-shrink-0 animate-pulse">
                    <span class="text-2xl font-bold text-orange-500">GeoRally</span>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-center space-x-6">
                        <a
                            href="/leaderboard"
                            class="rounded-md px-4 py-2 font-medium text-gray-600 hover:text-orange-600 transition-colors duration-300"
                        >Leaderboard</a>
                        <a
                            href="/play"
                            class="rounded-full bg-orange-500 px-6 py-2 font-bold text-white shadow-lg hover:bg-orange-600 transform hover:scale-105 transition-all duration-300"
                        >
                            Play Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div class="relative overflow-hidden pt-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
            <div class="text-center relative z-10">
                <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl mb-8">
                    <span class="block">Race Across the Globe in</span>
                    <span class="block text-orange-500 animate-pulse">GeoRally</span>
                </h1>
                <p class="mx-auto mt-3 max-w-md text-xl text-gray-600 sm:text-2xl md:mt-5 md:max-w-3xl">
                    Challenge players worldwide in an exciting 1v1 geography race! Navigate through countries and reach your destination first.
                </p>
                <div class="mt-10 flex justify-center gap-x-6">
                    <a
                        href="/play"
                        class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-orange-500 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:bg-orange-600 shadow-xl"
                    >
                        <span class="relative z-10">Find Match</span>
                        <div class="absolute inset-0 bg-white/20 transform translate-y-16 group-hover:translate-y-0 transition-transform duration-300"></div>
                    </a>
                    <button
                        on:click={() => (isHowToPlayOpen = true)}
                        class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors duration-300"
                    >
                        Learn More
                    </button>
                </div>
            </div>
            <div class="mt-20 relative">
                <div class="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl">
                    <img
                        src="/preview.png"
                        alt="GeoRally Gameplay"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    </div>
    <div class="py-24 bg-white/50 backdrop-blur-sm mt-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center mb-16">Why Play GeoRally?</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div class="group rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
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
					</div>
					<h3 class="mb-2 text-lg font-semibold">Real-time Racing</h3>
					<p class="text-gray-600">
						Compete head-to-head in real-time against other players around the world.
					</p>
                </div>
				<div class="group rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-orange-500"
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
					<h3 class="mb-2 text-lg font-semibold">Dynamic Routes</h3>
					<p class="text-gray-600">
						Each race features unique starting points and destinations for endless variety.
					</p>
                </div>
				<div class="group rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-orange-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-lg font-semibold">Global Leaderboard</h3>
					<p class="text-gray-600">
						Track your progress and compete for the top spot on our worldwide leaderboard.
					</p>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-orange-500 text-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <div class="text-4xl font-bold mb-2">{statsData.totalPlayers}</div>
                    <div class="text-orange-100">Active Players</div>
                </div>
                <div>
                    <div class="text-4xl font-bold mb-2">195</div>
                    <div class="text-orange-100">Countries</div>
                </div>
                <div>
                    <div class="text-4xl font-bold mb-2">{statsData.totalGames}</div>
                    <div class="text-orange-100">Games Played</div>
                </div>
            </div>
        </div>
    </div>
</main>
<footer class="mt-20 bg-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div class="col-span-1 md:col-span-1">
				<span class="text-2xl font-bold text-orange-500">GeoRally</span>
				<p class="mt-4 text-sm text-gray-500">
					Race across the globe in this exciting geography game. Challenge friends and improve your
					geography knowledge.
				</p>
				<div class="mt-6 flex space-x-6">
					<a href="/" class="text-gray-400 hover:text-orange-500">
						<span class="sr-only">Twitter</span>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
							/>
						</svg>
					</a>
					<a href="/" class="text-gray-400 hover:text-orange-500">
						<span class="sr-only">Discord</span>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
							/>
						</svg>
					</a>
					<a href="/" class="text-gray-400 hover:text-orange-500">
						<span class="sr-only">GitHub</span>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								fill-rule="evenodd"
								d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</div>
			</div>

			<div class="col-span-1">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Quick Links</h3>
				<ul class="mt-4 space-y-4">
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Home</a>
					</li>
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Leaderboard</a>
					</li>
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Find Match</a>
					</li>
				</ul>
			</div>

			<div class="col-span-1">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Support</h3>
				<ul class="mt-4 space-y-4">
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Contact Us</a>
					</li>
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Bug Report</a>
					</li>
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Feedback</a>
					</li>
				</ul>
			</div>

			<div class="col-span-1">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Legal</h3>
				<ul class="mt-4 space-y-4">
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Privacy Policy</a>
					</li>
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Terms of Service</a>
					</li>
					<li>
						<a href="/" class="text-base text-gray-500 hover:text-orange-500">Cookie Policy</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-12 border-t border-gray-200 pt-8">
			<p class="text-center text-base text-gray-400">
				© {new Date().getFullYear()} GeoRally. All rights reserved.
			</p>
		</div>
	</div>
</footer>
