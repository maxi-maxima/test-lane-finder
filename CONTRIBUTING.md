# Contributing

Thanks for improving Test Lane Finder.

## Local Setup

```bash
npm install
npm run check
```

## Development Rules

- Keep lane planning deterministic.
- Do not run tests from the planner.
- Add tests when changing stack detection or lane rules.
- Prefer existing project scripts over invented commands.

## Pull Requests

Please include:

- the stack or lane rule being changed
- a sample file list and changed-file list
- verification output from `npm run check`
