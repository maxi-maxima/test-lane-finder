import type { RepositorySnapshot, StackSignal } from "./types.js";

export function detectStacks(snapshot: RepositorySnapshot): StackSignal[] {
  const files = new Set(snapshot.files.map(normalizePath));
  const signals: StackSignal[] = [];

  const add = (stack: StackSignal["stack"], confidence: number, reasons: string[]): void => {
    signals.push({ stack, confidence, reasons });
  };

  if (files.has("package.json") || hasExt(files, [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"])) {
    const reasons = files.has("package.json") ? ["package.json present"] : ["JavaScript or TypeScript files present"];
    if (snapshot.packageScripts && Object.keys(snapshot.packageScripts).length > 0) {
      reasons.push("package scripts detected");
    }
    add("node", files.has("package.json") ? 100 : 60, reasons);
  }

  if (
    files.has("pyproject.toml") ||
    files.has("requirements.txt") ||
    files.has("pytest.ini") ||
    hasExt(files, [".py"])
  ) {
    const reasons = files.has("pyproject.toml") ? ["pyproject.toml present"] : ["Python files present"];
    if (snapshot.pyprojectTools && snapshot.pyprojectTools.length > 0) {
      reasons.push(`pyproject tools: ${snapshot.pyprojectTools.join(", ")}`);
    }
    add("python", files.has("pyproject.toml") || files.has("requirements.txt") ? 100 : 60, reasons);
  }

  if (files.has("Gemfile") || hasExt(files, [".rb"])) {
    add("ruby", files.has("Gemfile") ? 100 : 60, [files.has("Gemfile") ? "Gemfile present" : "Ruby files present"]);
  }

  if (files.has("go.mod") || hasExt(files, [".go"])) {
    add("go", files.has("go.mod") ? 100 : 60, [files.has("go.mod") ? "go.mod present" : "Go files present"]);
  }

  if (files.has("Cargo.toml") || hasExt(files, [".rs"])) {
    add("rust", files.has("Cargo.toml") ? 100 : 60, [files.has("Cargo.toml") ? "Cargo.toml present" : "Rust files present"]);
  }

  if ([...files].some((file) => file.endsWith(".md") || file.startsWith("docs/"))) {
    add("docs", 80, ["documentation files present"]);
  }

  if ([...files].some((file) => file.startsWith(".github/workflows/") || file.includes("ci"))) {
    add("ci", 80, ["CI or workflow files present"]);
  }

  return signals.sort((a, b) => b.confidence - a.confidence || a.stack.localeCompare(b.stack));
}

function normalizePath(file: string): string {
  return file.replaceAll("\\", "/");
}

function hasExt(files: Set<string>, exts: string[]): boolean {
  return [...files].some((file) => exts.some((ext) => file.endsWith(ext)));
}
