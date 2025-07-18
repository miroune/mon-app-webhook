// src/lib/server/supabase.ts
import { createClient } from '@supabase/supabase-js';

// LA CORRECTION DÉFINITIVE :
// Les variables publiques viennent du module "public"...
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
// ...et les variables privées viennent du module "private" !
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

// Le reste du code utilise ces variables importées
export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY
);