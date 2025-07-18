// src/routes/api/webhook/+server.ts
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'crypto'; // Ne devrait plus avoir d'erreur ici

// On définit la "forme" d'un article dans une commande pour que TypeScript soit content.
// On se base sur les données qu'on a vues dans les logs.
type LineItem = {
  id: number;
  name: string;
  quantity: number;
  // On peut ajouter d'autres champs si on en a besoin plus tard
};

export const POST: RequestHandler = async ({ request }) => {
  const webhookSecret = env.WOOCOMMERCE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Le secret du webhook n'est pas configuré dans les variables d'environnement.");
    throw error(500, 'Configuration serveur incorrecte');
  }

  const bodyText = await request.text();
  const signature = request.headers.get('x-wc-webhook-signature');

  if (!signature) {
    throw error(401, 'Signature du webhook manquante');
  }

  const hmac = crypto.createHmac('sha256', webhookSecret);
  // Buffer ne devrait plus avoir d'erreur ici
  const digest = Buffer.from(hmac.update(bodyText).digest('base64'), 'base64');
  const computedSignature = Buffer.from(signature, 'base64');

  if (!crypto.timingSafeEqual(digest, computedSignature)) {
    throw error(401, 'Signature du webhook invalide');
  }

  const orderData = JSON.parse(bodyText);

  console.log(`🎉 Commande #${orderData.number} reçue et vérifiée !`);

  const customerEmail = orderData.billing.email;
  const totalAmount = orderData.total;
  
  // On applique notre type ici. L'erreur sur 'item' va disparaître.
  const items = orderData.line_items.map((item: LineItem) => `${item.name} (x${item.quantity})`).join(', ');

  console.log(`Client: ${customerEmail}`);
  console.log(`Total: ${totalAmount} ${orderData.currency}`);
  console.log(`Articles: ${items}`);

  return json({ message: 'Webhook traité avec succès' });
};