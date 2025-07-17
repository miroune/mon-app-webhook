// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Si la requête est pour notre webhook, nous la traitons comme une exception
  // à la règle de sécurité CSRF.
  if (event.url.pathname === '/api/webhook') {
    // On dit à SvelteKit de continuer et de traiter cette requête
    // sans appliquer sa vérification de sécurité par défaut.
    return await resolve(event);
  }

  // Pour toutes les autres requêtes, on laisse SvelteKit appliquer
  // ses protections de sécurité normales.
  return await resolve(event);
};