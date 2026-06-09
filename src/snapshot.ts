import { execFile } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import fg from "fast-glob";
import { planLanes } from "./plan.js";
import { toMarkdown } from "./markdown.js";
import type { LanePlan, RepositorySnapshot } from "./types.js";

const execFileAsync = promisify(execFile);

export async function readSnapshot(cwd: string): Promise<RepositorySnapshot> {
  const files = await fg(["**/*"], {
    cwd,
    onlyFiles: true,
    dot: true,
    ignore: ["node_modules/**", "dist/**", "coverage/**", "reports/**", ".git/**"]
  });

  return {
    files,
    packageScripts: await readPackageScripts(cwd),
    pyprojectTools: await readPyprojectTools(cwd)
  };
}

export async function changedFilesFromGit(base: string, cwd: string): Promise<string[]> {
  const { stdout } = await execFileAsync("git", ["diff", "--name-only", `${base}...HEAD`], { cwd });
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function writePlan(plan: LanePlan, outDir: string): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "test-lane-finder.json"), `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  await writeFile(path.join(outDir, "test-lane-finder.md"), toMarkdown(plan), "utf8");
}

export async function writeDemo(outDir: string): Promise<LanePlan> {
  const snapshot: RepositorySnapshot = {
    files: ["package.json", "src/app.ts", "tests/app.test.ts", "pyproject.toml", "app/service.py"],
    packageScripts: {
      test: "vitest run",
      lint: "eslint .",
      build: "tsc -p tsconfig.json"
    },
    pyprojectTools: ["pytest", "ruff"]
  };
  const plan = planLanes(snapshot, ["src/app.ts", "app/service.py"]);
  await writePlan(plan, outDir);
  return plan;
}

async function readPackageScripts(cwd: string): Promise<Record<string, string> | undefined> {
  try {
    const raw = await readFile(path.join(cwd, "package.json"), "utf8");
    const parsed = JSON.parse(raw) as { scripts?: Record<string, string> };
    return parsed.scripts;
  } catch {
    return undefined;
  }
}

async function readPyprojectTools(cwd: string): Promise<string[] | undefined> {
  try {
    const raw = await readFile(path.join(cwd, "pyproject.toml"), "utf8");
    const tools = [];
    if (raw.includes("[tool.pytest") || raw.includes("pytest")) {
      tools.push("pytest");
    }
    if (raw.includes("[tool.ruff") || raw.includes("ruff")) {
      tools.push("ruff");
    }
    if (raw.includes("[tool.mypy") || raw.includes("mypy")) {
      tools.push("mypy");
    }
    return tools;
  } catch {
    return undefined;
  }
}
