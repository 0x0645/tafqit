import type { Result, SubjectForms } from "./types";

import { subjectsByLabel } from "./data";

/** Resolves a built-in subject by Arabic label while building the typed registry. */
const requireSubject = (label: string): SubjectForms => {
  const subject = subjectsByLabel[label];
  if (!subject) {
    throw new Error(`tafqit: missing built-in subject "${label}" while building registry.`);
  }
  return subject;
};

/** Typed registry of built-in subjects with English camelCase keys. */
export const subjects = Object.freeze({
  mauritanianOuguiya: requireSubject("أوقية موريتانية"),
  sudanesePound: requireSubject("جنيه سوداني"),
  egyptianPound: requireSubject("جنيه مصري"),
  emiratiDirham: requireSubject("درهم إماراتي"),
  moroccanDirham: requireSubject("درهم مغربي"),
  jordanianDinar: requireSubject("دينار أردني"),
  bahrainiDinar: requireSubject("دينار بحريني"),
  tunisianDinar: requireSubject("دينار تونسي"),
  algerianDinar: requireSubject("دينار جزائري"),
  iraqiDinar: requireSubject("دينار عراقي"),
  kuwaitiDinar: requireSubject("دينار كويتي"),
  libyanDinar: requireSubject("دينار ليبي"),
  saudiRiyal: requireSubject("ريال سعودي"),
  omaniRiyal: requireSubject("ريال عماني"),
  qatariRiyal: requireSubject("ريال قطري"),
  yemeniRiyal: requireSubject("ريال يمني"),
  syrianPound: requireSubject("ليرة سورية"),
  oldSyrianPound: requireSubject("ليرة قديمة سورية"),
  newSyrianPound: requireSubject("ليرة جديدة سورية"),
  lebanesePound: requireSubject("ليرة لبنانية"),
  palestinianShekel: requireSubject("(فلسطين) شيكل"),
  djiboutianFranc: requireSubject("فرنك جيبوتي"),
  comorianFranc: requireSubject("فرنك قمري"),
  somaliShilling: requireSubject("شلن صومالي"),

  usd: requireSubject("دولار أمريكي"),
  euro: requireSubject("يورو"),
  gbp: requireSubject("جنيه إسترليني"),
  australianDollar: requireSubject("دولار أسترالي"),
  canadianDollar: requireSubject("دولار كندي"),
  singaporeDollar: requireSubject("دولار سنغافوري"),
  newZealandDollar: requireSubject("دولار نيوزيلندي"),
  hongKongDollar: requireSubject("دولار هونج كونج"),
  japaneseYen: requireSubject("ين ياباني"),
  chineseYuan: requireSubject("يوان صيني"),
  swissFranc: requireSubject("فرنك سويسري"),
  indianRupee: requireSubject("روبية هندية"),
  russianRuble: requireSubject("روبل روسي"),
  brazilianReal: requireSubject("ريال برازيلي"),
  southAfricanRand: requireSubject("راند جنوب أفريقي"),
  mexicanPeso: requireSubject("بيزو مكسيكي"),
  indonesianRupiah: requireSubject("روبية إندونيسية"),
  pakistaniRupee: requireSubject("روبية باكستانية"),
  malaysianRinggit: requireSubject("رينغيت ماليزي"),
  turkishLira: requireSubject("ليرة تركية"),
  nigerianNaira: requireSubject("نيرة نيجيرية"),
  ethiopianBirr: requireSubject("بير أثيوبي"),

  bitcoin: requireSubject("بيتكوين"),
  ethereum: requireSubject("إيثيريوم"),
  usdt: requireSubject("دولار رقمي (USDT)"),

  pound: requireSubject("جنيه"),
  dirham: requireSubject("درهم"),
  dollar: requireSubject("دولار"),
  dinar: requireSubject("دينار"),
  riyal: requireSubject("ريال"),
  lira: requireSubject("ليرة"),
  ringgit: requireSubject("رينغيت"),

  gram: requireSubject("غرام"),
  milligram: requireSubject("ملي غرام"),
  kilogram: requireSubject("كيلو غرام"),
  ton: requireSubject("طن"),
  ounce: requireSubject("أونصة"),
  liter: requireSubject("لتر"),
  milliliter: requireSubject("ملي لتر"),
  gallon: requireSubject("جالون"),
  barrel: requireSubject("برميل"),
  degree: requireSubject("درجة"),

  meter: requireSubject("متر"),
  squareMeter: requireSubject("متر مربع"),
  inch: requireSubject("إنش"),
  mile: requireSubject("ميل"),
  kilometer: requireSubject("كيلومتر"),
  squareKilometer: requireSubject("كيلومتر مربع"),
  hectare: requireSubject("هكتار"),
  dunam: requireSubject("دونم"),
  feddan: requireSubject("فدان"),
  qirat: requireSubject("قيراط"),
  areaShare: requireSubject("سهم (مساحة)"),

  second: requireSubject("ثانية"),
  minute: requireSubject("دقيقة"),
  hour: requireSubject("ساعة"),
  day: requireSubject("يوم"),
  week: requireSubject("أسبوع"),
  month: requireSubject("شهر"),
  year: requireSubject("سنة"),
  annum: requireSubject("عام"),
  century: requireSubject("قرن"),

  device: requireSubject("جهاز"),
  piece: requireSubject("قطعة"),
  grain: requireSubject("حبة"),
  unit: requireSubject("وحدة"),
  share: requireSubject("سهم"),
  box: requireSubject("صندوق"),
  carton: requireSubject("كرتونة"),
  parcel: requireSubject("طرد"),
  container: requireSubject("حاويه"),
  bundle: requireSubject("رزمة"),
  pallet: requireSubject("طبلية (Pallet)"),
  dozen: requireSubject("دستة (Dozen)"),
  point: requireSubject("نقطة"),

  person: requireSubject("شخص"),
  individual: requireSubject("فرد"),
  student: requireSubject("طالب"),
  employee: requireSubject("موظف"),
  byte: requireSubject("بايت"),
  kilobyte: requireSubject("كيلوبايت"),
  megabyte: requireSubject("ميغابايت"),
  gigabyte: requireSubject("غيغابايت"),
  terabyte: requireSubject("تيرابايت"),
  user: requireSubject("مستخدم"),
  kilometerPerHour: requireSubject("كيلومتر في الساعة"),
  meterPerSecond: requireSubject("متر في الثانية"),

  halala: requireSubject("هللة"),
  fils: requireSubject("فلس"),
  qirsh: requireSubject("قرش"),
  baisa: requireSubject("بيسة"),
  cent: requireSubject("سنت"),
  satoshi: requireSubject("ساتوشي"),
  gwei: requireSubject("غوي"),
  dirhamMinor: requireSubject("درهم"),
  agora: requireSubject("أغورة"),
  jiao: requireSubject("جياو"),
  paisa: requireSubject("بيسة"),
  kopek: requireSubject("كوبيك"),
  centavo: requireSubject("سنتافو"),
  sen: requireSubject("سن"),
  kobo: requireSubject("كوبو"),
  centimeter: requireSubject("سنتيمتر"),
  squareCentimeter: requireSubject("سنتيمتر مربع")
});

