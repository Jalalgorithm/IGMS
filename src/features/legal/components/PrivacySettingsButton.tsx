import { cn } from '@/utils/classNames';
import { useConsentManager } from '../hooks/useConsentManager';

interface PrivacySettingsButtonProps {
  /** `dark` for the charcoal footer, `light` for ivory sections. */
  tone?: 'dark' | 'light';
  label?: string;
  className?: string;
}

const TONES = {
  dark: 'text-ivory/85 hover:text-marigold',
  light: 'text-terracotta hover:text-charcoal',
} as const;

/**
 * Reopens the Usercentrics consent panel.
 *
 * Usercentrics documents this as `href="javascript:UC_UI.showSecondLayer()"`.
 * That is a real button action rather than a link to a document, and a
 * `javascript:` URL is the first thing a Content-Security-Policy refuses — so
 * this is a button calling the same API. It renders nothing until the CMP is
 * actually loaded, rather than offering a dead click.
 */
export const PrivacySettingsButton = ({
  tone = 'dark',
  label = 'Privacy Settings',
  className,
}: PrivacySettingsButtonProps) => {
  const { isReady, openSettings } = useConsentManager();

  if (!isReady) return null;

  return (
    <button
      type="button"
      id={tone === 'dark' ? 'usercentrics-psl' : undefined}
      onClick={openSettings}
      className={cn(
        'font-sans text-sm font-medium underline-offset-4 hover:underline',
        TONES[tone],
        className,
      )}
    >
      {label}
    </button>
  );
};
