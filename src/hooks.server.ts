// src/hooks.server.ts
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  const pathname = event.url.pathname;

  // Si l'utilisateur essaie d'aller sur une page protégée (ici, /commandes)
  // SANS avoir le bon cookie...
  if (pathname.startsWith('/commandes') && session !== 'loggedin') {
    // ...on le renvoie de force vers la page de connexion.
    throw redirect(303, '/login');
  }

  // Pour toutes les autres requêtes, on laisse faire.
  const response = await resolve(event);
  return response;
};