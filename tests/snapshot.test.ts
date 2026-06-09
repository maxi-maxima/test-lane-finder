import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { writeDemo } from "../src/snapshot.js";

describe("writeDemo", () => {
  it("writes JSON and Markdown lane plans", async () => {
    const out = await mkdtemp(path.join(os.tmpdir(), "test-lane-finder-"));

    const plan = await writeDemo(out);

    expect(plan.lanes.map((lane) => lane.command)).toContain("npm test -- --run");
    expect(plan.lanes.map((lane) => lane.command)).toContain("py -3 -m pytest");
    await expect(readFile(path.join(out, "test-lane-finder.json"), "utf8")).resolves.toContain("changedFiles");
    await expect(readFile(path.join(out, "test-lane-finder.md"), "utf8")).resolves.toContain("Recommended Lanes");
  });
});
