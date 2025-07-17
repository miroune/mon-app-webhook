import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	kit: {
    adapter: adapter(),
    
    // On remet cette section qui a prouvé qu'elle fonctionnait
    csrf: {
      checkOrigin: false,
    }
  },
  preprocess: vitePreprocess()
};

export default config;
