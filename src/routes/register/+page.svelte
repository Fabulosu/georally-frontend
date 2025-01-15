<script lang="ts">
	import { PUBLIC_BACKEND_URL } from "$env/static/public";
	import axios from "axios";

	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		if (password.length < 8) {
			alert('Password must be at least 8 characters long');
			return;
		}

		if (username.length < 3) {
			alert('Username must be at least 3 characters long');
			return;
		}

		if (username.length > 20) {
			alert('Username must be at most 20 characters long');
			return;
		}

		const res = await axios.post(PUBLIC_BACKEND_URL + '/auth/register', {
			username,
			email,
			password
		});

		if (res.status === 201) {
			alert('Account created successfully');
			window.location.href = '/login';
		} else {
			alert('An error occurred');
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
				<h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
				<p class="mt-2 text-gray-600">Join the geography racing community</p>
			</div>

			<form class="space-y-6" on:submit={handleSubmit}>
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
					<input
						type="text"
						id="username"
						bind:value={username}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
						required
					/>
				</div>

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

				<div>
					<label for="confirm-password" class="block text-sm font-medium text-gray-700"
						>Confirm Password</label
					>
					<input
						type="password"
						id="confirm-password"
						bind:value={confirmPassword}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
						required
					/>
				</div>

				<button
					type="submit"
					class="flex w-full transform justify-center rounded-full border border-transparent bg-orange-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
				>
					Create Account
				</button>
			</form>

			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600">
					Already have an account?
					<a href="/login" class="font-medium text-orange-600 hover:text-orange-500">Sign in</a>
				</p>
			</div>
		</div>
	</div>
</main>
