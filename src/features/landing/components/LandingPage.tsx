import { Swoosh } from '@/components/shared/Swoosh';
import { WaitlistSection } from '@/features/waitlist';
import { About } from './About';
import { DisabilityAccess } from './DisabilityAccess';
import { EasyAsk } from './EasyAsk';
import { FocusAreas } from './FocusAreas';
import { GetInvolved } from './GetInvolved';
import { Hero } from './Hero';
import { LaunchPad } from './LaunchPad';
import { LiftProject } from './LiftProject';
import { Partners } from './Partners';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { StemSports } from './StemSports';
import { Testimonials } from './Testimonials';

/**
 * Section order is fixed by the brief. The rhythm alternates plain ivory with
 * tinted grounds so no two adjacent sections share a shape:
 *
 *   hero (full bleed) → about (asymmetric collage) → focus areas (card row)
 *   → disability & access (media split) → lift project (tint, calm)
 *   → stem sports (oversized numerals) → launchpad (tint, five-up)
 *   → easyask (dark panel) → testimonials → get involved → waitlist (tint)
 */
export const LandingPage = () => (
  <div className="mx-auto max-w-[100rem] bg-ivory">
    <SiteHeader />

    <main id="main" tabIndex={-1}>
      <Hero />
      <Swoosh variant="a" />
      <About />
      <FocusAreas />
      <Swoosh variant="b" />
      <DisabilityAccess />
      <LiftProject />
      <StemSports />
      <LaunchPad />
      <EasyAsk />
      <Swoosh variant="c" />
      <Partners />
      <Testimonials />
      <GetInvolved />
      <WaitlistSection />
    </main>

    <SiteFooter />
  </div>
);
