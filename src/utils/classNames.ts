type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Joins truthy class values. Deliberately tiny — the project has no need
 * for the conflict-resolution that `tailwind-merge` buys.
 */
export const cn = (...values: ClassValue[]): string => {
  const out: string[] = [];
  for (const value of values) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      out.push(String(value));
    }
  }
  return out.join(' ');
};
