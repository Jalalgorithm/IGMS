import { useCallback, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useEasyAskFlow } from '../hooks/useEasyAskFlow';
import { getContextCopy } from '../services/easyAskCopy';
import { ConfirmStep } from './ConfirmStep';
import { ContextStep } from './ContextStep';
import { NoteStep } from './NoteStep';
import { QuestionsStep } from './QuestionsStep';
import { StepDots } from './StepDots';

interface EasyAskModalProps {
  open: boolean;
  onClose: () => void;
}

const BackIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
    <path
      d="M15 5 8 12l7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EasyAskModal = ({ open, onClose }: EasyAskModalProps) => {
  const flow = useEasyAskFlow();
  const { reset, step, goToStep, context } = flow;

  // Wiping on close is the feature, not tidiness: the tool promises nothing is
  // kept, so the answers must not survive to the next time it is opened.
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleBack = useCallback(() => {
    if (step === 'questions') goToStep('context');
    else if (step === 'confirm') goToStep('questions');
    else if (step === 'note') goToStep('questions');
  }, [step, goToStep]);

  const title =
    step === 'context'
      ? 'EasyAsk'
      : context
        ? `EasyAsk — ${getContextCopy(context).label}`
        : 'EasyAsk';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={<StepDots current={step} />}
      headerLeft={
        step !== 'context' ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back a step"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-charcoal/20 text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory"
          >
            <BackIcon />
          </button>
        ) : null
      }
    >
      {step === 'context' ? (
        <ContextStep
          context={flow.context}
          transportMode={flow.transportMode}
          canStart={flow.canStart}
          onSelectContext={flow.selectContext}
          onSelectMode={flow.selectTransportMode}
          onStart={() => goToStep('questions')}
        />
      ) : null}

      {step === 'questions' && context ? (
        <QuestionsStep
          context={context}
          transportMode={flow.transportMode}
          difficulty={flow.difficulty}
          help={flow.help}
          canConfirm={flow.canConfirm}
          onDifficultyChange={flow.setDifficulty}
          onHelpChange={flow.setHelp}
          onBack={handleBack}
          onNext={() => goToStep('confirm')}
        />
      ) : null}

      {step === 'confirm' && context ? (
        <ConfirmStep
          context={context}
          transportMode={flow.transportMode}
          difficulty={flow.difficulty}
          help={flow.help}
          isGenerating={flow.isGenerating}
          error={flow.error}
          onBack={handleBack}
          onConfirm={flow.generate}
        />
      ) : null}

      {step === 'note' && flow.note ? (
        <NoteStep note={flow.note} onEdit={handleBack} onRestart={reset} />
      ) : null}
    </Modal>
  );
};
