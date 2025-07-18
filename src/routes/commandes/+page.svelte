<script lang="ts">
  import { navigating } from '$app/stores';
  import { enhance } from '$app/forms'; // "enhance" vient bien d'ici
  import type { SubmitFunction, ActionResult } from '@sveltejs/kit'; // <-- LES DEUX TYPES VIENNENT D'ICI
  import { slide, fade } from 'svelte/transition';
  // ...
  export let data;

  // NOUVEAU : Cette variable gardera en mémoire l'ID de la commande ouverte.
  // `null` signifie qu'aucune n'est ouverte.
  let openedOrderId: number | null = null;
  let notificationTimer: any; // Pour gérer le setTimeout

  // NOUVEAU : Les variables d'état pour notre notification
  let showNotification = false;
  let notificationMessage = '';

  // NOUVEAU : Cette fonction gère l'ouverture/fermeture des détails.
  function toggleDetails(orderId: number) {
    // Si on clique sur une commande déjà ouverte, on la ferme.
    if (openedOrderId === orderId) {
      openedOrderId = null;
    } else {
      // Sinon, on ouvre la commande cliquée.
      openedOrderId = orderId;
    }
  }

  // ... après la fonction toggleDetails(orderId) ...

  // NOUVEAU : Cette fonction retourne les classes de couleur pour un statut donné
  function getStatusColors(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-50 hover:bg-green-100'; // Vert pour les commandes terminées
      case 'processing':
        return 'bg-blue-50 hover:bg-blue-100'; // Bleu pour celles en cours
      case 'cancelled':
      case 'failed':
      case 'refunded':
        return 'bg-red-50 hover:bg-red-100'; // Rouge pour les problèmes
      case 'on-hold':
        return 'bg-yellow-50 hover:bg-yellow-100'; // Jaune pour celles en pause
      case 'pending':
      default:
        return 'bg-gray-50 hover:bg-gray-100'; // Gris par défaut
    }
  }

  const showUpdateNotification: SubmitFunction = ({ action }) => {
    return async ({ result }: { result: ActionResult }) => {
      if (result.type === 'success') {
        // On choisit le message en fonction de l'action qui a réussi
        if (action.href.endsWith('?/updateStatus')) {
          notificationMessage = 'Statut mis à jour avec succès !';
        } else if (action.href.endsWith('?/updateComment')) {
          notificationMessage = 'Note enregistrée avec succès !';
        } else {
          return; // Ne rien faire pour les autres actions (ex: logout)
        }
        
        showNotification = true;
        clearTimeout(notificationTimer);
        notificationTimer = setTimeout(() => {
          showNotification = false;
        }, 3000);
      }
    };
  };
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


  <!-- NOUVEAU : Section de recherche et de filtres -->
  <div class="mb-8 p-4 bg-white rounded-lg shadow">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <!-- Barre de recherche -->
      <div class="md:col-span-2">
        <form method="GET" class="relative">
          <input 
            type="search" 
            name="q"
            placeholder="Rechercher par nom, email..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={data.q || ''}
          />
          <!-- On garde le filtre de statut actif lors d'une recherche -->
          {#if data.status}
            <input type="hidden" name="status" value={data.status} />
          {/if}
          <div class="absolute top-0 left-0 pl-3 pt-2">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </form>
      </div>

      <!-- Filtres par statut -->
      <div class="flex items-center justify-center space-x-2">
        <a href={`?q=${data.q || ''}&status=all`} class:font-bold={!data.status || data.status === 'all'} class="px-3 py-1 rounded-full text-sm hover:bg-gray-200">Toutes</a>
        <a href={`?q=${data.q || ''}&status=processing`} class:font-bold={data.status === 'processing'} class="px-3 py-1 rounded-full text-sm hover:bg-gray-200">En cours</a>
        <a href={`?q=${data.q || ''}&status=completed`} class:font-bold={data.status === 'completed'} class="px-3 py-1 rounded-full text-sm hover:bg-gray-200">Terminée</a>
      </div>

    </div>
  </div>


  {#if data.commandes && data.commandes.length > 0}
    <div class="space-y-6">
      <!-- On fait une boucle sur chaque commande pour créer une "carte" -->
      <!-- Remplacez toute la boucle #each par celle-ci -->
      {#each data.commandes as commande (commande.order_id)}
        <div class="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300">
          
          <!-- NOUVEAU : L'en-tête est maintenant un bouton qui déclenche notre fonction -->
          <button 
            on:click={() => toggleDetails(commande.order_id)}
            class="w-full p-4 border-b border-gray-200 flex justify-between items-center text-left focus:outline-none {getStatusColors(commande.status)}"
          >
            <!-- Info Commande -->
            <div>
              <p class="text-sm text-gray-500">Commande</p>
              <p class="font-bold text-lg text-indigo-600">#{commande.order_id}</p>
            </div>
            
            <!-- Info Client & Total (résumé) -->
            <div class="hidden sm:block text-center">
              <p class="text-sm text-gray-500">Client</p>
              <p class="font-medium text-gray-800">{commande.customer_name}</p>
            </div>
            <div class="hidden md:block text-right">
              <p class="text-sm text-gray-500">Total</p>
              <p class="font-bold text-lg text-gray-900">{commande.total_amount} {commande.currency}</p>
            </div>

            <!-- NOUVEAU : Icône flèche qui tourne pour indiquer l'état ouvert/fermé -->
            <div class="ml-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6 text-gray-500 transition-transform duration-300" 
                style="transform: {openedOrderId === commande.order_id ? 'rotate(180deg)' : 'rotate(0deg)'}"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <!-- NOUVEAU : Cette section ne s'affiche que si la commande est "ouverte" -->
          {#if openedOrderId === commande.order_id}
            <div class="details-panel" transition:slide={{ duration: 300 }}>
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Section Informations Client & Livraison (détaillées) -->
                <div class="space-y-3">
                  <h3 class="font-semibold text-gray-800 border-b pb-2">Client & Livraison</h3>
                  <p class="text-sm text-gray-600"><span class="font-medium text-gray-900">Nom:</span> {commande.customer_name}</p>
                  <p class="text-sm text-gray-600"><span class="font-medium text-gray-900">Adresse:</span> {commande.shipping_address}</p>
                  <p class="text-sm text-gray-600"><span class="font-medium text-gray-900">Ville:</span> {commande.shipping_city}</p>
                  <p class="text-sm text-gray-600"><span class="font-medium text-gray-900">Téléphone:</span> {commande.billing_phone || 'N/A'}</p>
                </div>

                <!-- Section Détail Produits -->
                <div class="space-y-4">
                  <h3 class="font-semibold text-gray-800 border-b pb-2">Produits Commandés</h3>
                  {#if commande.line_items}
                    {#each commande.line_items as item}
                      <div class="flex items-center">
                        {#if item.image_url}
                          <img src={item.image_url} alt={item.name} class="w-16 h-16 object-cover rounded-md mr-4 border"/>
                        {/if}
                        <div class="text-sm">
                          <p class="font-medium text-gray-900">{item.name} <span class="font-normal text-gray-600">x {item.quantity}</span></p>
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

                <!-- NOUVEAU : Section des commentaires -->
                <div class="md:col-span-2 pt-6 border-t mt-6">
                  <h3 class="font-semibold text-gray-800 mb-2">Notes & Commentaires</h3>
                  <form method="POST" action="?/updateComment" use:enhance={showUpdateNotification}>
                    <input type="hidden" name="order_id" value={commande.order_id} />
                    <textarea
                      name="comment"
                      rows="4"
                      class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ajouter une note pour cette commande..."
                    >{commande.commentaires || ''}</textarea>
                    <div class="text-right mt-2">
                      <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={!!$navigating}
                      >
                        Enregistrer la note
                      </button>
                    </div>
                  </form>
                </div>

              </div>

              <!-- Pied de la carte avec le statut et la date -->
              <div class="bg-gray-50 p-4 flex justify-between items-center border-t">
                <div>
                  <p class="text-sm text-gray-500">Statut</p>
                  <!-- Le formulaire de mise à jour est maintenant ici, dans les détails -->
                  <form method="POST" action="?/updateStatus" class="relative" use:enhance={showUpdateNotification}>
                    <input type="hidden" name="order_id" value={commande.order_id} />
                    <select name="new_status" class="appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-gray-500" disabled={!!$navigating} on:change={(e) => e.currentTarget.form?.requestSubmit()}>
                      <option value="pending" selected={commande.status === 'pending'}>En attente</option>
                      <option value="processing" selected={commande.status === 'processing'}>En cours</option>
                      <option value="on-hold" selected={commande.status === 'on-hold'}>En pause</option>
                      <option value="completed" selected={commande.status === 'completed'}>Terminée</option>
                      <option value="cancelled" selected={commande.status === 'cancelled'}>Annulée</option>
                      <option value="refunded" selected={commande.status === 'refunded'}>Remboursée</option>
                      <option value="failed" selected={commande.status === 'failed'}>Échouée</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </form>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Date</p>
                  <p class="font-medium text-gray-800">{new Date(commande.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center py-12 bg-white shadow-md rounded-lg">
      <p class="text-gray-500">Aucune commande à afficher.</p>
    </div>
  {/if}

  <!-- NOUVEAU : Le composant "Toast" de notification -->
  {#if showNotification}
    <div
      transition:fade={{ duration: 300 }}
      class="fixed bottom-5 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-full shadow-lg text-sm"
    >
      {notificationMessage}
    </div>
  {/if}
</main>