export type SubjectKey = keyof typeof subjects;

/** Returns a subject by English registry key or Arabic display label. */
export const getSubject = (labelOrKey: string): SubjectForms | undefined => {
  const normalizedKey = labelOrKey as SubjectKey;
  return subjects[normalizedKey] ?? subjectsByLabel[labelOrKey];
};

/** Returns the typed registry key for a known subject label or key. */
export const getSubjectKey = (labelOrKey: string): SubjectKey | undefined => {
  const normalizedKey = labelOrKey as SubjectKey;
  if (subjects[normalizedKey]) {
    return normalizedKey;
  }

  const subject = subjectsByLabel[labelOrKey];
  if (!subject) {
    return undefined;
  }

  return (Object.keys(subjects) as SubjectKey[]).find((key) => subjects[key] === subject);
};

/** Returns a subject or throws a descriptive error if the key or label is unknown. */
export const getSubjectOrThrow = (labelOrKey: string): SubjectForms => {
  const subject = getSubject(labelOrKey);
  if (!subject) {
    throw new Error(
      `tafqit: unknown subject "${labelOrKey}". Call listSubjects() to see valid labels, or use the subjects object directly.`
    );
  }
  return subject;
};

/** Returns a result object instead of throwing when a subject is unknown. */
export const safeGetSubject = (labelOrKey: string): Result<SubjectForms> => {
  const subject = getSubject(labelOrKey);
  return subject
    ? { ok: true, value: subject }
    : { ok: false, error: `tafqit: unknown subject "${labelOrKey}"` };
};
