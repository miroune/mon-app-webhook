<script lang="ts">
  import { navigating } from '$app/stores';
  import { enhance } from '$app/forms'; // <-- AJOUTEZ CETTE LIGNE
  export let data;
</script>

<main class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
  <!-- Ce div utilise Flexbox pour aligner ses enfants -->
  <div class="flex justify-between items-center mb-8">
    
    <!-- Le titre reste le même, mais sans la marge du bas (mb-8) car le div parent s'en occupe -->
    <h1 class="text-3xl font-bold text-gray-900">
      Tableau de Bord des Commandes
    </h1>
    
    <!-- Voici le nouveau formulaire pour la déconnexion -->
    <form action="?/logout" method="POST" use:enhance>
      <button 
        type="submit" 
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        disabled={!!$navigating}
      >
        Déconnexion
      </button>
    </form>

  </div>

  {#if data.commandes && data.commandes.length > 0}
    <div class="space-y-6">
      <!-- On fait une boucle sur chaque commande pour créer une "carte" -->
      {#each data.commandes as commande}
        <div class="bg-white shadow-lg rounded-xl overflow-hidden transition hover:shadow-2xl">
          <!-- En-tête de la carte -->
          <div class="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-500">Commande</p>
              <p class="font-bold text-lg text-indigo-600">#{commande.order_id}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 text-right">Statut</p>
              <!-- Formulaire de mise à jour du statut -->
              <form method="POST" action="?/updateStatus" class="relative" use:enhance>
                <!-- On envoie l'ID de la commande en secret -->
                <input type="hidden" name="order_id" value={commande.order_id} />
                
                <select 
                  name="new_status"
                  class="appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  disabled={!!$navigating}
                  on:change={(e) => e.currentTarget.form?.requestSubmit()}
                >
                  <option value="pending" selected={commande.status === 'pending'}>En attente</option>
                  <option value="processing" selected={commande.status === 'processing'}>En cours</option>
                  <option value="on-hold" selected={commande.status === 'on-hold'}>En pause</option>
                  <option value="completed" selected={commande.status === 'completed'}>Terminée</option>
                  <option value="cancelled" selected={commande.status === 'cancelled'}>Annulée</option>
                  <option value="refunded" selected={commande.status === 'refunded'}>Remboursée</option>
                  <option value="failed" selected={commande.status === 'failed'}>Échouée</option>
                </select>
                
                <!-- Petite flèche pour le style du select -->
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </form>
            </div>
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Section Informations Client -->
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-800 border-b pb-2">Client & Livraison</h3>
              <p class="text-sm text-gray-600"><span class="font-medium text-gray-900">Nom:</span> {commande.customer_name}</p>
              <p class="text-sm text-gray-600"><span class="font-medium text-gray-900">Adresse:</span> {commande.shipping_address}</p>
              <p class="text-sm text-gray-600"><span class="font-medium text-gray-900">Ville:</span> {commande.shipping_city}</p>
              <p class="text-sm text-gray-600"><span class="font-medium text-gray-900">Téléphone:</span> {commande.billing_phone || 'N/A'}</p>
            </div>

            <!-- Section Détail Produits -->
            <!-- Remplacez l'ancienne section "Détail Produits" par celle-ci -->
            <div class="space-y-4">
              <h3 class="font-semibold text-gray-800 border-b pb-2">Produits Commandés</h3>
              {#if commande.line_items}
                {#each commande.line_items as item}
                  <!-- On utilise flex pour aligner l'image et le texte -->
                  <div class="flex items-center">
                    <!-- Affiche l'image si l'URL existe -->
                    {#if item.image_url}
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        class="w-16 h-16 object-cover rounded-md mr-4 border"
                      />
                    {/if}
                    
                    <div class="text-sm">
                      <p class="font-medium text-gray-900">{item.name} <span class="font-normal text-gray-600">x {item.quantity}</span></p>
                      <!-- Boucle pour afficher les variations (taille, couleur, etc.) -->
                      {#if item.meta_data && item.meta_data.length > 0}
                        {#each item.meta_data as meta}
                          <p class="text-xs text-gray-500">{meta.display_key}: {meta.display_value}</p>
                        {/each}
                      {/if}
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>

          <!-- Pied de la carte -->
          <div class="bg-gray-50 p-4 flex justify-between items-center">
            <p class="text-sm text-gray-500">
              Date: {new Date(commande.created_at).toLocaleString('fr-FR')}
            </p>
            <p class="text-xl font-bold text-gray-900">
              Total: {commande.total_amount} {commande.currency}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center py-12 bg-white shadow-md rounded-lg">
      <p class="text-gray-500">Aucune commande à afficher.</p>
    </div>
  {/if}
</main>