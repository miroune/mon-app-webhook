<script lang="ts">
  export let data;
</script>

<main class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">
    Tableau de Bord des Commandes
  </h1>

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
              <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {commande.status}
              </span>
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
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-800 border-b pb-2">Produits Commandés</h3>
              {#if commande.line_items}
                {#each commande.line_items as item}
                  <div class="text-sm border-l-4 border-indigo-200 pl-3">
                    <p class="font-medium text-gray-900">{item.name} <span class="font-normal text-gray-600">x {item.quantity}</span></p>
                    <!-- Boucle pour afficher les variations (taille, couleur, etc.) -->
                    {#if item.meta_data && item.meta_data.length > 0}
                      {#each item.meta_data as meta}
                        <p class="text-xs text-gray-500">{meta.display_key}: {meta.display_value}</p>
                      {/each}
                    {/if}
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