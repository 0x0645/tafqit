import type {
  DecimalStrategy,
  GrammaticalCase,
  NormalizedDecimalInput,
  NormalizedIntegerInput,
  SubjectForms,
  SubjectGender,
  TafqitDecimalOptions,
  TafqitOptions
} from "./types";

const DEFAULT_SCALES = [
  "",
  "ألف",
  "مليون",
  "مليار",
  "ترليون",
  "كوادرليون",
  "كوينتليون",
  "سكستليون",
  "سبتليون",
  "وكتليون",
  "نونليون"
];

const SCALE_PLURALS = ["", "آلاف", "ملايين", "مليارات"];

const MALE_TABLE = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة"];
const FEMALE_TABLE = ["", "واحدة", "اثنتان", "ثلاث", "أربع", "خمس", "ست", "سبع", "ثمان", "تسع", "عشر"];

interface ResolvedOptions {
  gender: SubjectGender;
  grammaticalCase: GrammaticalCase;
  subject?: SubjectForms;
  textToFollow: boolean;
  legal: boolean;
  comma: boolean;
  useMiah: boolean;
  splitHundreds: boolean;
  useBillions: boolean;
  scaleNames: string[];
  negativePrefix: string;
  zeroText: string;
}

interface NumberTables {
  units: string[];
  teens: string[];
}

interface TripletConversion {
  words: string;
  num99: number;
}

/** Normalizes tuple-style subject input into the canonical subject object shape. */
const normalizeSubject = (subject: TafqitOptions["subject"], gender: SubjectGender): SubjectForms | undefined => {
  if (!subject) {
    return undefined;
  }

  if (Array.isArray(subject)) {
    const [singular, dual, plural, singularTanween] = subject;
    if (!singular || !dual || !plural || !singularTanween) {
      return undefined;
    }
    return { singular, dual, plural, singularTanween, gender };
  }

  return subject;
};

/** Resolves public formatter options into a fully populated internal structure. */
const resolveOptions = (options: TafqitOptions = {}): ResolvedOptions => {
  const subject = normalizeSubject(options.subject, options.gender ?? "masculine");
  const gender = subject?.gender ?? options.gender ?? "masculine";

  return {
    gender,
    grammaticalCase: options.grammaticalCase ?? "nominative",
    subject,
    textToFollow: Boolean(options.textToFollow || subject),
    legal: Boolean(options.legal),
    comma: Boolean(options.comma),
    useMiah: Boolean(options.useMiah),
    splitHundreds: Boolean(options.splitHundreds),
    useBillions: Boolean(options.useBillions),
    scaleNames: [...(options.scaleNames ?? DEFAULT_SCALES)],
    negativePrefix: options.negativePrefix ?? "سالب",
    zeroText: options.zeroText ?? "صفر"
  };
};

/** Builds the unit and teen word tables for the current grammatical context. */
const buildTables = (gender: SubjectGender, grammaticalCase: GrammaticalCase): NumberTables => {
  const units = [...(gender === "feminine" ? FEMALE_TABLE : MALE_TABLE)];
  const teens = [...units];
  const isAG = grammaticalCase !== "nominative";

  if (gender === "feminine") {
    teens[0] = MALE_TABLE[10];
    teens[1] = "إحدى";
    teens[2] = isAG ? "اثنتي" : "اثنتا";
    units[2] = isAG ? "اثنتين" : "اثنتان";
    if (units[1] && units[1] === "واحدة") {
      units[1] = "إحدى";
    }
  } else {
    teens[0] = FEMALE_TABLE[10];
    teens[1] = "أحد";
    teens[2] = isAG ? "اثني" : "اثنا";
    units[2] = isAG ? "اثنين" : "اثنان";
  }

  return { units, teens };
};

/** Converts Arabic-Indic digits into ASCII digits before parsing. */
const normalizeDigits = (raw: string): string => raw.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

/** Removes spacing and locale separators from numeric input strings. */
const normalizeNumericString = (raw: string): string =>
  normalizeDigits(raw)
    .trim()
    .replace(/[,_\s،٬]/g, "")
    .replace(/٫/g, ".");

