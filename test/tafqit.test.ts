import { describe, expect, it } from "vitest";

import { createFormatter, getSubject, getSubjectOrThrow, listSubjects, safeGetSubject, subjects, tafqit, tafqitDecimal, tafqitQuantity, tafqitWithSubject } from "../src/index";

describe("tafqit", () => {
  it("converts standalone integers", () => {
    expect(tafqit(2000)).toBe("ألفان");
    expect(tafqit(15000120)).toBe("خمسة عشر مليونًا ومائة وعشرون");
    expect(tafqit(2020)).toBe("ألفان وعشرون");
  });

  it("supports Arabic-Indic digits", () => {
    expect(tafqit("٢٤٥٢٤٥٢٠٠٠")).toBe("ملياران وأربعمائة واثنان وخمسون مليونًا وأربعمائة واثنان وخمسون ألفًا");
  });

  it("supports feminine forms", () => {
    expect(tafqit(12, { gender: "feminine" })).toBe("اثنتا عشرة");
    expect(tafqit(23, { gender: "feminine" })).toBe("ثلاث وعشرون");
  });

  it("supports accusative and genitive forms", () => {
    expect(tafqit(2, { grammaticalCase: "accusative" })).toBe("اثنين");
    expect(tafqit(122, { grammaticalCase: "accusative" })).toBe("مائة واثنين وعشرين");
  });

  it("supports text to follow", () => {
    expect(tafqit(200, { textToFollow: true })).toBe("مائتا");
    expect(tafqit(2000, { textToFollow: true })).toBe("ألفا");
    expect(tafqit(2000000, { textToFollow: true })).toBe("مليونا");
  });

  it("supports comma and legal wording", () => {
    expect(tafqit(100100100, { comma: true })).toBe("مائة مليون، ومائة ألف، ومائة");
    expect(tafqit(101000, { legal: true })).toBe("مائة ألف وألف");
  });

  it("supports built-in subjects", () => {
    const students = getSubject("طالب");
    if (!students) {
      throw new Error("طالب subject missing");
    }

    expect(tafqitWithSubject(1, students)).toBe("طالب واحد");
    expect(tafqitWithSubject(2, students)).toBe("طالبان اثنان");
    expect(tafqitWithSubject(3, students)).toBe("ثلاثة طلاب");
    expect(tafqitWithSubject(21, students)).toBe("واحد وعشرون طالبًا");
  });

  it("supports listed subject lookups", () => {
    const labels = [
      "أوقية موريتانية",
      "جنيه سوداني",
      "ريال سعودي",
      "دولار أمريكي",
      "بيتكوين",
      "غرام",
      "متر مربع",
      "ساعة",
      "صندوق",
      "مستخدم",
      "كيلومتر في الساعة"
    ];

    for (const label of labels) {
      expect(getSubject(label), label).toBeDefined();
    }

    expect(listSubjects().length).toBeGreaterThan(70);
  });

  it("supports typed registry and english subject keys", () => {
    expect(getSubject("saudiRiyal")).toBe(subjects.saudiRiyal);
    expect(getSubjectOrThrow("student")).toBe(subjects.student);
    expect(safeGetSubject("unknown")).toEqual({ ok: false, error: 'tafqit: unknown subject "unknown"' });
  });

  it("supports decimal tafqit with subject and subunit", () => {
    const riyal = getSubject("ريال سعودي");
    const halala = getSubject("هللة");
    if (!riyal || !halala) {
      throw new Error("currency or subunit missing");
    }

    expect(tafqitDecimal("12.50", { subject: riyal, subunit: halala, fractionDigits: 2 })).toBe(
      "اثنا عشر ريالًا سعوديًا وخمسون هللةً"
    );
  });

  it("converts measurable decimals into smaller units when metadata exists", () => {
    const squareMeter = getSubject("متر مربع");
    const kilogram = getSubject("كيلو غرام");
    const liter = getSubject("لتر");
    const hour = getSubject("ساعة");
    const kilometerPerHour = getSubject("كيلومتر في الساعة");
    const meterPerSecond = getSubject("متر في الثانية");
    if (!squareMeter || !kilogram || !liter || !hour || !kilometerPerHour || !meterPerSecond) {
      throw new Error("measurable subject missing");
    }

    expect(tafqitQuantity("140.5", { subject: squareMeter, legal: true })).toBe(
      "فقط مائة وأربعون مترًا مربعًا وخمسة آلاف سنتيمتر مربع لا غير"
    );
    expect(tafqitQuantity("140.55", { subject: squareMeter, legal: true })).toBe(
      "فقط مائة وأربعون مترًا مربعًا وخمسة آلاف وخمسمائة سنتيمتر مربع لا غير"
    );
    expect(tafqitQuantity("3.75", { subject: kilogram })).toBe("ثلاثة كيلو غرامات وسبعمائة وخمسون غرامًا");
    expect(tafqitQuantity("12.5", { subject: liter })).toBe("اثنا عشر لترًا وخمسمائة ملي لتر");
    expect(tafqitQuantity("1.5", { subject: hour })).toBe("ساعة واحدة وثلاثون دقيقةً");
    expect(tafqitQuantity("10.5", { subject: kilometerPerHour })).toBe("عشرة كيلومترات في الساعة وخمسمائة متر في الساعة");
    expect(tafqitQuantity("3.25", { subject: meterPerSecond })).toBe("ثلاثة أمتار في الثانية وخمسة وعشرون سنتيمترًا في الثانية");
  });

  it("supports separator style and custom decimal separator text", () => {
    const squareMeter = getSubject("متر مربع");
    if (!squareMeter) {
      throw new Error("square meter subject missing");
    }

    expect(tafqitDecimal("140.5", { subject: squareMeter, decimalStrategy: "separator" })).toBe(
      "مائة وأربعون و خمسة مترًا مربعًا"
    );
    expect(tafqitDecimal("140.5", { subject: squareMeter, decimalStrategy: "separator", decimalSeparatorWord: "فاصلة" })).toBe(
      "مائة وأربعون فاصلة خمسة مترًا مربعًا"
    );
  });

  it("supports negative values", () => {
    expect(tafqit(-5)).toBe("سالب خمسة");
  });

  it("supports formatter builder", () => {
    const sar = createFormatter({
      subject: subjects.saudiRiyal,
      subunit: subjects.halala,
      fractionDigits: 2
    });

    expect(sar.integer(1250)).toBe("ألف ومائتا وخمسون ريالًا سعوديًا");
    expect(sar.decimal("12.50")).toBe("اثنا عشر ريالًا سعوديًا وخمسون هللةً");
  });

  it("accepts editing-friendly numeric strings", () => {
    const squareMeter = getSubject("متر مربع");
    if (!squareMeter) {
      throw new Error("square meter subject missing");
    }

    expect(tafqit("150.")).toBe("مائة وخمسون");
    expect(tafqitQuantity("150.", { subject: squareMeter })).toBe("مائة وخمسون مترًا مربعًا");
    expect(tafqitQuantity(".5", { subject: squareMeter, legal: true })).toBe("فقط خمسة آلاف سنتيمتر مربع لا غير");
  });
});
