// src/routes/commandes/+page.server.ts
import { supabase } from '$lib/server/supabase';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// La fonction `load` ne change pas. Elle charge toujours les données.
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

// --- NOUVEAU : L'objet Actions ---
// Cet objet contient des fonctions qui répondent aux requêtes POST des formulaires.
export const actions: Actions = {
  // Le nom "default" correspond à un formulaire sans action spécifique.
  default: async ({ request }) => {
    const formData = await request.formData();
    
    const orderId = formData.get('order_id');
    const newStatus = formData.get('new_status');

    // Validation simple des données reçues
    if (!orderId || !newStatus) {
      return fail(400, { message: 'ID de commande ou nouveau statut manquant.' });
    }

    console.log(`Mise à jour du statut pour la commande #${orderId} vers "${newStatus}"...`);

    // C'est ici que la magie opère : on met à jour la ligne dans Supabase
    const { error: updateError } = await supabase
      .from('commandes')
      .update({ status: newStatus.toString() })
      .eq('order_id', orderId); // On cible la bonne commande

    if (updateError) {
      console.error("Erreur lors de la mise à jour du statut:", updateError.message);
      return fail(500, { message: "Impossible de mettre à jour le statut de la commande." });
    }

    console.log(`✅ Statut mis à jour avec succès !`);
    
    // Pas besoin de retourner de valeur ici. SvelteKit va automatiquement
    // recharger les données via la fonction `load` et mettre à jour la page.
    return { success: true };
  },

  // NOUVELLE ACTION "LOGOUT"
  logout: async ({ cookies }) => {
    // On supprime le cookie
    cookies.delete('session', { path: '/' });
    // Et on redirige vers la page de connexion
    throw redirect(303, '/login');
  }
};
