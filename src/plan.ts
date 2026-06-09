import type { LanePlan, RepositorySnapshot, TestLane } from "./types.js";
import { detectStacks } from "./detect.js";

export function planLanes(snapshot: RepositorySnapshot, changedFiles: string[]): LanePlan {
  const normalizedChanged = changedFiles.map((file) => file.replaceAll("\\", "/"));
  const stacks = detectStacks(snapshot);
  const lanes: TestLane[] = [];
  const notes = [];
  const changed = new Set(normalizedChanged);
  const packageScripts = snapshot.packageScripts || {};

  const changedNode = normalizedChanged.some((file) => /\.(tsx?|jsx?|mjs|cjs)$/.test(file) || file === "package.json");
  const changedPython = normalizedChanged.some((file) => file.endsWith(".py") || ["pyproject.toml", "requirements.txt"].includes(file));
  const changedRuby = normalizedChanged.some((file) => file.endsWith(".rb") || file === "Gemfile");
  const changedGo = normalizedChanged.some((file) => file.endsWith(".go") || file === "go.mod");
  const changedRust = normalizedChanged.some((file) => file.endsWith(".rs") || file === "Cargo.toml");
  const changedDocsOnly = normalizedChanged.length > 0 && normalizedChanged.every((file) => file.endsWith(".md") || file.startsWith("docs/"));
  const changedCi = normalizedChanged.some((file) => file.startsWith(".github/workflows/") || file.includes("ci"));

  if (changedNode && stacks.some((stack) => stack.stack === "node")) {
    addLane("node-test", "focused", scriptCommand(packageScripts, "test", "npm test -- --run"), "TypeScript or JavaScript source changed", ["node"]);
    if (packageScripts.lint) {
      addLane("node-lint", "standard", "npm run lint", "Node lint script exists", ["node"]);
    }
    if (packageScripts.build) {
      addLane("node-build", "standard", "npm run build", "Node build script exists", ["node"]);
    }
  }

  if (changedPython && stacks.some((stack) => stack.stack === "python")) {
    addLane("python-test", "focused", "py -3 -m pytest", "Python source changed", ["python"]);
    if (snapshot.pyprojectTools?.includes("ruff") || snapshot.files.some((file) => file.endsWith(".py"))) {
      addLane("python-ruff", "standard", "py -3 -m ruff check .", "Python lint tool detected or Python files present", ["python"]);
    }
  }

  if (changedRuby && stacks.some((stack) => stack.stack === "ruby")) {
    addLane("ruby-test", "focused", "bundle exec ruby -Itest", "Ruby source changed", ["ruby"]);
  }

  if (changedGo && stacks.some((stack) => stack.stack === "go")) {
    addLane("go-test", "focused", "go test ./...", "Go source changed", ["go"]);
  }

  if (changedRust && stacks.some((stack) => stack.stack === "rust")) {
    addLane("rust-test", "focused", "cargo test", "Rust source changed", ["rust"]);
    addLane("rust-check", "standard", "cargo check", "Cargo project detected", ["rust"]);
  }

  if (changedCi) {
    addLane("ci-review", "broad", "review workflow syntax and required secrets", "CI or workflow files changed", ["ci"]);
  }

  if (changedDocsOnly) {
    addLane("docs-review", "focused", "review rendered documentation diff", "Only documentation changed", ["docs"]);
  }

  if (lanes.length === 0) {
    notes.push("No stack-specific lane matched. Run the repository's documented default verification.");
  }

  if (changed.size > 5) {
    notes.push("More than five files changed; run broad lanes before merging.");
  }

  if (normalizedChanged.some((file) => file.includes("generated") || file.includes("dist/"))) {
    notes.push("Generated output changed; verify the generator, not only the generated files.");
  }

  return {
    changedFiles: normalizedChanged,
    stacks,
    lanes,
    notes
  };

  function addLane(id: string, level: "focused" | "standard" | "broad", command: string, reason: string, stackNames: LanePlan["lanes"][number]["stacks"]): void {
    if (lanes.some((lane) => lane.command === command)) {
      return;
    }
    lanes.push({
      id,
      level,
      command,
      reason,
      stacks: stackNames
    });
  }
}

function scriptCommand(scripts: Record<string, string>, name: string, fallback: string): string {
  return scripts[name] ? `npm run ${name}${name === "test" ? " -- --run" : ""}`.replace("npm run test -- --run", "npm test -- --run") : fallback;
}
