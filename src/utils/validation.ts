export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Names in any script: letters and combining marks, joined by spaces,
 * apostrophes, hyphens or full stops. Rules out markup, digits and symbols
 * without rejecting "Zoë", "O'Neill", "Nguyễn" or "محمد".
 */
const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '’.-]+[\p{L}\p{M}]+)*\.?$/u;

/**
 * Invisible and control characters: C0/C1 controls, zero-width characters,
 * and the bidi overrides that can make text display differently from what it
 * contains. Newlines and tabs are handled separately for multi-line fields.
 */
const UNSAFE_CHARS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F​-‏‪-‮⁠-⁤⁦-⁯﻿]/g;

export const isBlank = (value: string | undefined | null): boolean =>
  !value || value.trim().length === 0;

export const isEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

/**
 * Removes invisible/control characters and normalises Unicode. Single-line
 * values also lose newlines; multi-line ones keep them (CRLF folded to LF).
 * Not a substitute for output escaping — React and the backend both escape —
 * but it keeps stored text equal to what a person can actually see.
 */
export const cleanText = (value: string, multiline = false): string => {
  const stripped = value.normalize('NFC').replace(UNSAFE_CHARS, '');
  return multiline ? stripped.replace(/\r\n?/g, '\n') : stripped.replace(/[\r\n\t]+/g, ' ');
};

/** Collapses runs of whitespace and trims — what we send to the API. */
export const normalise = (value: string): string => cleanText(value).trim().replace(/\s+/g, ' ');

export const isPersonName = (value: string): boolean => NAME_PATTERN.test(normalise(value));

export const hasErrors = <T,>(errors: ValidationErrors<T>): boolean =>
  Object.values(errors).some((message) => Boolean(message));
