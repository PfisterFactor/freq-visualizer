<script lang="ts">
	export const ssr = false;
    import "@picocss/pico";
</script>

<main id="app">
	<slot />
</main>

<style>
	main {
		padding: 1rem;
	}
</style>
