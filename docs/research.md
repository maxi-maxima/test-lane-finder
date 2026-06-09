# Research Notes

This project was selected after avoiding overlap with the user's existing public-launch repos:

- `mcp-fire-drill`: MCP and agent security drills
- `context-cal`: agent context budget auditing
- `screenlint`: rendered UI checking
- `mcp-flightcheck`: MCP server contract checks
- `webmcp-formkit`: WebMCP form metadata migration
- `agent-pr-brief`: deterministic PR review brief generation

The opportunity is verification routing. AI coding agents are increasingly good at editing, but they still often choose poor verification commands. A hard-coded lane can fail when the project stack changes. Running full CI every time is slow enough that people and agents skip it.

There is active research around test impact analysis and test-driven agent development, but many practical teams need a smaller local tool first: detect the stack, look at changed files, and recommend the next verification commands.

This tool is intentionally planner-only. It helps humans or agents decide what to run, but does not execute arbitrary project commands.

Useful current references:

- https://github.com/anthropics/claude-code/issues/7099
- https://www.codium.ai/blog/test-driven-agentic-development-tdad/
- https://martinfowler.com/articles/2021-test-shapes.html
