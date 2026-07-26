---
name: content-mdx-nomod-check
description: How to verify the "no MDX files modified" acceptance criterion on a feature branch
metadata:
  type: feedback
---

To verify an acceptance criterion like "content/**/*.mdx files were not modified", use `git log --diff-filter=M --name-only main..HEAD -- content/` — NOT `git diff main -- content/`.

**Why:**
`git diff main -- content/` shows every file that differs from main, including files *added* on the branch (all 69 lesson MDX files were added in the base commit `6ddd014`). That gives a huge false-positive list and looks like the criterion was violated. `--diff-filter=M` restricts to modifications only, matching the intent of the acceptance criterion.

**How to apply:**
- When an acceptance criterion says "did not modify X directory", check `git log --diff-filter=M --name-only <base>..HEAD -- <dir>`.
- Empty output = criterion satisfied.
- If files were both modified and later reverted, additionally check `git diff <base>..HEAD -- <dir>` to confirm net-zero.

See also: [[verify-script-quirks]]
