#!/usr/bin/env node
'use strict';

// Validates the numbering of proposals in ai-planning/.
//
//   node scripts/check-ai-planning.js          Check numbering (exit 1 on problems)
//   node scripts/check-ai-planning.js --next   Print the next proposal number (e.g. 002)

const fs = require('fs');
const path = require('path');

const PROPOSALS_DIR = path.join(__dirname, '..', 'ai-planning');
const NAME_PATTERN = /^(\d{3})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

function pad(n) {
  return String(n).padStart(3, '0');
}

function listProposals() {
  return fs
    .readdirSync(PROPOSALS_DIR)
    .filter((name) => !name.startsWith('.'))
    .sort();
}

function check(files) {
  const errors = [];
  const byNumber = new Map();

  for (const file of files) {
    const match = NAME_PATTERN.exec(file);
    if (!match) {
      errors.push(`"${file}" does not match NNN-kebab-case-name.md`);
      continue;
    }
    const n = Number(match[1]);
    if (!byNumber.has(n)) byNumber.set(n, []);
    byNumber.get(n).push(file);
  }

  for (const [n, names] of byNumber) {
    if (n === 0) errors.push(`"${names[0]}" uses 000; numbering starts at 001`);
    if (names.length > 1) errors.push(`Duplicate number ${pad(n)}: ${names.join(', ')}`);
  }

  const max = Math.max(0, ...byNumber.keys());
  for (let n = 1; n <= max; n++) {
    if (!byNumber.has(n)) errors.push(`Missing number ${pad(n)} (gap before ${pad(max)})`);
  }

  return { errors, max };
}

const { errors, max } = check(listProposals());

if (process.argv.includes('--next')) {
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(pad(max + 1));
  process.exit(0);
}

if (errors.length > 0) {
  console.error('ai-planning numbering check failed:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log(`ai-planning numbering OK (${max} proposal${max === 1 ? '' : 's'}).`);
