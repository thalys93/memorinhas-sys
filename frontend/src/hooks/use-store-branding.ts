import {
  STORE_BIO_FALLBACK,
  STORE_LOCATION_FALLBACK,
  STORE_NAME_FALLBACK,
} from '@/constants/store-branding';
import { usePublicStore } from '@/hooks/queries';

export function useStoreBranding() {
  const { data: store, isError, isLoading, isFetched } = usePublicStore();

  const isConfigured = !!store && !isError;
  const profile = store?.settings?.profile;

  const name = isConfigured ? store.name : STORE_NAME_FALLBACK;
  const bio =
    isConfigured && profile?.bio?.trim() ? profile.bio.trim() : STORE_BIO_FALLBACK;
  const location =
    isConfigured && profile?.location?.trim()
      ? profile.location.trim()
      : STORE_LOCATION_FALLBACK;

  return {
    store,
    isLoading,
    isFetched,
    isConfigured,
    name,
    bio,
    location,
    logoVariant: isConfigured ? ('default' as const) : ('store' as const),
  };
}
