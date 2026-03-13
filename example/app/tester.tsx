"use client";

import { useMemo, useState } from "react";

import {
  getSubject,
  getSubjectKey,
  subjectGroups,
  tafqit,
  tafqitQuantity,
  tafqitWithSubject,
  type DecimalStrategy,
  type SubjectForms,
  type TafqitOptions,
} from "@0x0645/tafqit";

type Mode = "integer" | "subject" | "decimal";
type GroupKey = keyof typeof subjectGroups;

type ExamplePreset = {
  label: string;
  description: string;
  mode: Mode;
  value: string;
  group?: GroupKey;
  subject?: string;
  subunit?: string;
  digits?: number;
  options?: Partial<TafqitOptions>;
};

const groupLabels: Record<GroupKey, string> = {
  arabicCurrencies: "عملات عربية",
  worldCurrencies: "عملات عالمية",
  digitalCurrencies: "عملات رقمية",
  genericCurrencies: "أسماء عملات عامة",
  weightsAndMeasures: "الوزن والقياس",
  distancesAndArea: "المسافات والمساحة",
  time: "الزمن",
  tradeAndServices: "التجارة والخدمات",
  peopleAndTechnology: "البشر والتكنولوجيا",
};

const groupOrder = Object.keys(groupLabels) as GroupKey[];

const examples: ExamplePreset[] = [
  {
    label: "عدد كبير",
    description: "صياغة رقم كبير مقسم إلى مقاطع",
    mode: "integer",
    value: "2452452000",
  },
  {
    label: "أرقام عربية هندية",
    description: "القراءة من الصيغة العربية الهندية",
    mode: "integer",
    value: "٢٤٥٢٤٥٢٠٠٠",
  },
  {
    label: "مؤنث",
    description: "عدد مجرد بصيغة المؤنث",
    mode: "integer",
    value: "12",
    options: { gender: "feminine" },
  },
  {
    label: "نصب",
    description: "تغيير الحالة الإعرابية",
    mode: "integer",
    value: "122",
    options: { grammaticalCase: "accusative" },
  },
  {
    label: "يتبعها نص",
    description: "إظهار ألفا بدل ألفان",
    mode: "integer",
    value: "2000",
    options: { textToFollow: true },
  },
  {
    label: "صياغة قانونية",
    description: "صياغة أقل التباسا",
    mode: "integer",
    value: "101000",
    options: { legal: true },
  },
  {
    label: "ريال سعودي",
    description: "عدد مع عملة عربية",
    mode: "subject",
    value: "1250",
    group: "arabicCurrencies",
    subject: "ريال سعودي",
  },
  {
    label: "طلاب",
    description: "عدد مع اسم معدود شائع",
    mode: "subject",
    value: "21",
    group: "peopleAndTechnology",
    subject: "طالب",
  },
  {
    label: "سرعة",
    description: "وحدة مركبة",
    mode: "subject",
    value: "88",
    group: "peopleAndTechnology",
    subject: "كيلومتر في الساعة",
  },
  {
    label: "مساحة عشرية",
    description: "تحويل المساحة إلى سنتيمتر مربع",
    mode: "decimal",
    value: "140.55",
    group: "distancesAndArea",
    subject: "متر مربع",
  },
  {
    label: "ساعة ونصف",
    description: "تحويل الوقت إلى دقائق",
    mode: "decimal",
    value: "1.5",
    group: "time",
    subject: "ساعة",
  },
  {
    label: "سرعة عشرية",
    description: "تحويل السرعة إلى متر في الساعة",
    mode: "decimal",
    value: "10.5",
    group: "peopleAndTechnology",
    subject: "كيلومتر في الساعة",
  },
  {
    label: "ريال وهللات",
    description: "قيمة عشرية مع جزء أصغر",
    mode: "decimal",
    value: "12.50",
    group: "arabicCurrencies",
    subject: "ريال سعودي",
    subunit: "هللة",
    digits: 2,
  },
  {
    label: "بيتكوين",
    description: "عملة رقمية مع منازل كثيرة",
    mode: "decimal",
    value: "0.12345678",
    group: "digitalCurrencies",
    subject: "بيتكوين",
    subunit: "ساتوشي",
    digits: 8,
  },
  {
    label: "قيمة سالبة",
    description: "قيمة عشرية سالبة",
    mode: "decimal",
    value: "-15.75",
    group: "worldCurrencies",
    subject: "دولار أمريكي",
    subunit: "سنت",
    digits: 2,
  },
];

