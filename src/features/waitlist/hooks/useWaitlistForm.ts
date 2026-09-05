import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasErrors, isBlank, isEmail, isPhone, normalise, type ValidationErrors } from '@/utils/validation';
import { useWaitlistUiStore } from '@/stores/waitlistUiStore';
import type {
  ProgrammeId,
  WaitlistEntry,
  WaitlistFormValues,
  WaitlistSubmission,
} from '../types';
import { useJoinWaitlist } from '../services/waitlistQueries';

const EMPTY_VALUES: WaitlistFormValues = {
  fullName: '',
  email: '',
  phone: '',
  role: 'participant',
  programmes: [],
  accessNeeds: '',
  consent: false,
};

export const validateWaitlist = (
  values: WaitlistFormValues,
): ValidationErrors<WaitlistFormValues> => {
  const errors: ValidationErrors<WaitlistFormValues> = {};

  if (isBlank(values.fullName)) {
    errors.fullName = 'Enter your first name so we know what to call you.';
  } else if (normalise(values.fullName).length < 2) {
    errors.fullName = 'That name looks too short.';
  }

  if (isBlank(values.email)) {
    errors.email = 'Enter an email address so we can send your place.';
  } else if (!isEmail(values.email)) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }

  // Phone is optional, but if given it has to be usable.
  if (!isBlank(values.phone) && !isPhone(values.phone)) {
    errors.phone = 'Enter a phone number using digits, spaces and dashes only.';
  }

  if (values.programmes.length === 0) {
    errors.programmes = 'Choose at least one programme to join the waitlist for.';
  }

  if (!values.consent) {
    errors.consent = 'Tick the box to confirm we can contact you about your place.';
  }

  return errors;
};

const toSubmission = (values: WaitlistFormValues): WaitlistSubmission => {
  const submission: WaitlistSubmission = {
    fullName: normalise(values.fullName),
    email: values.email.trim().toLowerCase(),
    role: values.role,
    programmes: values.programmes,
    consent: true,
  };
  if (!isBlank(values.phone)) submission.phone = normalise(values.phone);
  if (!isBlank(values.accessNeeds)) submission.accessNeeds = values.accessNeeds.trim();
  return submission;
};

export interface UseWaitlistFormResult {
  values: WaitlistFormValues;
  errors: ValidationErrors<WaitlistFormValues>;
  /** Errors are only surfaced after a field is left, or after a submit attempt. */
  visibleErrors: ValidationErrors<WaitlistFormValues>;
  submitError: string | null;
  isSubmitting: boolean;
  entry: WaitlistEntry | null;
  setField: <K extends keyof WaitlistFormValues>(key: K, value: WaitlistFormValues[K]) => void;
  markTouched: (key: keyof WaitlistFormValues) => void;
  toggleProgramme: (id: ProgrammeId) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  reset: () => void;
}

export const useWaitlistForm = (): UseWaitlistFormResult => {
  const preselected = useWaitlistUiStore((state) => state.preselected);

  const [values, setValues] = useState<WaitlistFormValues>({
    ...EMPTY_VALUES,
    programmes: preselected,
  });
  const [touched, setTouched] = useState<Partial<Record<keyof WaitlistFormValues, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);

  const mutation = useJoinWaitlist();

  // A section elsewhere on the page can tick programmes for the visitor.
  useEffect(() => {
    if (preselected.length === 0) return;
    setValues((previous) => {
      const merged = Array.from(new Set([...previous.programmes, ...preselected]));
      return merged.length === previous.programmes.length ? previous : { ...previous, programmes: merged };
    });
  }, [preselected]);

  const errors = useMemo(() => validateWaitlist(values), [values]);

  const visibleErrors = useMemo(() => {
    if (attempted) return errors;
    const shown: ValidationErrors<WaitlistFormValues> = {};
    for (const key of Object.keys(errors) as Array<keyof WaitlistFormValues>) {
      if (touched[key]) shown[key] = errors[key];
    }
    return shown;
  }, [errors, touched, attempted]);

  const setField = useCallback(
    <K extends keyof WaitlistFormValues>(key: K, value: WaitlistFormValues[K]) => {
      setValues((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const markTouched = useCallback((key: keyof WaitlistFormValues) => {
    setTouched((previous) => ({ ...previous, [key]: true }));
  }, []);

  const toggleProgramme = useCallback((id: ProgrammeId) => {
    setValues((previous) => ({
      ...previous,
      programmes: previous.programmes.includes(id)
        ? previous.programmes.filter((current) => current !== id)
        : [...previous.programmes, id],
    }));
    setTouched((previous) => ({ ...previous, programmes: true }));
  }, []);

  const reset = useCallback(() => {
    setValues({ ...EMPTY_VALUES });
    setTouched({});
    setAttempted(false);
    setEntry(null);
    mutation.reset();
  }, [mutation]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setAttempted(true);

      const current = validateWaitlist(values);
      if (hasErrors(current)) {
        // Move the visitor to the first thing that needs fixing.
        const firstKey = (Object.keys(current) as Array<keyof WaitlistFormValues>)[0];
        if (firstKey) {
          const field = event.currentTarget.querySelector<HTMLElement>(
            `[name="${String(firstKey)}"], #waitlist-${String(firstKey)}`,
          );
          field?.focus();
        }
        return;
      }

      mutation.mutate(toSubmission(values), {
        onSuccess: (saved) => setEntry(saved),
      });
    },
    [values, mutation],
  );

  const fieldErrorsFromServer = mutation.error?.fieldErrors;
  const mergedVisible: ValidationErrors<WaitlistFormValues> = fieldErrorsFromServer
    ? { ...visibleErrors, ...(fieldErrorsFromServer as ValidationErrors<WaitlistFormValues>) }
    : visibleErrors;

  return {
    values,
    errors,
    visibleErrors: mergedVisible,
    submitError: mutation.error?.fieldErrors ? null : (mutation.error?.message ?? null),
    isSubmitting: mutation.isPending,
    entry,
    setField,
    markTouched,
    toggleProgramme,
    handleSubmit,
    reset,
  };
};
