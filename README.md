<div align="center">

# Test Lane Finder

**Find the smallest useful verification lane for a code change.**

[简体中文](README.zh-CN.md)

</div>

AI coding agents can change code quickly. The slow part is often deciding what to verify. Some agents run too little. Some run the whole suite every time. Some hard-code a framework lane and fail on the next repo.

`test-lane-finder` inspects repository structure and changed files, then suggests deterministic test lanes.

No API keys. No LLM call. It does not run tests for you.

## 30 Second Demo

```bash
npx github:maxi-maxima/test-lane-finder demo
```

The demo writes:

```text
reports/demo/test-lane-finder.json
reports/demo/test-lane-finder.md
```

## Scan A Git Repo

```bash
npx github:maxi-maxima/test-lane-finder scan origin/main --out reports/test-lanes
```

`scan` reads:

- files in the repository
- `package.json` scripts
- common Python tool hints in `pyproject.toml`
- changed files from `git diff --name-only <base>...HEAD`

## Plan From Explicit Files

```bash
npx github:maxi-maxima/test-lane-finder from-files src/app.ts tests/app.test.ts
```

## Example Output

```text
Test Lane Finder LANES
Changed files: 2
Stacks: node, python
Lanes: 5
- npm test -- --run
- npm run lint
- npm run build
- py -3 -m pytest
- py -3 -m ruff check .
```

## Supported Signals

| Stack | Signals | Example lanes |
| --- | --- | --- |
| Node | `package.json`, lockfiles, JS/TS files, scripts | `npm test -- --run`, `npm run lint`, `npm run build` |
| Python | `pyproject.toml`, `requirements.txt`, `.py` files | `py -3 -m pytest`, `py -3 -m ruff check .` |
| Ruby | `Gemfile`, `.rb` files | `bundle exec ruby -Itest` |
| Go | `go.mod`, `.go` files | `go test ./...` |
| Rust | `Cargo.toml`, `Cargo.lock`, `.rs` files | `cargo test`, `cargo check` |
| Docs | Markdown/docs changes | rendered documentation review |
| CI | workflows/deploy paths | workflow syntax and secrets review |

## Why Not Just Run Everything?

Sometimes you should. Before a merge, broad CI matters. But during local agent loops, a good focused lane is faster and more likely to be run repeatedly. This tool gives that lane a name and a reason.

## Development

```bash
npm install
npm run check
node dist/cli.js demo --out reports/demo
npm pack --dry-run --ignore-scripts
```

## License

MIT
