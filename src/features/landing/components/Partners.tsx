import communityFund from '@/assets/partners/community-fund.png';
import londonsLifelines from '@/assets/partners/londons-lifelines.png';
import nordVpn from '@/assets/partners/nordvpn.png';
import philanthropunks from '@/assets/partners/philanthropunks.png';
import refugeeEmploymentNetwork from '@/assets/partners/refugee-employment-network.png';
import theLiftProject from '@/assets/partners/the-lift-project.png';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';

interface Partner {
  readonly name: string;
  readonly image: string;
  /**
   * The logo's own background. Several of these are supplied as flat artwork
   * rather than transparent marks, so the card takes the brand's colour
   * instead of leaving a dark rectangle floating on a white tile.
   */
  readonly surface?: string;
}

const PARTNERS: readonly Partner[] = [
  { name: 'The National Lottery Community Fund', image: communityFund },
  { name: "London's Lifelines", image: londonsLifelines },
  { name: 'PhilanthroPunks', image: philanthropunks },
  { name: 'The Lift Project', image: theLiftProject, surface: '#1D475D' },
  { name: 'Refugee Employment Network', image: refugeeEmploymentNetwork, surface: '#000000' },
  { name: 'NordVPN', image: nordVpn, surface: '#EFF8FF' },
];

interface PartnerLogosProps {
  /** The second copy exists only to make the loop seamless. */
  duplicate?: boolean;
}

const PartnerLogos = ({ duplicate = false }: PartnerLogosProps) => (
  <ul
    aria-hidden={duplicate || undefined}
    className="m-0 flex shrink-0 list-none items-stretch gap-5 p-0 pr-5"
  >
    {PARTNERS.map((partner) => (
      <li
        key={partner.name}
        style={partner.surface ? { backgroundColor: partner.surface } : undefined}
        className="flex w-52 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-white px-6 py-5 shadow-card hc-outline sm:w-60"
      >
        <img
          src={partner.image}
          alt={duplicate ? '' : `${partner.name} logo`}
          // A fixed height would give square marks half the presence of wide
          // ones, so the box is capped in both directions instead — wide
          // logos hit the width limit, tall ones hit the height limit.
          className="max-h-20 w-auto max-w-full object-contain"
          loading="lazy"
        />
      </li>
    ))}
  </ul>
);

/** A paused-on-hover, continuously sliding acknowledgement of IGMS supporters. */
export const Partners = () => (
  <section
    id="partners"
    aria-labelledby="partners-heading"
    className="overflow-hidden bg-tint-marigold py-24"
  >
    <div className="mx-auto max-w-[80rem] px-6 md:px-12">
      <Reveal className="mb-10">
        <SectionHeading
          id="partners-heading"
          eyebrow="With thanks"
          title="Our partners & funders"
          align="center"
        />
        <p className="m-0 mt-4 text-center font-sans text-[0.9375rem] leading-relaxed text-charcoal">
          The organisations helping IGMS create inclusive opportunities.
        </p>
      </Reveal>
    </div>

    {/*
      role + tabIndex are both load-bearing:
      - aria-label on a bare div is ignored, so the region needs a role to
        carry its name;
      - nothing inside is focusable, so without a tab stop the CSS
        `:focus-within` pause could never fire for a keyboard user; and
      - under reduced motion this becomes a horizontally scrollable region,
        which has to be reachable by keyboard (WCAG 2.1.1).
    */}
    <div
      role="group"
      aria-label="IGMS partners and funders"
      tabIndex={0}
      className="partner-marquee overflow-hidden"
    >
      <div className="partner-marquee-track flex w-max">
        <PartnerLogos />
        <PartnerLogos duplicate />
      </div>
    </div>
  </section>
);
