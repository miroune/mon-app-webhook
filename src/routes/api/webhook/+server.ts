// src/routes/api/webhook/+server.ts

import type { RequestHandler } from './$types';

/**
 * Cette fonction s'exécute quand une requête POST est reçue sur l'URL /api/webhook
 */
export const POST: RequestHandler = async ({ request }) => {
  // On affiche un message dans la console pour savoir que quelque chose s'est passé
  console.log("🎉 Un webhook vient d'être reçu !");

  // On récupère les données envoyées par WooCommerce
  const data = await request.json();

  // On affiche ces données pour pouvoir les inspecter
  console.log("Voici les données reçues :");
  console.log(JSON.stringify(data, null, 2));

  // Très important : on renvoie une réponse avec un statut 200 OK.
  // Cela indique à WooCommerce que nous avons bien reçu la notification.
  return new Response('Webhook reçu avec succès !', { status: 200 });
};