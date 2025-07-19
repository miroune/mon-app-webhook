import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => { // On récupère "url" depuis le contexte
  // On lit les paramètres de recherche depuis l'URL
  const q = url.searchParams.get('q')?.trim() || '';
  const status = url.searchParams.get('status')?.trim() || '';

  console.log(`Chargement des commandes avec recherche='${q}' et statut='${status}'`);

  // On commence à construire notre requête Supabase
  let query = supabase
    .from('commandes')
    .select('*');

  // Si un terme de recherche 'q' est présent, on filtre
  if (q) {
    // On cherche dans le nom du client (insensible à la casse) OU dans l'email
    // La syntaxe .or() permet de chercher dans plusieurs colonnes.
    // 'ilike' est pour une recherche insensible à la casse, '%' est un joker.
    query = query.or(`customer_name.ilike.%${q}%,customer_email.ilike.%${q}%`);
  }

  // Si un filtre de statut est présent (et n'est pas "all"), on filtre
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  // On ajoute toujours le tri pour avoir les plus récentes en premier
  query = query.order('created_at', { ascending: false });

  // On exécute la requête finalement construite
  const { data: commandes, error: dbError } = await query;

  if (dbError) {
    console.error("Erreur lors de la récupération des commandes:", dbError.message);
    throw error(500, 'Impossible de charger les données des commandes.');
  }
  
  // TRÈS IMPORTANT : On renvoie les paramètres de recherche à la page
  // pour que l'interface sache quel est l'état actuel.
  return { 
    commandes: commandes,
    q: q,
    status: status 
  };
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
  },

  // NOUVELLE ACTION POUR LES COMMENTAIRES
  updateComment: async ({ request }) => {
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const formData = await request.formData();

    const orderId = formData.get('order_id');
    const comment = formData.get('comment');

    if (!orderId || typeof comment !== 'string') {
      return fail(400, { message: 'Données manquantes ou invalides.' });
    }

    const { error: dbError } = await supabase
      .from('commandes')
      .update({ commentaires: comment }) // On met à jour la colonne "commentaires"
      .eq('order_id', orderId);

    if (dbError) {
      console.error("Erreur lors de la mise à jour du commentaire:", dbError.message);
      return fail(500, { message: 'Erreur serveur lors de la sauvegarde.' });
    }

    return { success: true, message: 'Commentaire mis à jour !' };
  }
};