import type { CurrencyDefinition, SubjectForms } from "./types";

/** Creates a reusable counted-noun definition. */
const subject = (
  singular: string,
  dual: string,
  plural: string,
  singularTanween: string,
  gender: SubjectForms["gender"],
  label?: string,
  aliases: string[] = [],
  extras: Partial<Pick<SubjectForms, "subunit" | "minorUnitDigits" | "minorUnitFactor">> = {}
): SubjectForms => {
  return { singular, dual, plural, singularTanween, gender, label, aliases, ...extras };
};

/** Creates a currency definition with optional subunit metadata. */
const currency = (
  singular: string,
  dual: string,
  plural: string,
  singularTanween: string,
  gender: SubjectForms["gender"],
  label?: string,
  aliases: string[] = [],
  code?: string,
  subunit?: SubjectForms,
  minorUnitDigits = 2,
  minorUnitFactor?: number | string | bigint
): CurrencyDefinition => {
  return {
    singular,
    dual,
    plural,
    singularTanween,
    gender,
    label,
    aliases,
    code,
    subunit,
    minorUnitDigits,
    minorUnitFactor: minorUnitFactor ?? (subunit ? `1${"0".repeat(minorUnitDigits)}` : undefined)
  };
};

const halala = subject("هللة", "هللتان", "هللات", "هللةً", "feminine", "هللة");
const fils = subject("فلس", "فلسان", "فلوس", "فلسًا", "masculine", "فلس");
const dirhamMinor = subject("درهم", "درهمان", "دراهم", "درهمًا", "masculine", "درهم");
const qirsh = subject("قرش", "قرشان", "قروش", "قرشًا", "masculine", "قرش");
const baisa = subject("بيسة", "بيستان", "بيسات", "بيسةً", "feminine", "بيسة");
const cent = subject("سنت", "سنتان", "سنتات", "سنتًا", "masculine", "سنت");
const satoshi = subject("ساتوشي", "ساتوشيان", "ساتوشيات", "ساتوشي", "masculine", "ساتوشي");
const gwei = subject("غوي", "غويان", "غويات", "غوي", "masculine", "غوي");
const centimeter = subject("سنتيمتر", "سنتيمتران", "سنتيمترات", "سنتيمترًا", "masculine", "سنتيمتر", ["سم"]);
const squareCentimeter = subject("سنتيمتر مربع", "سنتيمتران مربعان", "سنتيمترات مربعة", "سنتيمترًا مربعًا", "masculine", "سنتيمتر مربع", ["سم مربع", "سنتيمتر²"]);
const squareMeter = subject("متر مربع", "متران مربعان", "أمتار مربعة", "مترًا مربعًا", "masculine", "متر مربع", [], { subunit: squareCentimeter, minorUnitFactor: 10000 });
const meter = subject("متر", "متران", "أمتار", "مترًا", "masculine", "متر", [], { subunit: centimeter, minorUnitFactor: 100 });
const milligram = subject("ملي غرام", "ملي غرامان", "ملي غرامات", "ملي غرامًا", "masculine", "ملي غرام", ["مليغرام"]);
const gram = subject("غرام", "غرامان", "غرامات", "غرامًا", "masculine", "غرام", [], { subunit: milligram, minorUnitFactor: 1000 });
const kilogram = subject("كيلو غرام", "كيلو غرامان", "كيلو غرامات", "كيلو غرامًا", "masculine", "كيلو غرام", ["كيلوغرام"], { subunit: gram, minorUnitFactor: 1000 });
const milliliter = subject("ملي لتر", "ملي لتران", "ملي لترات", "ملي لترًا", "masculine", "ملي لتر", ["مليلتر"]);
const liter = subject("لتر", "لتران", "لترات", "لترًا", "masculine", "لتر", [], { subunit: milliliter, minorUnitFactor: 1000 });
const second = subject("ثانية", "ثانيتان", "ثوان", "ثانيةً", "feminine", "ثانية");
const minute = subject("دقيقة", "دقيقتان", "دقائق", "دقيقةً", "feminine", "دقيقة", [], { subunit: second, minorUnitFactor: 60 });
const hour = subject("ساعة", "ساعتان", "ساعات", "ساعةً", "feminine", "ساعة", [], { subunit: minute, minorUnitFactor: 60 });
const day = subject("يوم", "يومان", "أيام", "يومًا", "masculine", "يوم", [], { subunit: hour, minorUnitFactor: 24 });
const week = subject("أسبوع", "أسبوعان", "أسابيع", "أسبوعًا", "masculine", "أسبوع", [], { subunit: day, minorUnitFactor: 7 });
const byteUnit = subject("بايت", "بايتان", "بايتات", "بايتًا", "masculine", "بايت");
const kilobyteUnit = subject("كيلوبايت", "كيلوبايتان", "كيلوبايتات", "كيلوبايتًا", "masculine", "كيلوبايت", [], { subunit: byteUnit, minorUnitFactor: 1000 });
const megabyteUnit = subject("ميغابايت", "ميغابايتان", "ميغابايتات", "ميغابايتًا", "masculine", "ميغابايت", [], { subunit: kilobyteUnit, minorUnitFactor: 1000 });
const gigabyteUnit = subject("غيغابايت", "غيغابايتان", "غيغابايتات", "غيغابايتًا", "masculine", "غيغابايت", [], { subunit: megabyteUnit, minorUnitFactor: 1000 });
const terabyteUnit = subject("تيرابايت", "تيرابايتان", "تيرابايتات", "تيرابايتًا", "masculine", "تيرابايت", [], { subunit: gigabyteUnit, minorUnitFactor: 1000 });
const meterPerHour = subject("متر في الساعة", "متران في الساعة", "أمتار في الساعة", "مترًا في الساعة", "masculine", "متر في الساعة");
const kilometerPerHour = subject("كيلومتر في الساعة", "كيلومتران في الساعة", "كيلومترات في الساعة", "كيلومترًا في الساعة", "masculine", "كيلومتر في الساعة", [], { subunit: meterPerHour, minorUnitFactor: 1000 });
const centimeterPerSecond = subject("سنتيمتر في الثانية", "سنتيمتران في الثانية", "سنتيمترات في الثانية", "سنتيمترًا في الثانية", "masculine", "سنتيمتر في الثانية");
const meterPerSecond = subject("متر في الثانية", "متران في الثانية", "أمتار في الثانية", "مترًا في الثانية", "masculine", "متر في الثانية", [], { subunit: centimeterPerSecond, minorUnitFactor: 100 });
const agora = (): SubjectForms => subject("أغورة", "أغورتان", "أغورات", "أغورةً", "feminine", "أغورة");
const jiao = (): SubjectForms => subject("جياو", "جياوان", "جياوات", "جياو", "masculine", "جياو");
const paisa = (): SubjectForms => subject("بيسة", "بيستان", "بيسات", "بيسةً", "feminine", "بيسة");
const kopek = (): SubjectForms => subject("كوبيك", "كوبيكان", "كوبيكات", "كوبيكًا", "masculine", "كوبيك");
const centavo = (): SubjectForms => subject("سنتافو", "سنتافوان", "سنتافوات", "سنتافو", "masculine", "سنتافو");
const sen = (): SubjectForms => subject("سن", "سنان", "سنات", "سنًا", "masculine", "سن");
const kobo = (): SubjectForms => subject("كوبو", "كوبوان", "كوبوات", "كوبو", "masculine", "كوبو");

