(() => {
  "use strict";

  // Detection is intentionally local. These patterns are heuristics, not proof
  // that a value is secret or that text is safe when no match is found.
  const PATTERNS = [
    {
      type: "Private key",
      severity: "critical",
      regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----[\s\S]{20,}?-----END (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g
    },
    {
      type: "OpenAI-style API key",
      severity: "high",
      regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{16,}\b/g
    },
    {
      type: "GitHub token",
      severity: "high",
      regex: /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g
    },
    {
      type: "AWS access key ID",
      severity: "high",
      regex: /\bAKIA[0-9A-Z]{16}\b/g
    },
    {
      type: "Slack token",
      severity: "high",
      regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g
    },
    {
      type: "Stripe live secret key",
      severity: "high",
      regex: /\bsk_live_[A-Za-z0-9]{16,}\b/g
    },
    {
      type: "Google API key",
      severity: "medium",
      regex: /\bAIza[0-9A-Za-z_-]{30,}\b/g
    },
    {
      type: "Bearer token",
      severity: "high",
      regex: /\bBearer\s+[A-Za-z0-9._~+\/-]{16,}={0,2}/gi
    },
    {
      type: "Possible password or secret assignment",
      severity: "medium",
      regex: /\b(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret)\s*[:=]\s*(?:"[^"\r\n]{6,}"|'[^'\r\n]{6,}'|[^\s,;#]{6,})/gi
    },
    {
      type: "Possible connection string credential",
      severity: "medium",
      regex: /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql):\/\/[^\s/:@]+:[^\s/@]{4,}@[^\s]+/gi
    }
  ];

  function scan(input) {
    const text = String(input ?? "");
    const matches = [];

    for (const pattern of PATTERNS) {
      // Global regex instances are stateful; always reset before scanning.
      pattern.regex.lastIndex = 0;
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        if (!match[0]) {
          pattern.regex.lastIndex++;
          continue;
        }
        matches.push({
          type: pattern.type,
          types: [pattern.type],
          severity: pattern.severity,
          value: match[0],
          start: match.index,
          end: match.index + match[0].length
        });
      }
    }

    matches.sort((a, b) => a.start - b.start || b.end - a.end);

    // Merge overlapping detections into one redactable range while preserving
    // all rule names. This prevents a nested match from exposing part of a key.
    const merged = [];
    for (const item of matches) {
      const previous = merged[merged.length - 1];
      if (previous && item.start < previous.end) {
        previous.end = Math.max(previous.end, item.end);
        previous.value = text.slice(previous.start, previous.end);
        for (const type of item.types) {
          if (!previous.types.includes(type)) previous.types.push(type);
        }
        if (item.severity === "critical" || (item.severity === "high" && previous.severity === "medium")) {
          previous.severity = item.severity;
        }
        previous.type = previous.types.join(" + ");
      } else {
        merged.push({ ...item, types: [...item.types] });
      }
    }
    return merged;
  }

  function redact(input, findings) {
    const text = String(input ?? "");
    const matches = Array.isArray(findings) ? findings : scan(text);
    // Ignore malformed/out-of-range findings and apply from right to left so
    // offsets stay stable. Only spans returned by this scanner should be used.
    const valid = matches
      .filter(f => Number.isInteger(f.start) && Number.isInteger(f.end) && f.start >= 0 && f.end > f.start && f.end <= text.length)
      .sort((a, b) => b.start - a.start);

    let output = text;
    for (const finding of valid) {
      const label = (finding.types || [finding.type || "SECRET"])
        .join("_").toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60);
      output = output.slice(0, finding.start) + `[REDACTED_${label || "SECRET"}]` + output.slice(finding.end);
    }
    return output;
  }

  globalThis.PromptShieldScanner = Object.freeze({ scan, redact });
})();
