// src/routes/commandes/+page.server.ts

// Assurez-vous que tous les imports nécessaires sont là
import { error, fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import type { PageServerLoad, Actions } from './$types';

// La fonction `load` ne change pas
export const load: PageServerLoad = async () => {
  console.log("Chargement des commandes depuis Supabase...");
  const { data: commandes, error: dbError } = await supabase
    .from('commandes')
    .select('*')
    .order('created_at', { ascending: false });

  if (dbError) {
    console.error("Erreur lors de la récupération des commandes:", dbError.message);
    throw error(500, 'Impossible de charger les données des commandes.');
  }
  
  return { commandes: commandes };
};

// L'objet Actions contient TOUTES les actions pour cette page
export const actions: Actions = {
  
  // --- Action N°1 : Mettre à jour le statut ---
  // C'est l'action "default" car le formulaire n'a pas de "?/action"
  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const orderId = formData.get('order_id');
    const newStatus = formData.get('new_status');

    if (!orderId || !newStatus) {
      return fail(400, { message: 'ID de commande ou nouveau statut manquant.' });
    }

    console.log(`Mise à jour du statut pour la commande #${orderId} vers "${newStatus}"...`);

    const { error: updateError } = await supabase
      .from('commandes')
      .update({ status: newStatus.toString() })
      .eq('order_id', orderId);

    if (updateError) {
      console.error("Erreur lors de la mise à jour du statut:", updateError.message);
      return fail(500, { message: "Impossible de mettre à jour le statut de la commande." });
    }

    console.log(`✅ Statut mis à jour avec succès !`);
    return { success: true };
  }, // <-- LA VIRGULE ICI EST TRÈS IMPORTANTE !

  // --- Action N°2 : Se déconnecter ---
  // C'est l'action "logout" car le formulaire a action="?/logout"
  logout: async ({ cookies }) => {
    cookies.delete('session', { path: '/' });
    throw redirect(303, '/login');
  }
};