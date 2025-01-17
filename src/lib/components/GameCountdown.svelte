<script lang="ts">
	import { onMount } from 'svelte';

	let count: number = 4;
	let countdownStarted = false;

	let countFX: HTMLAudioElement | null = null;
	let startFX: HTMLAudioElement | null = null;

	onMount(() => {
		countFX = new Audio('/sounds/count.wav');
		if (countFX) countFX.volume = 0.5;

		startFX = new Audio('/sounds/start.wav');
		if (startFX) startFX.volume = 0.5;

		countdownStarted = true;
		const overlay = document.getElementById('countdown-overlay') as HTMLElement;
		const countdownElement = document.getElementById('countdown') as HTMLElement;

		function updateCount() {
			if (count > 1) {
				countdownElement.textContent = (count - 1).toString();
				countFX?.play();
			} else {
				countdownElement.textContent = 'GO!';
				startFX?.play();
			}

			countdownElement.classList.remove('countdown-number');
			void countdownElement.offsetWidth;
			countdownElement.classList.add('countdown-number');

			if (count > 1) {
				count--;
				setTimeout(updateCount, 1000);
			} else {
				countdownElement.classList.add('countdown-exit');

				setTimeout(() => {
					overlay.style.opacity = '0';
					setTimeout(() => {
						overlay.style.display = 'none';
					}, 500);
				}, 500);
			}
		}

		updateCount();
	});
</script>

<div id="countdown-overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-white">
	<div class="text-center">
		<div id="countdown" class="countdown-number text-9xl font-bold text-orange-500"></div>
		<div class="mt-4 text-6xl font-bold text-orange-500" hidden={countdownStarted}>Get Ready!</div>
	</div>
</div>

<style>
	.countdown-number {
		opacity: 0;
		transform: scale(0.5);
		animation: countdownAnimation 1s ease-out forwards;
	}

	@keyframes countdownAnimation {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		20% {
			opacity: 1;
			transform: scale(1.2);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.countdown-exit {
		animation: exitAnimation 0.5s ease-out forwards;
	}

	@keyframes exitAnimation {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.5);
		}
	}

	#countdown-overlay {
		transition: opacity 0.5s ease-out;
	}
</style>
