---
name: verify-script-quirks
description: run-static-verify.sh and verify-typescript.sh have quirks that can produce misleading verdicts on this repo
metadata:
  type: feedback
---

`./scripts/run-static-verify.sh` and `./scripts/verify-typescript.sh` both have quirks that can silently misreport verification outcomes on this repo. Do not trust their pass/fail exit code alone — run the underlying commands directly (`node_modules/.bin/tsc --noEmit`, `pnpm lint`, `pnpm build`) and cross-check.

**Why:**
1. `run-verify.sh` treats a branch as "docs-only" when `git diff` (working tree + index) is empty. On a feature branch where all changes are already committed, it prints "ドキュメントのみの変更のようです。" and skips all verifiers even though `main..HEAD` contains real code changes.
2. `verify-typescript.sh` uses `((PASS++))` under `set -e`. Bash `((expr))` returns exit 1 when the post-increment expression evaluates to 0 (i.e. the first successful check), so the script exits 1 even when every internal check passed. Output is truncated after the first `[PASS]` line.

**How to apply:**
- When verifying a committed feature branch, do not rely on `./scripts/run-static-verify.sh` alone — also run `tsc --noEmit`, `pnpm lint`, `pnpm build` directly and capture their exit codes.
- If the verify script exits non-zero but the individual commands all pass, note the script quirk in the verify report rather than declaring `fail`.
- Consider proposing fixes: `run-verify.sh` should also look at `git diff main...HEAD --name-only`; `verify-typescript.sh` should use `PASS=$((PASS+1))` or `((++PASS))`.

See also: [[content-mdx-nomod-check]]
