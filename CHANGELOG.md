# Changelog

## 0.2.0 — MVP hardening

- Expanded local detection rules for common API keys, access tokens, private keys, credential assignments, and database connection strings.
- Improved overlap handling so a nested match is not left partially exposed by redaction.
- Made “Copy safe text” rescan and redact the current text before copying.
- Cleared stale scan results when the prompt is edited.
- Improved experimental send-warning behavior and added a form-submit fallback.
- Added scanner regression tests, extension icons, and clearer privacy/safety documentation.

Website interception remains experimental and needs real-browser verification on each supported site.