/** Built-in subjects grouped by domain for browsing and UI pickers. */
export const subjectGroups = {
  arabicCurrencies: {
    "أوقية موريتانية": currency("أوقية موريتانية", "أوقيتان موريتانيتان", "أوقيات موريتانية", "أوقيةً موريتانيةً", "feminine", "أوقية موريتانية", [], "MRU"),
    "جنيه سوداني": currency("جنيه سوداني", "جنيهان سودانيان", "جنيهات سودانية", "جنيهًا سودانيًا", "masculine", "جنيه سوداني", [], "SDG", qirsh),
    "جنيه مصري": currency("جنيه مصري", "جنيهان مصريان", "جنيهات مصرية", "جنيهًا مصريًا", "masculine", "جنيه مصري", [], "EGP", qirsh),
    "درهم إماراتي": currency("درهم إماراتي", "درهمان إماراتيان", "دراهم إماراتية", "درهمًا إماراتيًا", "masculine", "درهم إماراتي", [], "AED", fils),
    "درهم مغربي": currency("درهم مغربي", "درهمان مغربيان", "دراهم مغربية", "درهمًا مغربيًا", "masculine", "درهم مغربي", [], "MAD", cent),
    "دينار أردني": currency("دينار أردني", "ديناران أردنيان", "دنانير أردنية", "دينارًا أردنيًا", "masculine", "دينار أردني", [], "JOD", fils, 3),
    "دينار بحريني": currency("دينار بحريني", "ديناران بحرينيان", "دنانير بحرينية", "دينارًا بحرينيًا", "masculine", "دينار بحريني", [], "BHD", fils, 3),
    "دينار تونسي": currency("دينار تونسي", "ديناران تونسيان", "دنانير تونسية", "دينارًا تونسيًا", "masculine", "دينار تونسي", [], "TND", undefined, 3),
    "دينار جزائري": currency("دينار جزائري", "ديناران جزائريان", "دنانير جزائرية", "دينارًا جزائريًا", "masculine", "دينار جزائري", [], "DZD", cent),
    "دينار عراقي": currency("دينار عراقي", "ديناران عراقيان", "دنانير عراقية", "دينارًا عراقيًا", "masculine", "دينار عراقي", [], "IQD", fils, 3),
    "دينار كويتي": currency("دينار كويتي", "ديناران كويتيان", "دنانير كويتية", "دينارًا كويتيًا", "masculine", "دينار كويتي", [], "KWD", fils, 3),
    "دينار ليبي": currency("دينار ليبي", "ديناران ليبيان", "دنانير ليبية", "دينارًا ليبيًا", "masculine", "دينار ليبي", [], "LYD", dirhamMinor, 3),
    "ريال سعودي": currency("ريال سعودي", "ريالان سعوديان", "ريالات سعودية", "ريالًا سعوديًا", "masculine", "ريال سعودي", [], "SAR", halala),
    "ريال عماني": currency("ريال عماني", "ريالان عمانيان", "ريالات عمانية", "ريالًا عمانيًا", "masculine", "ريال عماني", [], "OMR", baisa, 3),
    "ريال قطري": currency("ريال قطري", "ريالان قطريان", "ريالات قطرية", "ريالًا قطريًا", "masculine", "ريال قطري", [], "QAR", dirhamMinor),
    "ريال يمني": currency("ريال يمني", "ريالان يمنيان", "ريالات يمنية", "ريالًا يمنيًا", "masculine", "ريال يمني", [], "YER", fils),
    "ليرة سورية": currency("ليرة سورية", "ليرتان سوريتان", "ليرات سورية", "ليرةً سوريةً", "feminine", "ليرة سورية", [], "SYP", qirsh),
    "ليرة قديمة سورية": currency("ليرة سورية قديمة", "ليرتان سوريتان قديمتان", "ليرات سورية قديمة", "ليرةً سوريةً قديمةً", "feminine", "ليرة قديمة سورية", ["ليرة سورية قديمة"]),
    "ليرة جديدة سورية": currency("ليرة سورية جديدة", "ليرتان سوريتان جديدتان", "ليرات سورية جديدة", "ليرةً سوريةً جديدةً", "feminine", "ليرة جديدة سورية", ["ليرة سورية جديدة"]),
    "ليرة لبنانية": currency("ليرة لبنانية", "ليرتان لبنانيتان", "ليرات لبنانية", "ليرةً لبنانيةً", "feminine", "ليرة لبنانية", [], "LBP", qirsh),
    "(فلسطين) شيكل": currency("شيكل فلسطيني", "شيكلان فلسطينيان", "شيكلات فلسطينية", "شيكلًا فلسطينيًا", "masculine", "(فلسطين) شيكل", ["شيكل فلسطيني", "فلسطين شيكل"], "ILS", agora()),
    "فرنك جيبوتي": currency("فرنك جيبوتي", "فرنكان جيبوتيان", "فرنكات جيبوتية", "فرنكًا جيبوتيًا", "masculine", "فرنك جيبوتي", [], "DJF"),
    "فرنك قمري": currency("فرنك قمري", "فرنكان قمريان", "فرنكات قمرية", "فرنكًا قمريًا", "masculine", "فرنك قمري", [], "KMF"),
    "شلن صومالي": currency("شلن صومالي", "شلنان صوماليان", "شلنات صومالية", "شلنًا صوماليًا", "masculine", "شلن صومالي", [], "SOS", cent)
  },
  worldCurrencies: {
    "دولار أمريكي": currency("دولار أمريكي", "دولاران أمريكيان", "دولارات أمريكية", "دولارًا أمريكيًا", "masculine", "دولار أمريكي", [], "USD", cent),
    "يورو": currency("يورو", "يوروان", "يوروات", "يورو", "masculine", "يورو", [], "EUR", cent),
    "جنيه إسترليني": currency("جنيه إسترليني", "جنيهان إسترلينيان", "جنيهات إسترلينية", "جنيهًا إسترلينيًا", "masculine", "جنيه إسترليني", [], "GBP", cent),
    "دولار أسترالي": currency("دولار أسترالي", "دولاران أستراليان", "دولارات أسترالية", "دولارًا أستراليًا", "masculine", "دولار أسترالي", [], "AUD", cent),
    "دولار كندي": currency("دولار كندي", "دولاران كنديان", "دولارات كندية", "دولارًا كنديًا", "masculine", "دولار كندي", [], "CAD", cent),
    "دولار سنغافوري": currency("دولار سنغافوري", "دولاران سنغافوريان", "دولارات سنغافورية", "دولارًا سنغافوريًا", "masculine", "دولار سنغافوري", [], "SGD", cent),
    "دولار نيوزيلندي": currency("دولار نيوزيلندي", "دولاران نيوزيلنديان", "دولارات نيوزيلندية", "دولارًا نيوزيلنديًا", "masculine", "دولار نيوزيلندي", [], "NZD", cent),
    "دولار هونج كونج": currency("دولار هونج كونج", "دولاران هونج كونج", "دولارات هونج كونج", "دولارًا هونج كونج", "masculine", "دولار هونج كونج", [], "HKD", cent),
    "ين ياباني": currency("ين ياباني", "ينان يابانيان", "ينات يابانية", "ينًا يابانيًا", "masculine", "ين ياباني", [], "JPY"),
    "يوان صيني": currency("يوان صيني", "يوانان صينيان", "يوانات صينية", "يوانًا صينيًا", "masculine", "يوان صيني", [], "CNY", jiao()),
    "فرنك سويسري": currency("فرنك سويسري", "فرنكان سويسريان", "فرنكات سويسرية", "فرنكًا سويسريًا", "masculine", "فرنك سويسري", [], "CHF", cent),
    "روبية هندية": currency("روبية هندية", "روبيتان هنديتان", "روبيات هندية", "روبيةً هنديةً", "feminine", "روبية هندية", [], "INR", paisa()),
    "روبل روسي": currency("روبل روسي", "روبلان روسيان", "روبلات روسية", "روبلًا روسيًا", "masculine", "روبل روسي", [], "RUB", kopek()),
    "ريال برازيلي": currency("ريال برازيلي", "ريالان برازيليان", "ريالات برازيلية", "ريالًا برازيليًا", "masculine", "ريال برازيلي", [], "BRL", centavo()),
    "راند جنوب أفريقي": currency("راند جنوب أفريقي", "راندان جنوب أفريقيان", "راندات جنوب أفريقية", "راندًا جنوب أفريقيًا", "masculine", "راند جنوب أفريقي", [], "ZAR", cent),
    "بيزو مكسيكي": currency("بيزو مكسيكي", "بيزوان مكسيكيان", "بيزوات مكسيكية", "بيزوًا مكسيكيًا", "masculine", "بيزو مكسيكي", [], "MXN", centavo()),
    "روبية إندونيسية": currency("روبية إندونيسية", "روبيتان إندونيسيتان", "روبيات إندونيسية", "روبيةً إندونيسيةً", "feminine", "روبية إندونيسية", [], "IDR"),
    "روبية باكستانية": currency("روبية باكستانية", "روبيتان باكستانيتان", "روبيات باكستانية", "روبيةً باكستانيةً", "feminine", "روبية باكستانية", [], "PKR", paisa()),
    "رينغيت ماليزي": currency("رينغيت ماليزي", "رينغيتان ماليزيان", "رينغيتات ماليزية", "رينغيتًا ماليزيًا", "masculine", "رينغيت ماليزي", [], "MYR", sen()),
    "ليرة تركية": currency("ليرة تركية", "ليرتان تركيتان", "ليرات تركية", "ليرةً تركيةً", "feminine", "ليرة تركية", [], "TRY", qirsh),
    "نيرة نيجيرية": currency("نيرة نيجيرية", "نيرتان نيجيريتان", "نيرات نيجيرية", "نيرةً نيجيريةً", "feminine", "نيرة نيجيرية", [], "NGN", kobo()),
    "بير أثيوبي": currency("بير أثيوبي", "بيران أثيوبيان", "بيرات أثيوبية", "بيرًا أثيوبيًا", "masculine", "بير أثيوبي", [], "ETB", cent)
  },
  digitalCurrencies: {
    "بيتكوين": currency("بيتكوين", "بيتكوينان", "بيتكوينات", "بيتكوين", "masculine", "بيتكوين", [], "BTC", satoshi, 8),
    "إيثيريوم": currency("إيثيريوم", "إيثيريومان", "إيثيريومات", "إيثيريوم", "masculine", "إيثيريوم", [], "ETH", gwei, 9),
    "دولار رقمي (USDT)": currency("دولار رقمي", "دولاران رقميان", "دولارات رقمية", "دولارًا رقميًا", "masculine", "دولار رقمي (USDT)", ["USDT", "دولار رقمي"], "USDT", cent)
  },
  genericCurrencies: {
    "جنيه": subject("جنيه", "جنيهان", "جنيهات", "جنيهًا", "masculine", "جنيه"),
    "درهم": subject("درهم", "درهمان", "دراهم", "درهمًا", "masculine", "درهم"),
    "دولار": subject("دولار", "دولاران", "دولارات", "دولارًا", "masculine", "دولار"),
    "دينار": subject("دينار", "ديناران", "دنانير", "دينارًا", "masculine", "دينار"),
    "ريال": subject("ريال", "ريالان", "ريالات", "ريالًا", "masculine", "ريال"),
    "ليرة": subject("ليرة", "ليرتان", "ليرات", "ليرةً", "feminine", "ليرة"),
    "رينغيت": subject("رينغيت", "رينغيتان", "رينغيتات", "رينغيتًا", "masculine", "رينغيت")
  },
  weightsAndMeasures: {
    "غرام": gram,
    "ملي غرام": milligram,
    "كيلو غرام": kilogram,
    "طن": subject("طن", "طنان", "أطنان", "طنًا", "masculine", "طن"),
    "أونصة": subject("أونصة", "أونصتان", "أونصات", "أونصةً", "feminine", "أونصة"),
    "لتر": liter,
    "ملي لتر": milliliter,
    "جالون": subject("جالون", "جالونان", "جالونات", "جالونًا", "masculine", "جالون"),
    "برميل": subject("برميل", "برميلان", "براميل", "برميلًا", "masculine", "برميل"),
    "درجة": subject("درجة", "درجتان", "درجات", "درجةً", "feminine", "درجة")
  },
  distancesAndArea: {
    "متر": meter,
    "متر مربع": squareMeter,
    "إنش": subject("إنش", "إنشان", "إنشات", "إنشًا", "masculine", "إنش"),
    "ميل": subject("ميل", "ميلان", "أميال", "ميلًا", "masculine", "ميل"),
    "كيلومتر": subject("كيلومتر", "كيلومتران", "كيلومترات", "كيلومترًا", "masculine", "كيلومتر", [], { subunit: meter, minorUnitFactor: 1000 }),
    "كيلومتر مربع": subject("كيلومتر مربع", "كيلومتران مربعان", "كيلومترات مربعة", "كيلومترًا مربعًا", "masculine", "كيلومتر مربع", [], { subunit: squareMeter, minorUnitFactor: 1000000 }),
    "هكتار": subject("هكتار", "هكتاران", "هكتارات", "هكتارًا", "masculine", "هكتار", [], { subunit: squareMeter, minorUnitFactor: 10000 }),
    "دونم": subject("دونم", "دونمان", "دونمات", "دونمًا", "masculine", "دونم"),
    "فدان": subject("فدان", "فدانان", "أفدنة", "فدانًا", "masculine", "فدان"),
    "قيراط": subject("قيراط", "قيراطان", "قراريط", "قيراطًا", "masculine", "قيراط"),
    "سهم (مساحة)": subject("سهم", "سهمان", "أسهم", "سهمًا", "masculine", "سهم (مساحة)", ["سهم مساحة"])
  },
  time: {
    "ثانية": second,
    "دقيقة": minute,
    "ساعة": hour,
    "يوم": day,
    "أسبوع": week,
    "شهر": subject("شهر", "شهران", "أشهر", "شهرًا", "masculine", "شهر"),
    "سنة": subject("سنة", "سنتان", "سنوات", "سنةً", "feminine", "سنة", ["عام"]),
    "عام": subject("عام", "عامان", "أعوام", "عامًا", "masculine", "عام"),
    "قرن": subject("قرن", "قرنان", "قرون", "قرنًا", "masculine", "قرن")
  },
  tradeAndServices: {
    "جهاز": subject("جهاز", "جهازان", "أجهزة", "جهازًا", "masculine", "جهاز"),
    "قطعة": subject("قطعة", "قطعتان", "قطع", "قطعةً", "feminine", "قطعة"),
    "حبة": subject("حبة", "حبتان", "حبات", "حبةً", "feminine", "حبة"),
    "وحدة": subject("وحدة", "وحدتان", "وحدات", "وحدةً", "feminine", "وحدة"),
    "سهم": subject("سهم", "سهمان", "أسهم", "سهمًا", "masculine", "سهم"),
    "صندوق": subject("صندوق", "صندوقان", "صناديق", "صندوقًا", "masculine", "صندوق"),
    "كرتونة": subject("كرتونة", "كرتونتان", "كراتين", "كرتونةً", "feminine", "كرتونة"),
    "طرد": subject("طرد", "طردان", "طرود", "طردًا", "masculine", "طرد"),
    "حاويه": subject("حاوية", "حاويتان", "حاويات", "حاويةً", "feminine", "حاويه", ["حاوية"]),
    "رزمة": subject("رزمة", "رزمتان", "رزم", "رزمةً", "feminine", "رزمة"),
    "طبلية (Pallet)": subject("طبلية", "طبليتان", "طبليات", "طبليةً", "feminine", "طبلية (Pallet)", ["طبلية"]),
    "دستة (Dozen)": subject("دستة", "دستتان", "دستات", "دستةً", "feminine", "دستة (Dozen)", ["دستة"]),
    "نقطة": subject("نقطة", "نقطتان", "نقاط", "نقطةً", "feminine", "نقطة")
  },
  peopleAndTechnology: {
    "شخص": subject("شخص", "شخصان", "أشخاص", "شخصًا", "masculine", "شخص"),
    "فرد": subject("فرد", "فردان", "أفراد", "فردًا", "masculine", "فرد"),
    "طالب": subject("طالب", "طالبان", "طلاب", "طالبًا", "masculine", "طالب"),
    "موظف": subject("موظف", "موظفان", "موظفين", "موظفًا", "masculine", "موظف"),
    "بايت": byteUnit,
    "كيلوبايت": kilobyteUnit,
    "ميغابايت": megabyteUnit,
    "غيغابايت": gigabyteUnit,
    "تيرابايت": terabyteUnit,
    "مستخدم": subject("مستخدم", "مستخدمان", "مستخدمين", "مستخدمًا", "masculine", "مستخدم"),
    "كيلومتر في الساعة": kilometerPerHour,
    "متر في الثانية": meterPerSecond
  }
} as const;