/** Validates and normalizes an integer-like input. */
const normalizeIntegerInput = (input: number | bigint | string): NormalizedIntegerInput => {
  if (typeof input === "bigint") {
    return {
      isNegative: input < 0n,
      digits: (input < 0n ? -input : input).toString()
    };
  }

  if (typeof input === "number") {
    if (!Number.isFinite(input)) {
      throw new TypeError("Input number must be finite.");
    }
    if (!Number.isInteger(input)) {
      throw new TypeError("tafqit() only accepts integers. Use tafqitDecimal() for decimal values.");
    }
    const normalized = Math.abs(input).toString();
    return { isNegative: input < 0, digits: normalized };
  }

  const normalized = normalizeNumericString(input);
  if (!/^[+-]?\d+(?:\.0*)?$/.test(normalized)) {
    throw new TypeError("Invalid integer input.");
  }

  const isNegative = normalized.startsWith("-");
  const digits = normalized.replace(/^[+-]/, "").replace(/\.0*$/, "").replace(/^0+(?=\d)/, "") || "0";
  return { isNegative, digits };
};

/** Validates and normalizes a decimal-like input. */
const normalizeDecimalInput = (input: number | bigint | string): NormalizedDecimalInput => {
  if (typeof input === "bigint") {
    return {
      isNegative: input < 0n,
      integerDigits: (input < 0n ? -input : input).toString(),
      fractionDigits: ""
    };
  }

  if (typeof input === "number") {
    if (!Number.isFinite(input)) {
      throw new TypeError("Input number must be finite.");
    }
    input = input.toString();
  }

  const normalized = normalizeNumericString(String(input));
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) {
    throw new TypeError("Invalid decimal input.");
  }

  const isNegative = normalized.startsWith("-");
  const unsigned = normalized.replace(/^[+-]/, "");
  const [integerPart, fractionPart = ""] = unsigned.split(".");

  return {
    isNegative,
    integerDigits: (integerPart || "0").replace(/^0+(?=\d)/, "") || "0",
    fractionDigits: fractionPart
  };
};

/** Adds one to a non-negative integer represented as a string. */
const incrementIntegerString = (digits: string): string => {
  let carry = 1;
  let output = "";

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    const next = Number(digits[index]) + carry;
    if (next === 10) {
      output = "0" + output;
      carry = 1;
    } else {
      output = String(next) + output;
      carry = 0;
    }
  }

  return carry ? `1${output}` : output;
};

/** Adds a bigint delta to a non-negative integer string. */
const addIntegerString = (digits: string, value: bigint): string => {
  if (value === 0n) {
    return digits;
  }

  return (BigInt(digits) + value).toString();
};

/** Truncates or rounds a normalized decimal input to the requested precision. */
const quantizeDecimal = (input: NormalizedDecimalInput, fractionDigits: number, rounding: "truncate" | "round") => {
  if (fractionDigits <= 0) {
    if (rounding === "round" && Number(input.fractionDigits[0] ?? 0) >= 5) {
      return { integerDigits: incrementIntegerString(input.integerDigits), fractionDigits: "" };
    }
    return { integerDigits: input.integerDigits, fractionDigits: "" };
  }

  const padded = (input.fractionDigits + "0".repeat(fractionDigits + 1)).slice(0, fractionDigits + 1);
  let fraction = padded.slice(0, fractionDigits);
  let integerDigits = input.integerDigits;

  if (rounding === "round" && Number(padded[fractionDigits] ?? 0) >= 5) {
    let carry = 1;
    let rounded = "";
    for (let index = fraction.length - 1; index >= 0; index -= 1) {
      const next = Number(fraction[index]) + carry;
      if (next === 10) {
        rounded = "0" + rounded;
        carry = 1;
      } else {
        rounded = String(next) + rounded;
        carry = 0;
      }
    }
    fraction = rounded;
    if (carry) {
      integerDigits = incrementIntegerString(integerDigits);
      fraction = "0".repeat(fractionDigits);
    }
  }

  return { integerDigits, fractionDigits: fraction };
};

