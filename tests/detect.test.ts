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

  it("does not mistake ordinary filenames containing ci for CI signals", () => {
    const stacks = detectStacks({
      files: ["docs/decision.md"]
    });

    expect(stacks.map((stack) => stack.stack)).toEqual(["docs"]);
  });

  it.each([".github/workflows/ci.yml", "./.github/workflows/ci.yml", ".circleci/config.yml", "ci/check.yml", ".gitlab-ci.yml", "azure-pipelines.yml", "bitbucket-pipelines.yml", "Jenkinsfile"])(
    "detects %s as a CI signal",
    (file) => {
      expect(detectStacks({ files: [file] }).map((stack) => stack.stack)).toEqual(["ci"]);
    }
  );
});
