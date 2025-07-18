// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const password = data.get('password');

    // On compare le mot de passe fourni avec celui dans nos variables d'environnement
    if (password !== env.DASHBOARD_PASSWORD) {
      // Si c'est faux, on renvoie une erreur
      return fail(401, { message: 'Mot de passe incorrect.' });
    }

    // Si c'est bon, on crée un cookie sécurisé
    cookies.set('session', 'loggedin', {
      path: '/', // Le cookie est valide pour tout le site
      httpOnly: true, // Le cookie n'est pas accessible en JavaScript côté client (sécurité XSS)
      sameSite: 'strict', // Le cookie n'est envoyé que pour les requêtes provenant du même site
      secure: process.env.NODE_ENV === 'production', // Le cookie n'est envoyé que sur HTTPS en production
      maxAge: 60 * 60 * 24 * 7 // Durée de vie du cookie : 1 semaine
    });

    // Et on redirige l'utilisateur vers le tableau de bord
    throw redirect(303, '/commandes');
  }
};