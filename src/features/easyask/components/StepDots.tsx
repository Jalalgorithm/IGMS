import { cn } from '@/utils/classNames';
import type { EasyAskStep } from '../types';

const ORDER: readonly EasyAskStep[] = ['context', 'questions', 'confirm', 'note'];

const LABELS: Record<EasyAskStep, string> = {
  context: 'Choose where',
  questions: 'Two questions',
  confirm: 'Check',
  note: 'Your note',
};

interface StepDotsProps {
  current: EasyAskStep;
}

/**
 * Progress through the four steps. The dots are decorative — the position is
 * announced as text for anyone who cannot see them.
 */
export const StepDots = ({ current }: StepDotsProps) => {
  const index = ORDER.indexOf(current);

  return (
    <div className="flex shrink-0 items-center justify-center gap-2 border-t border-sand px-5 py-3">
      <p className="sr-only">
        Step {index + 1} of {ORDER.length}: {LABELS[current]}
      </p>
      {ORDER.map((step, position) => (
        <span
          key={step}
          aria-hidden="true"
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            position === index
              ? 'w-6 bg-terracotta'
              : position < index
                ? 'w-1.5 bg-terracotta/45'
                : 'w-1.5 bg-sand',
          )}
        />
      ))}
    </div>
  );
};
