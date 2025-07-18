<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<main class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center text-gray-900">
      Accès au Tableau de Bord
    </h1>

    <form method="POST" class="space-y-6">
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <!-- Affiche le message d'erreur si le mot de passe est incorrect -->
      {#if form?.message}
        <p class="text-sm text-red-600">{form.message}</p>
      {/if}

      <div>
        <button
          type="submit"
          class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Se connecter
        </button>
      </div>
    </form>
  </div>
</main>