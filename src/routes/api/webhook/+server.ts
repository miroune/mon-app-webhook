// src/routes/api/webhook/+server.ts
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'crypto';
import { supabase } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request }) => {
  // ... (la partie de vérification de la signature ne change pas)
  const webhookSecret = env.WOOCOMMERCE_WEBHOOK_SECRET;
  if (!webhookSecret) { throw error(500, 'Configuration serveur incorrecte'); }
  const bodyText = await request.text();
  const signature = request.headers.get('x-wc-webhook-signature');
  if (!signature) { throw error(401, 'Signature du webhook manquante'); }
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = Buffer.from(hmac.update(bodyText).digest('base64'), 'base64');
  const computedSignature = Buffer.from(signature, 'base64');
  if (!crypto.timingSafeEqual(digest, computedSignature)) { throw error(401, 'Signature du webhook invalide'); }

  const orderData = JSON.parse(bodyText);
  console.log(`🎉 Commande #${orderData.number} reçue et vérifiée ! Tentative d'enregistrement...`);

  // --- PARTIE MISE À JOUR ---
  // On extrait les nouvelles informations du payload WooCommerce
  const { error: dbError } = await supabase.from('commandes').insert({
    order_id: orderData.id,
    customer_name: `${orderData.billing.first_name} ${orderData.billing.last_name}`,
    customer_email: orderData.billing.email,
    total_amount: orderData.total,
    currency: orderData.currency,
    status: orderData.status,
    
    // NOUVEAUX CHAMPS
    shipping_address: orderData.shipping.address_1,
    shipping_city: orderData.shipping.city,
    billing_phone: orderData.billing.phone,
    
    // On stocke l'array complet des produits dans la colonne JSONB
    line_items: orderData.line_items 
  });

  if (dbError) {
    console.error("❌ Erreur lors de l'enregistrement dans Supabase:", dbError.message);
    throw error(500, "Erreur lors de l'écriture en base de données");
  }

  console.log(`✅ Commande #${orderData.number} enregistrée avec succès dans Supabase !`);
  
  return json({ message: 'Webhook traité et commande enregistrée' });
};