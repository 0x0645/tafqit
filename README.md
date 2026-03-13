# Tafqit

`@0x0645/tafqit` converts numbers into Arabic words with support for grammatical gender, i'rab-sensitive forms, counted nouns, legal phrasing, currencies, and decimal quantities that can decompose into smaller units such as `ريال/هللة`, `متر مربع/سنتيمتر مربع`, or `ساعة/دقيقة`.

## Features

- Integer `tafqit()` for plain Arabic number spelling.
- `tafqitWithSubject()` for counted nouns like `طالب`, `صندوق`, or `مستخدم`.
- `tafqitDecimal()` and `tafqitQuantity()` for currencies and measurable units.
- Typed `subjects` registry with English camelCase keys and Arabic labels.
- Built-in support for Arabic currencies, world currencies, digital currencies, measures, areas, time, trade units, and people/technology nouns.
- Quantity conversion metadata for units such as `ساعة -> دقيقة`, `متر مربع -> سنتيمتر مربع`, and `كيلومتر في الساعة -> متر في الساعة`.
- Customizable decimal separator text, legal wrapping, scale naming, and formatting switches.

## Install

```bash
npm i @0x0645/tafqit
```

## Quick Start

```ts
import { tafqit } from "@0x0645/tafqit";

tafqit(2000);
// ألفان

tafqit(12, { gender: "feminine" });
// اثنتا عشرة

tafqit(122, { grammaticalCase: "accusative" });
// مائة واثنين وعشرين

tafqit(2000, { textToFollow: true });
// ألفا
```

## Counted Nouns

```ts
import { subjects, tafqitWithSubject } from "@0x0645/tafqit";

tafqitWithSubject(1, subjects.student);
// طالب واحد

tafqitWithSubject(3, subjects.student);
// ثلاثة طلاب

tafqitWithSubject(21, subjects.student);
// واحد وعشرون طالبًا
```

## Decimals, Currencies, and Quantities

```ts
import { subjects, tafqitDecimal, tafqitQuantity } from "@0x0645/tafqit";

tafqitDecimal("12.50", {
  subject: subjects.saudiRiyal,
  subunit: subjects.halala,
  fractionDigits: 2
});
// اثنا عشر ريالًا سعوديًا وخمسون هللةً

tafqitQuantity("140.55", {
  subject: subjects.squareMeter,
  legal: true
});
// فقط مائة وأربعون مترًا مربعًا وخمسة آلاف وخمسمائة سنتيمتر مربع لا غير

tafqitQuantity("1.5", { subject: subjects.hour });
// ساعة واحدة وثلاثون دقيقةً
```

## Typed Registry and Reusable Formatters

```ts
import { createFormatter, subjects, tafqitQuantity } from "@0x0645/tafqit";

const sar = createFormatter({
  subject: subjects.saudiRiyal,
  subunit: subjects.halala,
  fractionDigits: 2
});

sar.decimal("12.50");
sar.integer(1250);

tafqitQuantity("10.5", { subject: subjects.kilometerPerHour });
// عشرة كيلومترات في الساعة وخمسمائة متر في الساعة
```

## Built-in Subject Access

```ts
import { getSubject, getSubjectOrThrow, listSubjects, subjects } from "@0x0645/tafqit";

subjects.saudiRiyal;
getSubject("ريال سعودي");
getSubject("saudiRiyal");
getSubjectOrThrow("student");
listSubjects();
```

## Package API

- `tafqit(number, options?)`
- `tafqitWithSubject(number, subject, options?)`
- `tafqitDecimal(value, options?)`
- `tafqitQuantity(value, options?)`
- `createFormatter(defaults)`
- `subjects`, `getSubject()`, `getSubjectOrThrow()`, `safeGetSubject()`, `listSubjects()`

## Development

```bash
pnpm install
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm --filter tafqit-example dev
```

## Example App

The Next.js example playground lives in `example/` and links back to the project repository:

- Repository: `https://github.com/0x0645/tafqit`
- Local run: `pnpm --filter tafqit-example dev`

## License

MIT - see `LICENSE`.

## Repository

- GitHub: `https://github.com/0x0645/tafqit`
- Issues: `https://github.com/0x0645/tafqit/issues`

