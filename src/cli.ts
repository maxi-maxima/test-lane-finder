#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { planLanes } from "./plan.js";
import { changedFilesFromGit, readSnapshot, writeDemo, writePlan } from "./snapshot.js";
import type { LanePlan } from "./types.js";

const program = new Command();

program
  .name("test-lane-finder")
  .description("Find the smallest useful verification lane for a code change.")
  .version("0.1.0");

program
  .command("scan")
  .argument("[base]", "base branch or revision", "origin/main")
  .option("--out <dir>", "output directory", "reports/test-lane-finder")
  .action(async (base: string, options: { out: string }) => {
    const cwd = process.cwd();
    const snapshot = await readSnapshot(cwd);
    const changedFiles = await changedFilesFromGit(base, cwd);
    const plan = planLanes(snapshot, changedFiles);
    await writePlan(plan, options.out);
    printSummary(plan);
    console.log(`Reports: ${options.out}`);
  });

program
  .command("from-files")
  .argument("<files...>", "changed files")
  .option("--out <dir>", "output directory", "reports/test-lane-finder")
  .action(async (files: string[], options: { out: string }) => {
    const snapshot = await readSnapshot(process.cwd());
    const plan = planLanes(snapshot, files);
    await writePlan(plan, options.out);
    printSummary(plan);
    console.log(`Reports: ${options.out}`);
  });

program.command("demo").option("--out <dir>", "output directory", "reports/demo").action(async (options: { out: string }) => {
  const plan = await writeDemo(options.out);
  printSummary(plan);
  console.log(`Reports: ${options.out}`);
});

program.parse();

function printSummary(plan: LanePlan): void {
  const broad = plan.lanes.some((lane) => lane.level === "broad");
  const status = broad ? pc.red("BROAD") : plan.lanes.length > 0 ? pc.green("LANES") : pc.yellow("MANUAL");
  console.log(`Test Lane Finder ${status}`);
  console.log(`Changed files: ${plan.changedFiles.length}`);
  console.log(`Stacks: ${plan.stacks.map((stack) => stack.stack).join(", ") || "none"}`);
  console.log(`Lanes: ${plan.lanes.length}`);
  for (const lane of plan.lanes) {
    console.log(`- ${lane.command}`);
  }
}
