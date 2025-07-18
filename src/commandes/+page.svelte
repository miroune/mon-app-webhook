<script lang="ts">
  // SvelteKit nous donne automatiquement accès aux données renvoyées par la fonction `load`.
  // On les récupère ici pour les utiliser dans notre HTML.
  export let data;
</script>

<main class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">
    Dernières Commandes WooCommerce
  </h1>

  <!-- On vérifie s'il y a des commandes à afficher -->
  {#if data.commandes && data.commandes.length > 0}
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- On fait une boucle sur chaque commande pour créer une ligne de tableau -->
          {#each data.commandes as commande}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{commande.order_id}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{commande.customer_name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{commande.total_amount} {commande.currency}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {commande.status}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(commande.created_at).toLocaleString('fr-FR')}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <!-- Message affiché s'il n'y a aucune commande -->
    <div class="text-center py-12 bg-white shadow-md rounded-lg">
      <p class="text-gray-500">Aucune commande n'a encore été enregistrée.</p>
    </div>
  {/if}
</main>