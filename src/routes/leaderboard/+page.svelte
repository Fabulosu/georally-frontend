<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import { Calendar, ComputerDesktop, Icon, Users } from 'svelte-hero-icons';

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

<main class="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50">
	<nav class="bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="flex-shrink-0 animate-pulse">
                    <a href="/" class="text-2xl font-bold text-orange-500">GeoRally</a>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-center space-x-6">
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
    <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
            <h1 class="text-5xl font-bold text-gray-900">Global Leaderboard</h1>
            <p class="mt-4 text-xl text-gray-600">Top players competing for glory</p>
        </div>
        <div class="overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl">
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="bg-gradient-to-r from-orange-100 to-orange-50">
                        <tr>
                            <th class="px-8 py-5 text-left text-sm font-bold text-gray-900">Rank</th>
                            <th class="px-8 py-5 text-left text-sm font-bold text-gray-900">Player</th>
                            <th class="px-8 py-5 text-left text-sm font-bold text-gray-900">Wins</th>
                            <th class="px-8 py-5 text-left text-sm font-bold text-gray-900">Win Rate</th>
                            <th class="px-8 py-5 text-left text-sm font-bold text-gray-900">Total Games</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        {#each data as player, index}
                            <tr class={`
                                transition-all duration-300 hover:bg-orange-50
                                ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : ''}
                                ${index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100' : ''}
                                ${index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100' : ''}
                                ${index > 2 ? 'bg-white' : ''}
                            `}>
                                <td class="whitespace-nowrap px-8 py-6">
                                    <div class="flex items-center">
                                        {#if index === 0}
                                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white font-bold">
                                                1
                                            </div>
                                            <svg class="ml-2 h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        {:else if index === 1}
                                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 text-white font-bold">
                                                2
                                            </div>
                                        {:else if index === 2}
                                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-400 text-white font-bold">
                                                3
                                            </div>
                                        {:else}
                                            <span class="text-xl font-bold text-gray-400">{index + 1}</span>
                                        {/if}
                                    </div>
                                </td>
                                <td class="whitespace-nowrap px-8 py-6">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <div class="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center">
                                                <span class="text-lg font-bold text-orange-600">
                                                    {player.username[0].toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="font-medium text-gray-900">{player.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="whitespace-nowrap px-8 py-6 text-sm font-semibold text-gray-900">
                                    {player.wonGames}
                                </td>
                                <td class="whitespace-nowrap px-8 py-6">
                                    <div class="flex items-center">
                                        <div class="w-16 bg-gray-200 rounded-full h-2">
                                            <div class="bg-orange-500 h-2 rounded-full" style="width: {player.winRate}%"></div>
                                        </div>
                                        <span class="ml-3 text-sm font-medium text-gray-900">{player.winRate}%</span>
                                    </div>
                                </td>
                                <td class="whitespace-nowrap px-8 py-6 text-sm text-gray-900">
                                    {player.totalGames}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {#each [
                { title: 'Total Players', value: statsData.totalPlayers, icon: ComputerDesktop },
                { title: 'Games Played Today', value: statsData.gamesPlayedToday, icon: Calendar },
                { title: 'Active Players', value: statsData.activePlayers, icon: Users }
            ] as stat}
                <div class="rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                                <Icon src={stat.icon} class="h-6 w-6 text-orange-500" solid />
                            </div>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">{stat.title}</h3>
                            <p class="mt-2 text-3xl font-bold text-orange-500">{stat.value}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</main>