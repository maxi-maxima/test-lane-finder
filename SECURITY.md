# Security

`test-lane-finder` reads local repository metadata and writes local reports. It does not send file lists or diffs to a remote service.

It recommends commands but does not execute them.

## Reporting Issues

Please report security issues privately if you find:

- arbitrary file writes outside the output directory
- command execution despite planner-only behavior
- unsafe handling of repository paths