/** Converts any supported factor representation into bigint form. */
const factorToBigInt = (value: number | string | bigint | undefined): bigint | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "bigint" ? value : BigInt(value);
};

/** Returns the base-10 exponent for factors such as 100 or 1000 when exact. */
const getPowerOfTenExponent = (value: bigint): number | undefined => {
  if (value <= 0n) {
    return undefined;
  }

  let current = value;
  let exponent = 0;
  while (current > 1n && current % 10n === 0n) {
    current /= 10n;
    exponent += 1;
  }

  return current === 1n ? exponent : undefined;
};

/** Converts a decimal fraction string into minor-unit counts. */
const fractionToMinorUnits = (fractionDigits: string, factor: bigint, rounding: "truncate" | "round"): bigint => {
  if (!fractionDigits || /^0+$/.test(fractionDigits)) {
    return 0n;
  }

  const numerator = BigInt(fractionDigits) * factor;
  const denominator = 10n ** BigInt(fractionDigits.length);

  if (rounding === "round") {
    return (numerator + denominator / 2n) / denominator;
  }

  return numerator / denominator;
};

/** Wraps formal financial/legal wording around a rendered phrase when requested. */
const wrapLegalPhrase = (text: string, legal: boolean): string => (legal ? `فقط ${text} لا غير` : text);

/** Selects the decimal rendering strategy for the current subject. */
const resolveDecimalStrategy = (subject: SubjectForms | undefined, options: TafqitDecimalOptions): DecimalStrategy => {
  if (options.decimalStrategy && options.decimalStrategy !== "auto") {
    return options.decimalStrategy;
  }

  return subject?.subunit && subject.minorUnitFactor ? "convert" : "separator";
};

/** Chooses the noun form used after separator-style decimal wording. */
const getDecimalUnitTail = (subject: SubjectForms, integerDigits: string): string =>
  integerDigits === "0" ? subject.singular : subject.singularTanween;

/** Left-pads a digit string so it can be split into triplets. */
const padTriplets = (digits: string): string => digits.padStart(digits.length + ((3 - (digits.length % 3 || 3)) % 3), "0");

/** Returns the singular and plural scale labels for the given triplet position. */
const resolveScaleName = (scaleNames: string[], scalePos: number, useBillions: boolean): { singular: string; plural: string } => {
  let singular = scaleNames[scalePos] ?? "";
  let plural = SCALE_PLURALS[scalePos] ?? `${singular}ات`;

  if (useBillions && scalePos === 3) {
    singular = "بليون";
    plural = "بلايين";
  }

  return { singular, plural };
};

