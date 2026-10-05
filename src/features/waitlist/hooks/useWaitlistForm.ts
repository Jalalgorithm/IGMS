import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  cleanText,
  hasErrors,
  isBlank,
  isEmail,
  isPersonName,
  normalise,
  type ValidationErrors,
} from '@/utils/validation';
import { DEFAULT_COUNTRY, toE164 } from '../services/countries';
import { useWaitlistUiStore } from '@/stores/waitlistUiStore';
import type {
  ContactChannel,
  PhoneMethod,
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
  phoneCountry: DEFAULT_COUNTRY,
  phoneMethods: [],
  role: 'participant',
  programmes: [],
  accessNeeds: '',
  contactChannels: [],
};

/** Match the backend limits in waitlist.validation.ts. */
export const NAME_MAX = 120;
export const EMAIL_MAX = 254;
export const ACCESS_NEEDS_MAX = 2000;

export const validateWaitlist = (
  values: WaitlistFormValues,
): ValidationErrors<WaitlistFormValues> => {
  const errors: ValidationErrors<WaitlistFormValues> = {};

  if (isBlank(values.fullName)) {
    errors.fullName = 'Enter your first name so we know what to call you.';
  } else if (normalise(values.fullName).length < 2) {
    errors.fullName = 'That name looks too short.';
  } else if (normalise(values.fullName).length > NAME_MAX) {
    errors.fullName = `Please keep your name under ${NAME_MAX} characters.`;
  } else if (!isPersonName(values.fullName)) {
    errors.fullName = 'Use letters only — spaces, hyphens and apostrophes are fine.';
  }

  if (isBlank(values.email)) {
    errors.email = 'Enter an email address so we can send your place.';
  } else if (values.email.trim().length > EMAIL_MAX || !isEmail(values.email)) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }

  // Phone is optional, but if given it has to be usable.
  if (!isBlank(values.phone) && !toE164(values.phone, values.phoneCountry)) {
    errors.phone = 'That does not look like a valid number for the country selected.';
  }

  if (values.accessNeeds.length > ACCESS_NEEDS_MAX) {
    errors.accessNeeds = `Please keep this under ${ACCESS_NEEDS_MAX} characters.`;
  }

  if (values.programmes.length === 0) {
    errors.programmes = 'Choose at least one programme to join the waitlist for.';
  }

  if (values.contactChannels.length === 0) {
    errors.contactChannels = 'Tick at least one way we can contact you about your place.';
  }

  // Mirrors the backend: a number needs a method, and a method needs a number.
  if (isBlank(values.phone)) {
    if (values.phoneMethods.length > 0 || values.contactChannels.includes('phone')) {
      errors.phone ??= 'Enter a phone number for us to call or WhatsApp.';
    }
  } else if (values.phoneMethods.length === 0) {
    errors.phoneMethods = 'Choose whether we should call or WhatsApp you.';
  }

  return errors;
};

const toSubmission = (values: WaitlistFormValues): WaitlistSubmission => {
  const submission: WaitlistSubmission = {
    fullName: normalise(values.fullName),
    email: cleanText(values.email).trim().toLowerCase(),
    role: values.role,
    programmes: values.programmes,
    consent: true,
    contactChannels: values.contactChannels,
  };
  if (!isBlank(values.phone)) {
    // Validated above, so the fallback never applies; it keeps types honest.
    submission.phone = toE164(values.phone, values.phoneCountry) ?? normalise(values.phone);
    submission.phoneMethods = values.phoneMethods;
  }
  if (!isBlank(values.accessNeeds)) submission.accessNeeds = cleanText(values.accessNeeds, true).trim();
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
  toggleContactChannel: (channel: ContactChannel) => void;
  togglePhoneMethod: (method: PhoneMethod) => void;
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
  // Stable, unlike the result object — see useEasyAskFlow.
  const { mutate, reset: resetMutation } = mutation;

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

  // Blur fires on pointer-down, before the click lands. Revealing an error
  // then shifts everything below it, so a tap on the next control (e.g.
  // WhatsApp right after typing a number) hits empty space. While a pointer
  // is down, hold the reveal until the click has been dispatched. Keyboard
  // blurs are unaffected.
  const pointerDown = useRef(false);
  const pendingTouched = useRef<Array<keyof WaitlistFormValues>>([]);

  useEffect(() => {
    const flush = () => {
      const keys = pendingTouched.current;
      pendingTouched.current = [];
      if (keys.length === 0) return;
      setTouched((previous) => {
        const next = { ...previous };
        for (const key of keys) next[key] = true;
        return next;
      });
    };
    const onDown = () => {
      pointerDown.current = true;
    };
    const onUp = () => {
      pointerDown.current = false;
      // After the click that follows this pointerup.
      window.setTimeout(flush, 0);
    };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('pointerup', onUp, true);
    document.addEventListener('pointercancel', onUp, true);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('pointerup', onUp, true);
      document.removeEventListener('pointercancel', onUp, true);
    };
  }, []);

  const markTouched = useCallback((key: keyof WaitlistFormValues) => {
    if (pointerDown.current) {
      pendingTouched.current.push(key);
      return;
    }
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

  const toggleContactChannel = useCallback((channel: ContactChannel) => {
    setValues((previous) => ({
      ...previous,
      contactChannels: previous.contactChannels.includes(channel)
        ? previous.contactChannels.filter((current) => current !== channel)
        : [...previous.contactChannels, channel],
    }));
  }, []);

  const togglePhoneMethod = useCallback((method: PhoneMethod) => {
    setValues((previous) => ({
      ...previous,
      phoneMethods: previous.phoneMethods.includes(method)
        ? previous.phoneMethods.filter((current) => current !== method)
        : [...previous.phoneMethods, method],
    }));
  }, []);

  const reset = useCallback(() => {
    setValues({ ...EMPTY_VALUES });
    setTouched({});
    setAttempted(false);
    setEntry(null);
    resetMutation();
  }, [resetMutation]);

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

      mutate(toSubmission(values), {
        onSuccess: (saved) => setEntry(saved),
      });
    },
    [values, mutate],
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
    toggleContactChannel,
    togglePhoneMethod,
    handleSubmit,
    reset,
  };
};
