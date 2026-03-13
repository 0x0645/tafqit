import { tafqit, tafqitDecimal, tafqitQuantity, tafqitWithSubject } from "./core";

import type { SubjectForms, TafqitDecimalOptions, TafqitOptions } from "./types";

/** Default options captured by a reusable formatter instance. */
export interface FormatterOptions extends TafqitDecimalOptions {
  subject: SubjectForms;
}

/** Creates a reusable formatter with shared default options. */
export const createFormatter = (defaults: FormatterOptions) => {
  return {
    /** Formats an integer using the formatter's default subject. */
    integer(number: number | bigint | string, options: Omit<TafqitOptions, "subject"> = {}) {
      return tafqitWithSubject(number, defaults.subject, { ...defaults, ...options });
    },

    /** Formats a decimal using the formatter's default decimal options. */
    decimal(number: number | bigint | string, options: Partial<TafqitDecimalOptions> = {}) {
      return tafqitDecimal(number, { ...defaults, ...options });
    },

    /** Formats a conversion-aware quantity using the formatter's default options. */
    quantity(number: number | bigint | string, options: Partial<TafqitDecimalOptions> = {}) {
      return tafqitQuantity(number, { ...defaults, ...options });
    },

    /** Formats a number without attaching a counted noun. */
    bare(number: number | bigint | string, options: TafqitOptions = {}) {
      return tafqit(number, { ...defaults, ...options, subject: undefined });
    }
  };
};
