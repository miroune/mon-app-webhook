// src/routes/api/webhook/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  console.log('--- NOUVELLE REQUÊTE WEBHOOK ---');
  
  try {
    // On logue les en-têtes pour voir ce que WooCommerce envoie
    console.log('En-têtes reçus:', JSON.stringify(Object.fromEntries(request.headers), null, 2));

    // On lit le corps de la requête en tant que texte brut, quoi qu'il arrive
    const bodyText = await request.text();
    console.log('Corps de la requête (brut):', bodyText);

    // On renvoie toujours un succès pour ne pas avoir d'erreur côté WooCommerce
    return json({ status: 'ok' });

  } catch (error) {
    console.error('Une erreur inattendue est survenue:', error);
    // Même en cas d'erreur, on essaie de renvoyer un succès
    return json({ status: 'error_in_handler' });
  }
};