# Agent guide

## AI planning proposals (`ai-planning/`)

Design proposals and planning write-ups live in `ai-planning/`.

### Naming

Every file is named `NNN-kebab-case-name.md`:

- `NNN` is a three-digit number, zero-padded, starting at `001`.
- Numbers are assigned in the order proposals are created.
- No gaps and no duplicates. Never renumber or reuse a number.
- Every file in the directory must follow this pattern (dotfiles are ignored).

Example: `001-unified-frontend-proposal.md`.

### Adding a proposal

1. Get the next number: `npm run ai-planning:next` (prints e.g. `002`).
2. Create `ai-planning/<that number>-<short-name>.md`.
3. Run `npm test` to confirm the numbering is valid.

### Enforcement

`npm test` runs `scripts/check-ai-planning.js`, which fails if a file is
misnamed, a number is duplicated, numbering does not start at `001`, or
there is a gap. `node scripts/check-ai-planning.js --next` prints the next
number and exits non-zero if the existing numbering is invalid.
