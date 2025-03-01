
<script lang="ts">
    import { onMount, onDestroy, getContext } from 'svelte';

    export let timeLeft:number;
    export let timerPaused = false;
    let timerInterval: ReturnType<typeof setInterval>;
    let isShaking = false;
    let showPenalty = false;
    let penaltyText = '';

    const { outOfTime } : any = getContext("noTimeLeft");

    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function startTimer(): void {
        timerInterval = setInterval(() => {
            if (!timerPaused) timeLeft--;

		    window.localStorage.setItem('timeLeft', timeLeft.toString());
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timeLeft = 0;
                outOfTime();
            }
        }, 1000);
    }

    function applyPenalty(seconds: number): void {
        timeLeft = Math.max(0, timeLeft - seconds);
        penaltyText = `-${seconds}s`;
        isShaking = true;
        showPenalty = true;

        setTimeout(() => {
            isShaking = false;
            showPenalty = false;
            penaltyText = '';
        }, 1500);
    }

    onMount(() => {
        startTimer();
    });

    onDestroy(() => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    });

    export const exposedApplyPenalty = applyPenalty;
</script>

<div class="col-span-full">
    <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 p-5 shadow-xl">
        <div class="relative z-10 flex items-center justify-between">
            <div class="flex-1">
                <h2 class="text-sm font-medium text-purple-100 uppercase tracking-wider">Time Remaining</h2>
                <div class="timer-container relative inline-block">
                    <div class="relative">
                        <p class="mt-2 text-4xl font-bold text-white transition-all duration-300" class:timer-shake={isShaking}>
                            {formatTime(timeLeft)}
                        </p>
                        <span 
                            class="absolute top-1 -right-14 translate-x-full text-red-500 text-xl font-bold transition-all duration-500"
                            class:penalty-animation={showPenalty}
                        >
                            {penaltyText}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes penaltyAnimation {
        0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
        }
        20% {
            opacity: 1;
            transform: translateY(-20px) translateX(-20px);
        }
        80% {
            opacity: 1;
            transform: translateY(-20px) translateX(-20px);
        }
        100% {
            opacity: 0;
            transform: translateY(-40px) translateX(-40px);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .timer-shake {
        animation: shake 0.5s ease-in-out;
        color: #ff4444;
    }

    .penalty-animation {
        animation: penaltyAnimation 1.5s ease-out forwards;
    }
</style>