const toSubjectOptions = (group: GroupKey) => {
  return Object.entries(subjectGroups[group]).map(([key, value]) => ({
    key,
    label: value.label ?? key,
  }));
};

const defaultSubunitForSubject = (subject?: SubjectForms) => {
  if (!subject) {
    return "";
  }

  const maybeCurrency = subject as SubjectForms & { subunit?: SubjectForms };
  return maybeCurrency.subunit?.label ?? maybeCurrency.subunit?.singular ?? "";
};

const highlightCode = (value: string) => {
  const parts = value.split(
    /(import|const|from|tafqitQuantity|tafqitWithSubject|tafqit|legal|textToFollow|comma|useMiah|splitHundreds|useBillions|negativePrefix|grammaticalCase|gender|fractionDigits|decimalStrategy|decimalSeparatorWord|getSubjectOrThrow|subjects)/g,
  );

  return parts.filter(Boolean).map((part, index) => {
    let className = "jsonPlain";
    if (/^(import|const|from)$/.test(part)) className = "jsonKey";
    else if (
      /^(tafqitQuantity|tafqitWithSubject|tafqit|getSubjectOrThrow|subjects)$/.test(
        part,
      )
    )
      className = "jsonString";
    else if (
      /^(legal|textToFollow|comma|useMiah|splitHundreds|useBillions|negativePrefix|grammaticalCase|gender|fractionDigits|decimalStrategy|decimalSeparatorWord)$/.test(
        part,
      )
    )
      className = "jsonLiteral";
    else if (/^-?\d+(?:\.\d+)?$/.test(part)) className = "jsonNumber";

    return (
      <span key={`${part}-${index}`} className={className}>
        {part}
      </span>
    );
  });
};

const isDecimalLike = (value: string) => /[.٫]/.test(value);

const compactOptions = (options: TafqitOptions) => {
  const entries = Object.entries(options).filter(
    ([, currentValue]) => currentValue !== undefined,
  );

  return Object.fromEntries(
    entries.filter(([key, currentValue]) => {
      if (key === "gender") return currentValue !== "masculine";
      if (key === "grammaticalCase") return currentValue !== "nominative";
      if (key === "negativePrefix") return currentValue !== "سالب";
      return currentValue !== false;
    }),
  );
};

const formatObjectLiteral = (value: Record<string, unknown>) => {
  const entries = Object.entries(value);
  if (!entries.length) {
    return "{}";
  }

  return `{
${entries
  .map(
    ([key, currentValue]) =>
      `  ${key}: ${typeof currentValue === "string" ? JSON.stringify(currentValue) : String(currentValue)}`,
  )
  .join(",\n")}
}`;
};

const buildImportLine = (specifiers: string[]) =>
  `import { ${specifiers.join(", ")} } from "@0x0645/tafqit";`;

const formatSnippetOptions = (entries: Array<[string, string]>) => `{
${entries.map(([key, currentValue]) => `  ${key}: ${currentValue}`).join(",\n")}
}`;

