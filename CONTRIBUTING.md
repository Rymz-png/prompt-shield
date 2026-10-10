# Contributing

Thanks for helping improve PromptShield!

## Before opening an issue or pull request

- Reproduce the behavior with the latest code when possible.
- Use synthetic/fake credentials only. Never include real API keys, passwords, tokens, cookies, or private data in issues, commits, screenshots, or tests.
- For a new scanner rule, add positive and negative cases to `tests/scanner.test.js`.
- Keep scanning local and avoid adding network requests that transmit prompt contents.
- Describe any limitations or false positives honestly.

## Run the tests

Requires Node.js; no dependency install is needed:

```bash
node tests/scanner.test.js
```

## Pull requests

Keep changes focused, describe the behavior change, include test results, and mention any website/browser versions used when changing send interception.
