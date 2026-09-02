export type PolicySlug =
  | 'privacy-policy'
  | 'terms-of-service'
  | 'disclaimer'
  | 'cookie-policy';

export interface PolicyDefinition {
  readonly slug: PolicySlug;
  /** Termageddon policy key. Doubles as the id of the div it fills. */
  readonly embedId: string;
  readonly title: string;
  /** One line under the heading, and the page meta description. */
  readonly summary: string;
}