export function Tester() {
  const [mode, setMode] = useState<Mode>("integer");
  const [value, setValue] = useState("2452452000");
  const [group, setGroup] = useState<GroupKey>("arabicCurrencies");
  const [subjectName, setSubjectName] = useState("ريال سعودي");
  const [subunitName, setSubunitName] = useState("هللة");
  const [fractionDigits, setFractionDigits] = useState(2);
  const [gender, setGender] = useState<"masculine" | "feminine">("masculine");
  const [grammaticalCase, setGrammaticalCase] = useState<
    "nominative" | "accusative" | "genitive"
  >("nominative");
  const [textToFollow, setTextToFollow] = useState(false);
  const [legal, setLegal] = useState(false);
  const [comma, setComma] = useState(false);
  const [useMiah, setUseMiah] = useState(false);
  const [splitHundreds, setSplitHundreds] = useState(false);
  const [useBillions, setUseBillions] = useState(false);
  const [negativePrefix, setNegativePrefix] = useState("سالب");
  const [decimalStrategy, setDecimalStrategy] =
    useState<DecimalStrategy>("auto");
  const [decimalSeparatorWord, setDecimalSeparatorWord] = useState("و");

  const subjectOptions = useMemo(() => toSubjectOptions(group), [group]);
  const selectedSubject = useMemo(() => getSubject(subjectName), [subjectName]);
  const selectedSubunit = useMemo(
    () => (subunitName ? getSubject(subunitName) : undefined),
    [subunitName],
  );

  const baseOptions: TafqitOptions = useMemo(
    () => ({
      gender,
      grammaticalCase,
      textToFollow,
      legal,
      comma,
      useMiah,
      splitHundreds,
      useBillions,
      negativePrefix,
    }),
    [
      comma,
      gender,
      grammaticalCase,
      legal,
      negativePrefix,
      splitHundreds,
      textToFollow,
      useBillions,
      useMiah,
    ],
  );

  const output = useMemo(() => {
    try {
      if (mode === "integer") {
        return tafqit(value, baseOptions);
      }

      if (mode === "subject") {
        if (!selectedSubject) {
          return "اختر اسمًا صالحًا أولًا.";
        }

        if (isDecimalLike(value)) {
          return tafqitQuantity(value, {
            ...baseOptions,
            subject: selectedSubject,
            subunit: selectedSubunit,
            fractionDigits,
            decimalStrategy,
            decimalSeparatorWord,
          });
        }

        return tafqitWithSubject(value, selectedSubject, baseOptions);
      }

      return tafqitQuantity(value, {
        ...baseOptions,
        subject: selectedSubject,
        subunit: selectedSubunit,
        fractionDigits,
        decimalStrategy,
        decimalSeparatorWord,
      });
    } catch (error) {
      return error instanceof Error ? error.message : "حدث خطأ غير متوقع.";
    }
  }, [
    baseOptions,
    decimalSeparatorWord,
    decimalStrategy,
    fractionDigits,
    mode,
    selectedSubject,
    selectedSubunit,
    value,
  ]);

  const usageSnippet = useMemo(() => {
    const options = compactOptions(baseOptions);
    const decimalInput =
      mode === "decimal" || (mode === "subject" && isDecimalLike(value));

    if (mode === "integer") {
      if (Object.keys(options).length) {
        return `import { tafqit } from "@0x0645/tafqit";\n\ntafqit(${JSON.stringify(value)}, ${formatObjectLiteral(options)})`;
      } else {
        return `import { tafqit } from "@0x0645/tafqit";\n\ntafqit(${JSON.stringify(value)})`;
      }
    }

    const subjectKey = getSubjectKey(subjectName);
    const subunitKey = subunitName ? getSubjectKey(subunitName) : undefined;
    const useRegistry = Boolean(subjectKey && (!subunitName || subunitKey));
    const imports = useRegistry ? ["subjects"] : ["getSubjectOrThrow"];

    const setupLines = useRegistry
      ? []
      : [
          `const subject = getSubjectOrThrow(${JSON.stringify(subjectName)});`,
          ...(subunitName
            ? [
                `const subunit = getSubjectOrThrow(${JSON.stringify(subunitName)});`,
              ]
            : []),
        ];

    const subjectRef =
      useRegistry && subjectKey ? `subjects.${subjectKey}` : "subject";
    const subunitRef =
      useRegistry && subunitKey ? `subjects.${subunitKey}` : "subunit";

    if (decimalInput) {
      const decimalOptions: Array<[string, string]> = [["subject", subjectRef]];

      if (subunitName) {
        decimalOptions.push(["subunit", subunitRef]);
      }

      if (fractionDigits !== 2)
        decimalOptions.push(["fractionDigits", String(fractionDigits)]);
      if (decimalStrategy !== "auto")
        decimalOptions.push([
          "decimalStrategy",
          JSON.stringify(decimalStrategy),
        ]);
      if (decimalSeparatorWord !== "و")
        decimalOptions.push([
          "decimalSeparatorWord",
          JSON.stringify(decimalSeparatorWord),
        ]);

      for (const [key, currentValue] of Object.entries(options)) {
        decimalOptions.push([
          key,
          typeof currentValue === "string"
            ? JSON.stringify(currentValue)
            : String(currentValue),
        ]);
      }

      return `${buildImportLine([...imports, "tafqitQuantity"])}\n${setupLines.length ? `\n${setupLines.join("\n")}` : ""}\n\ntafqitQuantity(${JSON.stringify(value)}, ${formatSnippetOptions(decimalOptions)});`;
    }

    if (Object.keys(options).length) {
      return `${buildImportLine([...imports, "tafqitWithSubject"])}\n${setupLines.length ? `\n${setupLines.join("\n")}` : ""}\n\ntafqitWithSubject(${JSON.stringify(value)}, ${subjectRef}, ${formatObjectLiteral(options)});`;
    }

    return `${buildImportLine([...imports, "tafqitWithSubject"])}\n${setupLines.length ? `\n${setupLines.join("\n")}` : ""}\n\ntafqitWithSubject(${JSON.stringify(value)}, ${subjectRef});`;
  }, [
    baseOptions,
    decimalSeparatorWord,
    decimalStrategy,
    fractionDigits,
    mode,
    subjectName,
    subunitName,
    value,
  ]);

  const metadataRows = useMemo(() => {
    if (!selectedSubject || mode === "integer") {
      return [];
    }

    return [
      ["المفرد", selectedSubject.singular],
      ["المثنى", selectedSubject.dual],
      ["الجمع", selectedSubject.plural],
      ["التنوين", selectedSubject.singularTanween],
      ["النوع", selectedSubject.gender === "masculine" ? "مذكر" : "مؤنث"],
    ];
  }, [mode, selectedSubject]);

  const applyOptions = (options?: Partial<TafqitOptions>) => {
    setGender(options?.gender ?? "masculine");
    setGrammaticalCase(options?.grammaticalCase ?? "nominative");
    setTextToFollow(options?.textToFollow ?? false);
    setLegal(options?.legal ?? false);
    setComma(options?.comma ?? false);
    setUseMiah(options?.useMiah ?? false);
    setSplitHundreds(options?.splitHundreds ?? false);
    setUseBillions(options?.useBillions ?? false);
    setNegativePrefix(options?.negativePrefix ?? "سالب");
  };

  const ensureModeState = (nextMode: Mode) => {
    if (nextMode === "subject" || nextMode === "decimal") {
      const currentSubject = getSubject(subjectName);
      if (!currentSubject) {
        const first = toSubjectOptions(group)[0];
        if (first) {
          setSubjectName(first.label);
          const nextSubject = getSubject(first.label);
          if (nextSubject) {
            setGender(nextSubject.gender);
            if (nextMode === "decimal") {
              setSubunitName(defaultSubunitForSubject(nextSubject));
            }
          }
        }
      }
    }

    if (nextMode === "decimal" && !subunitName) {
      setSubunitName(
        defaultSubunitForSubject(getSubject(subjectName) ?? undefined),
      );
    }
  };

  const handleModeChange = (nextMode: Mode) => {
    ensureModeState(nextMode);
    setMode(nextMode);
  };

  const handleGroupChange = (nextGroup: GroupKey) => {
    setGroup(nextGroup);
    const first = toSubjectOptions(nextGroup)[0];
    if (!first) {
      return;
    }

    setSubjectName(first.label);
    const subject = getSubject(first.label);
    if (subject) {
      setGender(subject.gender);
      setSubunitName(defaultSubunitForSubject(subject));
    }
  };

  const handleSubjectChange = (nextLabel: string) => {
    setSubjectName(nextLabel);
    const subject = getSubject(nextLabel);
    if (subject) {
      setGender(subject.gender);
      setSubunitName(defaultSubunitForSubject(subject));
    }
  };

  const applyExample = (example: ExamplePreset) => {
    if (example.group) {
      setGroup(example.group);
    }
    if (example.subject) {
      setSubjectName(example.subject);
      const subject = getSubject(example.subject);
      if (subject) {
        setGender(example.options?.gender ?? subject.gender);
      }
      setSubunitName(
        example.subunit ?? defaultSubunitForSubject(subject ?? undefined),
      );
    }

    ensureModeState(example.mode);
    setMode(example.mode);
    setValue(example.value);
    applyOptions(example.options);

    if (example.digits !== undefined) {
      setFractionDigits(example.digits);
    }
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebarBlock">
          <div className="productName">Tafqit</div>
          <div className="productMeta">
            واجهة تجربة سريعة مع أمثلة جاهزة وإعدادات واضحة.
          </div>
          <a
            className="repoLink"
            href="https://github.com/0x0645/tafqit"
            target="_blank"
            rel="noreferrer"
          >
            github.com/0x0645/tafqit
          </a>
        </div>

        <div className="sidebarBlock">
          <div className="sectionTitle">الوضع</div>
          <nav className="sidebarNav" aria-label="أوضاع الاختبار">
            <button
              className={
                mode === "integer" ? "navItem navItemActive" : "navItem"
              }
              onClick={() => handleModeChange("integer")}
              type="button"
            >
              عدد مجرد
            </button>
            <button
              className={
                mode === "subject" ? "navItem navItemActive" : "navItem"
              }
              onClick={() => handleModeChange("subject")}
              type="button"
            >
              عدد مع اسم معدود
            </button>
            <button
              className={
                mode === "decimal" ? "navItem navItemActive" : "navItem"
              }
              onClick={() => handleModeChange("decimal")}
              type="button"
            >
              قيمة عشرية
            </button>
          </nav>
        </div>

        <div className="sidebarBlock">
          <div className="sectionTitle">أمثلة</div>
          <div className="exampleList">
            {examples.map((example) => (
              <button
                key={example.label}
                className="exampleButton exampleCard"
                onClick={() => applyExample(example)}
                type="button"
              >
                <strong>{example.label}</strong>
                <span>{example.description}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        <section className="toolbar toolbarGrid">
          <div>
            <h1>لوحة اختبار تفقيط</h1>
            <p>
              اكتب الرقم ثم غيّر القواعد، أو اختر مثالًا جاهزًا وحرّره مباشرة.
            </p>
          </div>
        </section>

        <div className="contentGrid simplifiedGrid">
          <section className="panel formPanel">
            <div className="panelTitle">القيمة الأساسية</div>

            <div className="sectionStack">
              <div className="fieldGrid balancedGrid twoColumns formRowCompact">
                <label className="field fieldSpanFull">
                  <span>القيمة</span>
                  <input
                    dir="ltr"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                </label>
              </div>

              <div className="fieldGrid balancedGrid twoColumns formRowMain">
                <label className="field">
                  <span>الحالة الإعرابية</span>
                  <select
                    value={grammaticalCase}
                    onChange={(event) =>
                      setGrammaticalCase(
                        event.target.value as typeof grammaticalCase,
                      )
                    }
                  >
                    <option value="nominative">رفع</option>
                    <option value="accusative">نصب</option>
                    <option value="genitive">جر</option>
                  </select>
                </label>

                <label className="field">
                  <span>الجنس</span>
                  <select
                    value={gender}
                    onChange={(event) =>
                      setGender(event.target.value as typeof gender)
                    }
                  >
                    <option value="masculine">مذكر</option>
                    <option value="feminine">مؤنث</option>
                  </select>
                </label>

                <label className="field">
                  <span>بادئة السالب</span>
                  <input
                    value={negativePrefix}
                    onChange={(event) => setNegativePrefix(event.target.value)}
                  />
                </label>
              </div>
            </div>

            {mode !== "integer" ? (
              <div className="sectionStack sectionBlock">
                <div className="panelTitle panelTitleInline">الاسم المعدود</div>

                <div className="fieldGrid balancedGrid twoColumns formRowMain">
                  <label className="field">
                    <span>المجموعة</span>
                    <select
                      value={group}
                      onChange={(event) =>
                        handleGroupChange(event.target.value as GroupKey)
                      }
                    >
                      {groupOrder.map((key) => (
                        <option key={key} value={key}>
                          {groupLabels[key]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field">
                    <span>الاسم</span>
                    <select
                      value={subjectName}
                      onChange={(event) =>
                        handleSubjectChange(event.target.value)
                      }
                    >
                      {subjectOptions.map((option) => (
                        <option key={option.key} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {mode === "decimal" ||
                (mode === "subject" && isDecimalLike(value)) ? (
                  <>
                    <div className="fieldGrid balancedGrid twoColumns formRowSplit">
                      <label className="field">
                        <span>الجزء الأصغر</span>
                        <input
                          value={subunitName}
                          onChange={(event) =>
                            setSubunitName(event.target.value)
                          }
                        />
                      </label>

                      <label className="field">
                        <span>أسلوب العشرية</span>
                        <select
                          value={decimalStrategy}
                          onChange={(event) =>
                            setDecimalStrategy(
                              event.target.value as DecimalStrategy,
                            )
                          }
                        >
                          <option value="auto">تلقائي</option>
                          <option value="convert">تحويل إلى وحدة أصغر</option>
                          <option value="separator">فاصل نصي</option>
                        </select>
                      </label>
                    </div>

                    <div className="fieldGrid balancedGrid twoColumns formRowSplit">
                      <label className="field">
                        <span>عدد المنازل</span>
                        <input
                          dir="ltr"
                          inputMode="numeric"
                          value={String(fractionDigits)}
                          onChange={(event) =>
                            setFractionDigits(Number(event.target.value) || 0)
                          }
                        />
                      </label>

                      <label className="field">
                        <span>كلمة الفاصل</span>
                        <input
                          value={decimalSeparatorWord}
                          onChange={(event) =>
                            setDecimalSeparatorWord(event.target.value)
                          }
                        />
                      </label>
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              <div className="sectionStack sectionBlock">
                <div className="inlineNote">
                  يمكنك كتابة رقم عادي، رقم عربي هندي، أو قيمة سالبة مثل -15 و
                  ٢٤٥٢٤٥٢٠٠٠.
                </div>
              </div>
            )}

            <div className="sectionStack sectionBlock">
              <div className="panelTitle panelTitleInline">الإعدادات</div>
              <div className="optionGrid compactOptions">
                <label className="checkboxField">
                  <input
                    checked={textToFollow}
                    onChange={() => setTextToFollow((current) => !current)}
                    type="checkbox"
                  />
                  يتبعها نص
                </label>
                <label className="checkboxField">
                  <input
                    checked={legal}
                    onChange={() => setLegal((current) => !current)}
                    type="checkbox"
                  />
                  صياغة قانونية
                </label>
                <label className="checkboxField">
                  <input
                    checked={comma}
                    onChange={() => setComma((current) => !current)}
                    type="checkbox"
                  />
                  فواصل بين المقاطع
                </label>
                <label className="checkboxField">
                  <input
                    checked={useMiah}
                    onChange={() => setUseMiah((current) => !current)}
                    type="checkbox"
                  />
                  استخدام مئة
                </label>
                <label className="checkboxField">
                  <input
                    checked={splitHundreds}
                    onChange={() => setSplitHundreds((current) => !current)}
                    type="checkbox"
                  />
                  فصل المئات
                </label>
                <label className="checkboxField">
                  <input
                    checked={useBillions}
                    onChange={() => setUseBillions((current) => !current)}
                    type="checkbox"
                  />
                  استخدام بليون
                </label>
              </div>
            </div>
          </section>

          <section className="panel resultPanel">
            <div className="panelTitle">الناتج</div>
            <div className="resultBox">{output}</div>

            <div className="subsection">
              <div className="subsectionTitle">طريقة الاستخدام</div>
              <pre className="codeBlock highlightedCode">
                {highlightCode(usageSnippet)}
              </pre>
            </div>
          </section>

          <section className="panel dataPanel">
            <div className="panelTitle">بيانات الاسم المختار</div>
            {metadataRows.length ? (
              <table className="dataTable">
                <tbody>
                  {metadataRows.map(([label, currentValue]) => (
                    <tr key={label}>
                      <th>{label}</th>
                      <td>{currentValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="emptyState">
                هذا الوضع لا يستخدم اسمًا معدودًا.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