const helperEntries = [halala, fils, dirhamMinor, qirsh, baisa, cent, satoshi, gwei, centimeter, squareCentimeter, meter, squareMeter, milligram, gram, kilogram, milliliter, liter, second, minute, hour, day, week, byteUnit, kilobyteUnit, megabyteUnit, gigabyteUnit, terabyteUnit, meterPerHour, kilometerPerHour, centimeterPerSecond, meterPerSecond, agora(), jiao(), paisa(), kopek(), centavo(), sen(), kobo()];

const allEntries = [...Object.values(subjectGroups).flatMap((group) => Object.values(group)), ...helperEntries];

/** Flat label-based lookup table for every built-in subject and alias. */
export const subjectsByLabel = Object.freeze(
  allEntries.reduce<Record<string, SubjectForms>>((accumulator, entry) => {
    if (entry.label) {
      accumulator[entry.label] = entry;
    }
    accumulator[entry.singular] = entry;
    for (const alias of entry.aliases ?? []) {
      accumulator[alias] = entry;
    }
    return accumulator;
  }, {})
);

/** Convenience map of built-in currency-like subjects. */
export const currencies = Object.freeze({
  ...subjectGroups.arabicCurrencies,
  ...subjectGroups.worldCurrencies,
  ...subjectGroups.digitalCurrencies,
  ...subjectGroups.genericCurrencies
});

/** Returns a built-in subject by Arabic label or alias. */
export const getSubject = (name: string): SubjectForms | undefined => subjectsByLabel[name];

/** Lists unique built-in subject labels. */
export const listSubjects = (): string[] => [...new Set(allEntries.map((entry) => entry.label ?? entry.singular))];
