import { Button } from '@/components/ui/Button';
import { questionsFor } from '../services/easyAskCopy';
import type { EasyAskContext, TransportMode } from '../types';
import { AnswerField } from './AnswerField';

interface QuestionsStepProps {
  context: EasyAskContext;
  transportMode: TransportMode | null;
  difficulty: string;
  help: string;
  canConfirm: boolean;
  onDifficultyChange: (value: string) => void;
  onHelpChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const QuestionsStep = ({
  context,
  transportMode,
  difficulty,
  help,
  canConfirm,
  onDifficultyChange,
  onHelpChange,
  onBack,
  onNext,
}: QuestionsStepProps) => {
  const copy = questionsFor(context, transportMode);

  return (
    <div className="flex flex-col gap-4 p-5 sm:p-6">
      <p className="m-0 font-sans text-sm leading-relaxed text-warm-grey">{copy.intro}</p>

      <AnswerField
        label={`1. ${copy.one}`}
        hint={copy.hintOne}
        value={difficulty}
        onChange={onDifficultyChange}
        autoFocus
      />

      <AnswerField
        label={`2. ${copy.two}`}
        hint={copy.hintTwo}
        value={help}
        onChange={onHelpChange}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button variant="secondary" onClick={onBack} className="sm:flex-1">
          Back
        </Button>
        <Button onClick={onNext} disabled={!canConfirm} className="sm:flex-[2]">
          Check my answers
        </Button>
      </div>
    </div>
  );
};
