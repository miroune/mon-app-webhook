// src/routes/commandes/+page.server.ts
import { supabase } from '$lib/server/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// La fonction `load` s'exécute sur le serveur avant que la page ne soit rendue.
export const load: PageServerLoad = async () => {
  console.log("Chargement des commandes depuis Supabase...");

  // On fait une requête à Supabase pour récupérer toutes les commandes
  // de la table 'commandes', triées par date de création (la plus récente en premier).
  const { data: commandes, error: dbError } = await supabase
    .from('commandes')
    .select('*') // '*' signifie qu'on veut toutes les colonnes
    .order('created_at', { ascending: false }); // Tri par date, décroissant

  // Si une erreur se produit, on arrête tout et on affiche une page d'erreur.
  if (dbError) {
    console.error("Erreur lors de la récupération des commandes:", dbError.message);
    throw error(500, 'Impossible de charger les données des commandes.');
  }

  console.log(`=> ${commandes.length} commande(s) trouvée(s).`);

  // On renvoie les données récupérées. Elles seront accessibles dans le fichier +page.svelte.
  return {
    commandes: commandes
  };
};