/** Converts one three-digit chunk into Arabic words. */
const convertTriplet = (
  triplet: number,
  scalePos: number,
  isLastEffectiveTriplet: boolean,
  options: ResolvedOptions
): TripletConversion => {
  const grammaticalCase = options.grammaticalCase;
  const isAG = grammaticalCase !== "nominative";
  const scale = resolveScaleName(options.scaleNames, scalePos, options.useBillions);
  const useFeminineTables = scalePos === 0 && options.gender === "feminine";
  const tables = buildTables(useFeminineTables ? "feminine" : "masculine", grammaticalCase);
  const num99 = triplet % 100;
  const hundreds = Math.trunc(triplet / 100);
  const unit = num99 % 10;
  const tens = Math.trunc(num99 / 10);
  const miahWord = options.useMiah ? "مئة" : "مائة";
  const hundredDualStem = miahWord.slice(0, -1);
  const conjunction = " و";
  const tanween = "ًا";
  const taa = isAG ? "تي" : "تا";
  const taan = isAG ? "تين" : "تان";
  const aa = isAG ? "ي" : "ا";
  const aan = isAG ? "ين" : "ان";
  const woon = isAG ? "ين" : "ون";

  let hundredWords = "";
  let remainderWords = "";

  if (hundreds > 0) {
    if (hundreds > 2) {
      hundredWords = `${FEMALE_TABLE[hundreds]}${options.splitHundreds ? " " : ""}${miahWord}`;
    } else if (hundreds === 1) {
      hundredWords = miahWord;
    } else {
      hundredWords = `${hundredDualStem}${scale.singular && !num99 || options.textToFollow ? taa : taan}`;
    }
  }

  if (num99 > 19) {
    const tensWord = `${tens === 2 ? "عشر" : FEMALE_TABLE[tens]}${woon}`;
    remainderWords = `${tables.units[unit]}${unit ? conjunction : ""}${tensWord}`;
  } else if (num99 > 10) {
    remainderWords = `${tables.teens[num99 - 10]} ${tables.teens[0]}`;
  } else if (num99 > 2 || num99 === 0 || !options.subject) {
    remainderWords = tables.units[num99];
  }

  let words = `${hundredWords}${hundreds && num99 ? conjunction : ""}${remainderWords}`;

  if (scale.singular) {
    const legalText = options.legal && num99 < 3 ? ` ${scale.singular}` : "";
    const scaleHead = `${hundredWords ? `${hundredWords}${legalText}${conjunction}` : ""}${scale.singular}`;

    if (num99 > 2) {
      words += ` ${num99 > 10 ? `${scale.singular}${isLastEffectiveTriplet && options.textToFollow ? "" : tanween}` : scale.plural}`;
    } else if (num99 === 0) {
      words += ` ${scale.singular}`;
    } else if (num99 === 1) {
      words = scaleHead;
    } else {
      words = `${scaleHead}${isLastEffectiveTriplet && options.textToFollow ? aa : aan}`;
    }
  }

  return { words, num99 };
};

/** Selects the counted noun form that should follow the rendered integer phrase. */
const getSubjectTail = (numberDigits: string, options: ResolvedOptions): string => {
  if (!options.subject) {
    return "";
  }

  const lowTriplet = Number(numberDigits.slice(-3));
  const lastTwo = lowTriplet % 100;
  const subject = options.subject;
  const singularAdjective = options.gender === "feminine" ? "واحدة" : "واحد";
  const dualAdjective =
    options.gender === "feminine"
      ? options.grammaticalCase === "nominative"
        ? "اثنتان"
        : "اثنتين"
      : options.grammaticalCase === "nominative"
        ? "اثنان"
        : "اثنين";

  if (lastTwo > 10) {
    return subject.singularTanween;
  }
  if (lastTwo > 2) {
    return subject.plural;
  }
  if (lastTwo === 2) {
    return `${subject.dual} ${dualAdjective}`;
  }
  if (lastTwo === 1) {
    return `${subject.singular} ${singularAdjective}`;
  }
  return subject.singular;
};

/** Converts an integer number into Arabic words. */
export const tafqit = (input: number | bigint | string, options: TafqitOptions = {}): string => {
  const resolved = resolveOptions(options);
  const normalized = normalizeIntegerInput(input);

  if (normalized.digits === "0") {
    const zeroText = resolved.subject ? `${resolved.zeroText} ${resolved.subject.singular}` : resolved.zeroText;
    return normalized.isNegative ? `${resolved.negativePrefix} ${zeroText}` : zeroText;
  }

  const padded = padTriplets(normalized.digits);
  const parts: string[] = [];

  for (let offset = 0; offset < padded.length; offset += 3) {
    const triplet = Number(padded.slice(offset, offset + 3));
    if (!triplet) {
      continue;
    }

    const remaining = padded.slice(offset + 3);
    const scalePos = (padded.length - offset) / 3 - 1;
    const isLastEffectiveTriplet = /^0*$/.test(remaining);
    const { words } = convertTriplet(triplet, scalePos, isLastEffectiveTriplet, resolved);
    parts.push(words);
  }

  let result = parts.join(resolved.comma ? "، و" : " و");

  if (resolved.subject) {
    result = `${result} ${getSubjectTail(normalized.digits, resolved)}`;
  }

  if (normalized.isNegative) {
    result = `${resolved.negativePrefix} ${result}`;
  }

  return result.trim();
};

