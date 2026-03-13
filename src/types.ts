/** Grammatical gender used when spelling Arabic numbers. */
export type SubjectGender = "masculine" | "feminine";

/** Case selection that affects duals and compound number forms. */
export type GrammaticalCase = "nominative" | "accusative" | "genitive";

/** Strategy used when trimming or rounding decimal remainders. */
export type RoundingStrategy = "truncate" | "round";

/**
 * Canonical noun forms used to attach a counted Arabic subject to a number.
 * Optional subunit metadata enables conversion-aware decimal formatting.
 */
export interface SubjectForms {
  singular: string;
  dual: string;
  plural: string;
  singularTanween: string;
  gender: SubjectGender;
  label?: string;
  aliases?: string[];
  subunit?: SubjectForms;
  minorUnitDigits?: number;
  minorUnitFactor?: number | string | bigint;
}

/** Currency-specific subject metadata. */
export interface CurrencyDefinition extends SubjectForms {
  code?: string;
}

/** Determines how decimal quantities should be phrased. */
export type DecimalStrategy = "auto" | "convert" | "separator";

/** Core formatter options shared by integer and counted-noun output. */
export interface TafqitOptions {
  gender?: SubjectGender;
  grammaticalCase?: GrammaticalCase;
  subject?: SubjectForms | [string, string, string, string];
  textToFollow?: boolean;
  legal?: boolean;
  comma?: boolean;
  useMiah?: boolean;
  splitHundreds?: boolean;
  useBillions?: boolean;
  scaleNames?: readonly string[];
  negativePrefix?: string;
  zeroText?: string;
}

/** Decimal and quantity formatting options. */
export interface TafqitDecimalOptions extends Omit<TafqitOptions, "subject"> {
  subject?: SubjectForms | CurrencyDefinition | [string, string, string, string];
  subunit?: SubjectForms | [string, string, string, string];
  fractionDigits?: number;
  rounding?: RoundingStrategy;
  decimalSeparatorWord?: string;
  decimalStrategy?: DecimalStrategy;
}

/** Standard result wrapper for safe lookups. */
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

/** Internal normalized representation of an integer input. */
export interface NormalizedIntegerInput {
  isNegative: boolean;
  digits: string;
}

/** Internal normalized representation of a decimal input. */
export interface NormalizedDecimalInput {
  isNegative: boolean;
  integerDigits: string;
  fractionDigits: string;
}
