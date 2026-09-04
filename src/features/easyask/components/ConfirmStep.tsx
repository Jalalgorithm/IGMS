import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/shared/Loading';
import type { ApiErrorShape } from '@/types';
import { questionsFor } from '../services/easyAskCopy';
import type { EasyAskContext, TransportMode } from '../types';

interface ConfirmStepProps {
  context: EasyAskContext;
  transportMode: TransportMode | null;
  difficulty: string;
  help: string;
  isGenerating: boolean;
  error: ApiErrorShape | null;
  onBack: () => void;
  onConfirm: () => void;
}

export const ConfirmStep = ({
  context,
  transportMode,
  difficulty,
  help,
  isGenerating,
  error,
  onBack,
  onConfirm,
}: ConfirmStepProps) => {
  const copy = questionsFor(context, transportMode);

  return (
    <div className="flex flex-col gap-5 p-5 sm:p-6">
      <p className="m-0 font-sans text-sm leading-relaxed text-warm-grey">
        This is what we have. Nothing is written yet — you can still change it.
      </p>

      <div className="flex flex-col gap-4">
        <div className="rounded-[var(--radius-tile)] bg-terracotta/8 p-4">
          <p className="m-0 mb-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
            {copy.one}
          </p>
          <p className="m-0 whitespace-pre-wrap font-sans text-[0.9375rem] leading-relaxed text-charcoal">
            {difficulty}
          </p>
        </div>

        <div className="rounded-[var(--radius-tile)] bg-marigold/12 p-4">
          <p className="m-0 mb-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
            {copy.two}
          </p>
          <p className="m-0 whitespace-pre-wrap font-sans text-[0.9375rem] leading-relaxed text-charcoal">
            {help}
          </p>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="m-0 rounded-xl border-[1.5px] border-terracotta bg-terracotta/8 px-4 py-3 font-sans text-sm leading-relaxed text-charcoal"
        >
          {error.message}
        </p>
      ) : null}

      {isGenerating ? (
        <Loading label="Writing your note" className="text-warm-grey" />
      ) : (
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button variant="secondary" onClick={onBack} className="sm:flex-1">
            Change something
          </Button>
          <Button onClick={onConfirm} className="sm:flex-[2]">
            Yes, write my note
          </Button>
        </div>
      )}
    </div>
  );
};
