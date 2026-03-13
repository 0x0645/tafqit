# Changelog

All notable changes to `tafqit` are documented in this file.

## 1.0.0 - 2026-03-13

### Added

- First stable release of `tafqit` for Arabic number-to-words formatting in TypeScript.
- Grammar-aware integer formatting with masculine/feminine and nominative/accusative/genitive handling.
- Counted-noun support through `tafqitWithSubject()` and the typed `subjects` registry.
- Decimal and quantity formatting with `tafqitDecimal()` and `tafqitQuantity()`.
- Built-in subject datasets for currencies, measurement units, time, trade, and technology nouns.
- Conversion-aware decimal decomposition for supported units such as currency subunits, area, time, and speed.
- Reusable formatter builder via `createFormatter()`.
- Next.js example app for testing options and generated usage snippets.

### Tooling

- pnpm workspace setup for the package and example app.
- ESLint configuration for code-quality checks.
- GitHub Actions CI for linting, typechecking, testing, and builds.
- GitHub Actions publish workflow for npm releases.
