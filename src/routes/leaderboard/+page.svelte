<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	interface Player {
		username: string;
		wonGames: number;
		winRate: number;
		totalGames: number;
	}

	let data: Player[] = [];
	let statsData = {
		totalPlayers: 0,
		gamesPlayedToday: 0,
		activePlayers: 0
	};

	onMount(async () => {
		const response = await fetch(PUBLIC_BACKEND_URL + '/game/leaderboard');
		data = await response.json();

		const stats = await fetch(PUBLIC_BACKEND_URL + '/game/stats');
		statsData = await stats.json();
	});
</script>

<main class="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
	<nav class="bg-white shadow-md">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex-shrink-0">
					<span class="text-2xl font-bold text-orange-500">GeoRally</span>
				</div>
				<div class="hidden md:block">
					<div class="ml-10 flex items-center space-x-4">
						<button class="rounded-md px-3 py-2 font-medium text-gray-600 hover:text-orange-600">
							How to Play
						</button>
						<a
							href="/leaderboard"
							class="rounded-md px-3 py-2 font-medium text-gray-600 hover:text-orange-600"
						>
							Leaderboard
						</a>
					</div>
				</div>
			</div>
		</div>
	</nav>

	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="mb-12 text-center">
			<h1 class="text-4xl font-bold text-gray-900">Global Leaderboard</h1>
			<p class="mt-2 text-gray-600">Top players ranked by wins</p>
		</div>

		<div class="overflow-hidden rounded-xl bg-white shadow-md">
			<div class="overflow-x-auto">
				<table class="min-w-full">
					<thead class="bg-orange-50">
						<tr>
							<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
							<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Player</th>
							<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Wins</th>
							<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Win Rate</th>
							<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Games</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data as player, index}
							<tr class="bg-orange-50/50">
								<td class="whitespace-nowrap px-6 py-4">
									<div class="flex items-center">
										<span class="text-xl font-bold text-orange-500">{index + 1}</span>
										{#if index === 0}
											<svg
												class="ml-2 h-5 w-5 text-yellow-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
												/>
											</svg>
										{/if}
									</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
									>{player.username}</td
								>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{player.wonGames}</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{player.winRate}%</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
									>{player.totalGames}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="text-lg font-semibold text-gray-900">Total Players</h3>
				<p class="mt-2 text-3xl font-bold text-orange-500">{statsData.totalPlayers}</p>
			</div>
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="text-lg font-semibold text-gray-900">Games Played Today</h3>
				<p class="mt-2 text-3xl font-bold text-orange-500">{statsData.gamesPlayedToday}</p>
			</div>
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="text-lg font-semibold text-gray-900">Active Players</h3>
				<p class="mt-2 text-3xl font-bold text-orange-500">{statsData.activePlayers}</p>
			</div>
		</div>
	</div>
</main>
