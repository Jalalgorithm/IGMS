import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Loading } from '@/components/shared/Loading';
import type { ApplicantRole } from '../types';
import { useWaitlistForm } from '../hooks/useWaitlistForm';
import { ProgrammePicker } from './ProgrammePicker';
import { WaitlistSuccess } from './WaitlistSuccess';

const ROLE_OPTIONS: ReadonlyArray<{ value: ApplicantRole; label: string }> = [
  { value: 'participant', label: 'I would be taking part myself' },
  { value: 'parent-or-carer', label: 'I am a parent or carer' },
  { value: 'referrer', label: 'I am referring someone' },
  { value: 'partner-organisation', label: 'I am from a partner organisation' },
  { value: 'other', label: 'Something else' },
];

export const WaitlistForm = () => {
  const {
    values,
    visibleErrors,
    submitError,
    isSubmitting,
    entry,
    setField,
    markTouched,
    toggleProgramme,
    handleSubmit,
    reset,
  } = useWaitlistForm();

  if (entry) {
    return <WaitlistSuccess entry={entry} onAddAnother={reset} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-8 rounded-[var(--radius-card)] bg-white p-8 shadow-card hc-outline sm:p-10"
    >
      <ProgrammePicker
        selected={values.programmes}
        onToggle={toggleProgramme}
        error={visibleErrors.programmes}
      />

      <div className="grid gap-6 border-t border-sand pt-8 sm:grid-cols-2">
        <TextField
          label="First name"
          name="fullName"
          autoComplete="given-name"
          required
          value={values.fullName}
          onChange={(event) => setField('fullName', event.target.value)}
          onBlur={() => markTouched('fullName')}
          error={visibleErrors.fullName}
        />

        <TextField
          label="Email address"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(event) => setField('email', event.target.value)}
          onBlur={() => markTouched('email')}
          error={visibleErrors.email}
        />

        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => setField('phone', event.target.value)}
          onBlur={() => markTouched('phone')}
          error={visibleErrors.phone}
          hint="Only if you would rather we called."
        />

        <SelectField
          label="How are you joining?"
          name="role"
          value={values.role}
          onChange={(event) => setField('role', event.target.value as ApplicantRole)}
          options={ROLE_OPTIONS}
          hint="So we send you the right information."
          required
        />

        <div className="sm:col-span-2">
          <TextAreaField
            label="Any access requirements we should know about?"
            name="accessNeeds"
            value={values.accessNeeds}
            onChange={(event) => setField('accessNeeds', event.target.value)}
            hint="Interpreters, step-free access, quiet spaces, large print, someone to attend with you — tell us in your own words and we will work it out with you."
            rows={4}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t border-sand pt-8">
        <Checkbox
          name="consent"
          checked={values.consent}
          onChange={(event) => setField('consent', event.target.checked)}
          onBlur={() => markTouched('consent')}
          error={visibleErrors.consent}
          label="I am happy for IGMS to contact me about the programmes I have chosen. We will not pass your details to anyone else, and you can ask us to remove them at any time."
        />

        {submitError ? (
          <p
            role="alert"
            className="m-0 rounded-xl border-[1.5px] border-terracotta bg-terracotta/8 px-4 py-3 font-sans text-sm font-medium text-terracotta"
          >
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <Loading inline label="Sending" /> : null}
            {isSubmitting ? 'Joining the waitlist' : 'Join the waitlist'}
          </Button>
          <p className="m-0 font-sans text-sm text-warm-grey">
            No account needed. Takes about a minute.
          </p>
        </div>
      </div>
    </form>
  );
};
