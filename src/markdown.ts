import type { LanePlan } from "./types.js";

export function toMarkdown(plan: LanePlan): string {
  const lines = [
    "# Test Lane Finder Report",
    "",
    "## Changed Files",
    ""
  ];

  for (const file of plan.changedFiles) {
    lines.push(`- \`${file}\``);
  }

  lines.push("");
  lines.push("## Detected Stacks");
  lines.push("");
  lines.push("| Stack | Confidence | Reasons |");
  lines.push("| --- | ---: | --- |");
  for (const stack of plan.stacks) {
    lines.push(`| ${stack.stack} | ${stack.confidence} | ${stack.reasons.join("<br>")} |`);
  }

  lines.push("");
  lines.push("## Recommended Lanes");
  lines.push("");

  if (plan.lanes.length === 0) {
    lines.push("No stack-specific lane matched.");
  } else {
    lines.push("| Level | Command | Reason |");
    lines.push("| --- | --- | --- |");
    for (const lane of plan.lanes) {
      lines.push(`| ${lane.level} | \`${lane.command}\` | ${lane.reason} |`);
    }
  }

  if (plan.notes.length > 0) {
    lines.push("");
    lines.push("## Notes");
    lines.push("");
    for (const note of plan.notes) {
      lines.push(`- ${note}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}
