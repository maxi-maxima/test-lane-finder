import { describe, expect, it } from "vitest";
import { planLanes } from "../src/plan.js";

describe("planLanes", () => {
  it("selects focused Node lanes for changed TypeScript source files", () => {
    const plan = planLanes(
      {
        files: ["package.json", "src/app.ts", "tests/app.test.ts"],
        packageScripts: {
          test: "vitest run",
          lint: "eslint .",
          build: "tsc -p tsconfig.json"
        }
      },
      ["src/app.ts"]
    );

    expect(plan.lanes.map((lane) => lane.command)).toEqual([
      "npm test -- --run",
      "npm run lint",
      "npm run build"
    ]);
    expect(plan.lanes[0]).toMatchObject({
      level: "focused",
      reason: "TypeScript or JavaScript source changed"
    });
  });

  it("selects Python pytest and ruff lanes for changed Python files", () => {
    const plan = planLanes(
      {
        files: ["pyproject.toml", "app/service.py", "tests/test_service.py"],
        pyprojectTools: ["pytest", "ruff"]
      },
      ["app/service.py"]
    );

    expect(plan.lanes.map((lane) => lane.command)).toEqual(["py -3 -m pytest", "py -3 -m ruff check ."]);
  });
});
