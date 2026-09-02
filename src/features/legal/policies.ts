import type { PolicyDefinition, PolicySlug } from './types';

/**
 * The four Termageddon-hosted policies. Each is rendered by fetching
 * Termageddon's embed script, which fills a div whose id is the policy key —
 * so `embedId` is load-bearing in two places and must not be edited by hand.
 */
export const POLICIES: readonly PolicyDefinition[] = [
  {
    slug: 'privacy-policy',
    embedId: 'VlVocVdXSkRSWFp1U1dzMVYwRTlQUT09',
    title: 'Privacy Policy',
    summary: 'What personal data IGMS collects, why, and what you can ask us to do with it.',
  },
  {
    slug: 'terms-of-service',
    embedId: 'ZUhwYU5IQjFjMnRvWXpZdmVFRTlQUT09',
    title: 'Terms of Service',
    summary: 'The terms you agree to when using this site and the services offered through it.',
  },
  {
    slug: 'disclaimer',
    embedId: 'UkZsNVNXRjFTRVp1VEU5T1VGRTlQUT09',
    title: 'Disclaimer',
    summary: 'The limits of the information published on this site.',
  },
  {
    slug: 'cookie-policy',
    embedId: 'VEhWd1dVRlNkbVV2VlV3emQyYzlQUT09',
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
