import type { PolicyDefinition, PolicySlug } from './types';

/**
 * The four Termageddon-hosted policies. Each is rendered by fetching
 * Termageddon's embed script, which fills a div whose id is the policy key —
 * so `embedId` is load-bearing in two places. Keys come from VITE_TERMAGEDDON_*_ID
 * (see .env.example), falling back to the current published keys.
 */
/**
 * Termageddon keys are base64-ish tokens. Anything else is rejected rather
 * than interpolated into a script URL, so a bad env value cannot point the
 * embed at another host or path.
 */
const EMBED_ID = /^[A-Za-z0-9]+={0,2}$/;

const embedIdFrom = (configured: string | undefined, fallback: string): string => {
  const value = configured?.trim();
  return value && EMBED_ID.test(value) ? value : fallback;
};

const env = import.meta.env;

export const POLICIES: readonly PolicyDefinition[] = [
  {
    slug: 'privacy-policy',
    embedId: embedIdFrom(env.VITE_TERMAGEDDON_PRIVACY_ID, 'VlVocVdXSkRSWFp1U1dzMVYwRTlQUT09'),
    title: 'Privacy Policy',
    summary: 'What personal data IGMS collects, why, and what you can ask us to do with it.',
  },
  {
    slug: 'terms-of-service',
    embedId: embedIdFrom(env.VITE_TERMAGEDDON_TERMS_ID, 'ZUhwYU5IQjFjMnRvWXpZdmVFRTlQUT09'),
    title: 'Terms of Service',
    summary: 'The terms you agree to when using this site and the services offered through it.',
  },
  {
    slug: 'disclaimer',
    embedId: embedIdFrom(env.VITE_TERMAGEDDON_DISCLAIMER_ID, 'UkZsNVNXRjFTRVp1VEU5T1VGRTlQUT09'),
    title: 'Disclaimer',
    summary: 'The limits of the information published on this site.',
  },
  {
    slug: 'cookie-policy',
    embedId: embedIdFrom(env.VITE_TERMAGEDDON_COOKIES_ID, 'VEhWd1dVRlNkbVV2VlV3emQyYzlQUT09'),
    title: 'Cookie Policy',
    summary: 'The cookies this site sets, what they do, and how to change your choices.',
  },
];

const BY_SLUG = new Map<PolicySlug, PolicyDefinition>(POLICIES.map((p) => [p.slug, p]));

export const getPolicy = (slug: PolicySlug): PolicyDefinition | undefined => BY_SLUG.get(slug);

/** Public URL for a policy, used by the footer and by Termageddon's fallback. */
export const policyPath = (slug: PolicySlug): string => `/${slug}`;

export const termageddonFallbackUrl = (embedId: string): string =>
  `https://policies.termageddon.com/api/policy/${embedId}`;
