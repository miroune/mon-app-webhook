// src/routes/api/webhook/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  // On ajoute un log avec la date pour mieux suivre ce qui se passe
  console.log(`[${new Date().toISOString()}] - Requête reçue sur /api/webhook`);

  try {
    // On essaie de lire le corps de la requête en tant que texte brut
    const bodyText = await request.text();

    if (bodyText) {
      // S'il y a du texte, on essaie de le convertir depuis le format JSON
      const data = JSON.parse(bodyText);
      console.log("🎉 Webhook avec des données reçu !");
      console.log(JSON.stringify(data, null, 2));
    } else {
      // Si le corps est vide, c'est probablement le test de connexion de WooCommerce
      console.log("✅ Ping de connexion de WooCommerce reçu. La connexion est bonne !");
    }

    // On renvoie une réponse de succès au format JSON (c'est une bonne pratique)
    return json({ message: 'Webhook traité avec succès' }, { status: 200 });

  } catch (error) {
    // Si une erreur se produit (par ex: le texte n'est pas du JSON valide)
    console.error("❌ Erreur lors du traitement du webhook:", error);
    
    // On renvoie une réponse d'erreur claire
    return json({ message: 'Erreur lors du traitement de la requête' }, { status: 400 });
  }
};