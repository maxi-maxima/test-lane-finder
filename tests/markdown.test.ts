import { describe, expect, it } from "vitest";
import { toMarkdown } from "../src/markdown.js";
import type { LanePlan } from "../src/types.js";

describe("toMarkdown", () => {
  it("renders changed files, stacks, and lanes", () => {
    const markdown = toMarkdown({
      changedFiles: ["src/app.ts"],
      stacks: [{ stack: "node", confidence: 100, reasons: ["package.json present"] }],
      lanes: [
        {
          id: "node-test",
          level: "focused",
          command: "npm test -- --run",
          reason: "TypeScript or JavaScript source changed",
          stacks: ["node"]
        }
      ],
      notes: ["Run broad lanes before merging if generated code touched shared modules."]
    } satisfies LanePlan);

    expect(markdown).toContain("# Test Lane Finder Report");
    expect(markdown).toContain("src/app.ts");
    expect(markdown).toContain("npm test -- --run");
    expect(markdown).toContain("package.json present");
  });
});
