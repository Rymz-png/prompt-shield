const $ = (id) => document.getElementById(id);
let latestFindings = [];

function mask(value) {
  if (!value) return "••••••••";
  if (value.length < 10) return "••••••";
  return `${value.slice(0, 4)}••••${value.slice(-3)}`;
}

function runScan() {
  const text = $("prompt").value;
  latestFindings = PromptShieldScanner.scan(text);
  $("results").classList.remove("hidden");
  $("count").textContent = String(latestFindings.length);
  $("findings").replaceChildren();

  if (!text.trim()) {
    $("result-title").textContent = "Nothing to scan yet";
    $("result-copy").textContent = "Paste some text above, then run the scan.";
    $("redact-actions").classList.add("hidden");
    return;
  }

  if (!latestFindings.length) {
    $("result-title").textContent = "No known patterns found";
    $("result-copy").textContent = "No known patterns found. This does not guarantee that the text is safe.";
    $("redact-actions").classList.add("hidden");
    return;
  }

  $("result-title").textContent = "Potential secrets detected";
  $("result-copy").textContent = "Review these matches before sharing. Detection can miss secrets or flag harmless examples.";
  latestFindings.forEach((finding) => {
    const li = document.createElement("li");
    const wrapper = document.createElement("div");
    const title = document.createElement("b");
    const value = document.createElement("code");
    title.textContent = finding.type;
    value.textContent = mask(finding.value);
    wrapper.append(title, value);
    li.append(wrapper);
    $("findings").append(li);
  });
  $("redact-actions").classList.remove("hidden");
}

$("scan").addEventListener("click", runScan);
$("clear").addEventListener("click", () => {
  $("prompt").value = "";
  $("results").classList.add("hidden");
  latestFindings = [];
});
$("redact").addEventListener("click", () => {
  $("prompt").value = PromptShieldScanner.redact($("prompt").value, latestFindings);
  runScan();
});
$("copy").addEventListener("click", async () => {
  try {
    // Always rescan the current text; never trust findings from an older edit.
    const currentText = $("prompt").value;
    const currentFindings = PromptShieldScanner.scan(currentText);
    const safeText = PromptShieldScanner.redact(currentText, currentFindings);
    await navigator.clipboard.writeText(safeText);
    if (currentFindings.length) {
      $("prompt").value = safeText;
      runScan();
    }
    $("copy").textContent = "Copied safe text!";
    setTimeout(() => $("copy").textContent = "Copy safe text", 1400);
  } catch {
    $("copy").textContent = "Copy unavailable";
    setTimeout(() => $("copy").textContent = "Copy safe text", 1400);
  }
});

// Findings apply only to the exact text that was scanned. Hide stale results
// when the user edits the input, requiring a fresh scan before presenting them.
$("prompt").addEventListener("input", () => {
  latestFindings = [];
  $("results").classList.add("hidden");
});