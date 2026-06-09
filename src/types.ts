export type StackName = "node" | "python" | "ruby" | "go" | "rust" | "docs" | "ci";
export type LaneLevel = "focused" | "standard" | "broad";

export interface RepositorySnapshot {
  files: string[];
  packageScripts?: Record<string, string>;
  pyprojectTools?: string[];
}

export interface StackSignal {
  stack: StackName;
  confidence: number;
  reasons: string[];
}

export interface TestLane {
  id: string;
  level: LaneLevel;
  command: string;
  reason: string;
  stacks: StackName[];
}

export interface LanePlan {
  changedFiles: string[];
  stacks: StackSignal[];
  lanes: TestLane[];
  notes: string[];
}
