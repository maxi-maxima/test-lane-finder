# Changelog

## Unreleased

- Run CI with the Node 24-based `actions/setup-node@v7` runtime.
- Avoid treating ordinary paths that merely contain `ci` as CI configuration.
- Remove the unused vulnerable Zod runtime dependency.

## 0.1.0

- Initial public release.
- Detect Node, Python, Ruby, Go, Rust, docs, and CI signals.
- Plan deterministic verification lanes from changed files.
- Write JSON and Markdown reports.
- Include `scan`, `from-files`, and `demo` commands.
