const assert = require('node:assert/strict');
require('../scanner.js');
const { scan, redact } = globalThis.PromptShieldScanner;

const cases = [
  {
    name: 'finds OpenAI-style keys',
    input: 'token = sk-abcdefghijklmnopqrstuvwxyz123456',
    expected: 'OpenAI-style API key'
  },
  {
    name: 'finds GitHub classic tokens',
    input: 'ghp_abcdefghijklmnopqrstuvwxyz1234567890',
    expected: 'GitHub token'
  },
  {
    name: 'finds AWS access key IDs',
    input: 'AKIA1234567890ABCDEF',
    expected: 'AWS access key ID'
  },
  {
    name: 'finds secret assignments',
    input: 'password="hunter2-very-secret"',
    expected: 'Possible password or secret assignment'
  },
  {
    name: 'finds connection-string credentials',
    input: 'postgres://appuser:verysecretpassword@db.example.test/app',
    expected: 'Possible connection string credential'
  },
  {
    name: 'does not flag ordinary text',
    input: 'Please explain how JavaScript promises work.',
    expected: null
  }
];

for (const testCase of cases) {
  const findings = scan(testCase.input);
  if (testCase.expected === null) {
    assert.equal(findings.length, 0, testCase.name);
  } else {
    assert.ok(findings.some(f => f.types.includes(testCase.expected)), `${testCase.name}: ${JSON.stringify(findings)}`);
  }
}

const nested = 'api_key = "sk-abcdefghijklmnopqrstuvwxyz123456"';
const matches = scan(nested);
assert.ok(matches.length >= 1, 'overlapping credential patterns should be caught');
const cleaned = redact(nested, matches);
assert.match(cleaned, /\[REDACTED_/);
assert.doesNotMatch(cleaned, /sk-abcdefghijklmnopqrstuvwxyz123456/);
assert.equal(redact('nothing secret here'), 'nothing secret here');

console.log(`PromptShield scanner: ${cases.length + 3} checks passed.`);
