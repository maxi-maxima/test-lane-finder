import { describe, expect, it } from "vitest";
import { detectStacks } from "../src/detect.js";

describe("detectStacks", () => {
  it("detects node and python stacks from repository files and scripts", () => {
    const stacks = detectStacks({
      files: ["package.json", "src/app.ts", "pyproject.toml", "tests/test_app.py"],
      packageScripts: {
        test: "vitest run",
        lint: "eslint .",
        build: "tsc -p tsconfig.json"
      },
      pyprojectTools: ["pytest", "ruff"]
    });

    expect(stacks).toContainEqual(
      expect.objectContaining({
        stack: "node",
        confidence: 100
      })
    );
    expect(stacks).toContainEqual(
      expect.objectContaining({
        stack: "python",
        confidence: 100
      })
    );
  });
});