/** Converts an integer number and appends the selected counted noun. */
export const tafqitWithSubject = (input: number | bigint | string, subject: SubjectForms, options: Omit<TafqitOptions, "subject"> = {}): string => {
  return tafqit(input, { ...options, subject });
};

/** Formats a decimal quantity using conversion-aware rules when unit metadata exists. */
export const tafqitQuantity = (input: number | bigint | string, options: TafqitDecimalOptions = {}): string => {
  return tafqitDecimal(input, options);
};

/** Formats decimal values using either subunits or a textual separator. */
export const tafqitDecimal = (input: number | bigint | string, options: TafqitDecimalOptions = {}): string => {
  const normalized = normalizeDecimalInput(input);
  const subject = normalizeSubject(options.subject, options.gender ?? "masculine");
  const subunit = normalizeSubject(options.subunit, options.gender ?? "masculine") ?? subject?.subunit;
  const decimalStrategy = resolveDecimalStrategy(subject, options);
  const rounding = options.rounding ?? "truncate";
  const factor = factorToBigInt(subject?.minorUnitFactor);
  const derivedFractionDigits =
    options.fractionDigits ??
    subject?.minorUnitDigits ??
    (factor ? getPowerOfTenExponent(factor) : undefined);

  if (decimalStrategy === "convert" && subject && subunit && factor) {
    const source = derivedFractionDigits === undefined ? normalized : quantizeDecimal(normalized, derivedFractionDigits, rounding);
    const minorTotal = fractionToMinorUnits(source.fractionDigits, factor, derivedFractionDigits === undefined ? rounding : "truncate");
    const majorCarry = minorTotal / factor;
    const minorRemainder = minorTotal % factor;
    const integerDigits = addIntegerString(source.integerDigits, majorCarry);
    const majorText = integerDigits !== "0" ? tafqit(integerDigits, { ...options, subject }) : "";
    const minorText = minorRemainder > 0n ? tafqit(minorRemainder.toString(), { ...options, subject: subunit }) : "";

    let combined = "";
    if (majorText && minorText) {
      combined = `${majorText} و${minorText}`;
    } else {
      combined = majorText || minorText || tafqit("0", { ...options, subject });
    }

    combined = wrapLegalPhrase(combined, Boolean(options.legal));
    return normalized.isNegative ? `${options.negativePrefix ?? "سالب"} ${combined}` : combined;
  }

  const quantified = options.fractionDigits === undefined ? normalized : quantizeDecimal(normalized, options.fractionDigits, rounding);
  const majorText = tafqit(quantified.integerDigits, subject ? { ...options, subject } : options);

  if (!quantified.fractionDigits || /^0+$/.test(quantified.fractionDigits)) {
    const wrapped = wrapLegalPhrase(majorText, Boolean(options.legal));
    return normalized.isNegative ? `${options.negativePrefix ?? "سالب"} ${wrapped}` : wrapped;
  }

  const unsignedFraction = quantified.fractionDigits.replace(/^0+(?=\d)/, "") || "0";

  if (decimalStrategy !== "separator" && subunit) {
    const fractionText = tafqit(unsignedFraction, { ...options, subject: subunit });
    const combined = wrapLegalPhrase(`${majorText} و${fractionText}`, Boolean(options.legal));
    return normalized.isNegative ? `${options.negativePrefix ?? "سالب"} ${combined}` : combined;
  }

  const decimalSeparatorWord = options.decimalSeparatorWord ?? "و";
  const fractionText = tafqit(unsignedFraction);
  const combinedBase = subject
    ? `${tafqit(quantified.integerDigits)} ${decimalSeparatorWord} ${fractionText} ${getDecimalUnitTail(subject, quantified.integerDigits)}`
    : `${majorText} ${decimalSeparatorWord} ${fractionText}`;
  const combined = wrapLegalPhrase(combinedBase, Boolean(options.legal));
  return normalized.isNegative ? `${options.negativePrefix ?? "سالب"} ${combined}` : combined;
};
