export { currencies, listSubjects, subjectGroups, subjectsByLabel } from "./data";
export { tafqit, tafqitDecimal, tafqitQuantity, tafqitWithSubject } from "./core";
export { createFormatter } from "./formatter";
export { getSubject, getSubjectKey, getSubjectOrThrow, safeGetSubject, subjects } from "./registry";
export type { SubjectKey } from "./registry";
export type {
  CurrencyDefinition,
  DecimalStrategy,
  GrammaticalCase,
  Result,
  RoundingStrategy,
  SubjectForms,
  SubjectGender,
  TafqitDecimalOptions,
  TafqitOptions
} from "./types";
