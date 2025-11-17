import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import getSupabaseClientKeys from './get-supabase-client-keys';

const createServerSupabaseClient = cache(async () => {
  const keys = getSupabaseClientKeys();

  return createServerClient(keys.url, keys.anonKey, {
    cookies: await getCookiesStrategy(),
  });
});

const getSupabaseServerActionClient = cache(
  async (
    params = {
      admin: false,
    },
  ) => {
    const keys = getSupabaseClientKeys();

    if (params.admin) {
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!serviceRoleKey) {
        throw new Error('Supabase Service Role Key not provided');
      }

      return createServerClient(keys.url, serviceRoleKey, {
        auth: {
          persistSession: false,
        },
        cookies: {
          getAll: () => [],
        },
      });
    }

    return createServerSupabaseClient();
  },
);

async function getCookiesStrategy() {
  const cookieStore = await cookies();

  return {
    getAll: () => {
      return Array.from(cookieStore.getAll()).map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
      }));
    },
  };
}

export default getSupabaseServerActionClient;
