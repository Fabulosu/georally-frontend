<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { Checkbox } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let rememberMe = false;
	let errorMessage = '';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const error = urlParams.get('error');
		if (error === 'CredentialsSignin') {
			errorMessage = 'Invalid email or password.';
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		errorMessage = '';

		try {
			await signIn("credentials", { 
				email, 
				password, 
				redirect: true,
				callbackUrl: "/"
			});
		} catch (error: any) {
			console.error(error);
			errorMessage = "An unexpected error occurred.";
		}
	}
</script>

<main class="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
	<nav class="bg-white shadow-md">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex-shrink-0">
					<a href="/" class="text-2xl font-bold text-orange-500">GeoRally</a>
				</div>
			</div>
		</div>
	</nav>

	<div class="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
		<div class="rounded-2xl bg-white p-8 shadow-xl">
			<div class="mb-8 text-center">
				<h2 class="text-3xl font-bold text-gray-900">Welcome Back!</h2>
				<p class="mt-2 text-gray-600">Sign in to continue your geography journey</p>
			</div>

			<form class="space-y-6" on:submit={handleSubmit}>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
						required
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
						required
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<Checkbox bind:checked={rememberMe} />
						<label for="remember-me" class="block pl-2 text-sm text-gray-700">Remember me</label>
					</div>

					<a href="/" class="text-sm font-medium text-orange-600 hover:text-orange-500">
						Forgot password?
					</a>
				</div>

				{#if errorMessage}
					<p class="text-sm text-center font-semibold text-red-500">{errorMessage}</p>
				{/if}

				<button
					type="submit"
					class="flex w-full transform justify-center rounded-full border border-transparent bg-orange-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
				>
					Sign In
				</button>
			</form>

			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600">
					Don't have an account?
					<a href="/register" class="font-medium text-orange-600 hover:text-orange-500">Sign up</a>
				</p>
			</div>
		</div>
	</div>
</main>
