# Test Lane Finder Design

## Problem

AI coding agents and humans often waste time running either too little verification or the whole CI suite after every small change. Hard-coded test commands are brittle across frameworks.

## Scope

`test-lane-finder` is a local CLI that detects common project stacks and recommends a small verification lane from changed files. It is deterministic and zero-config by default.

It does not run tests. It tells you what to run.

## Commands

- `scan`: inspect the current repository and print/write a lane plan.
- `from-files`: plan lanes from an explicit changed-file list.
- `demo`: generate a sample report.

## Verification

The release gate is `npm run check`, demo generation, and `npm pack --dry-run --ignore-scripts`.
