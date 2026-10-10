(() => {
  "use strict";
  if (!globalThis.PromptShieldScanner) return;

  const EDITOR_SELECTOR = 'textarea, [contenteditable="true"], [role="textbox"]';
  const SEND_SELECTOR = [
    'button[data-testid="send-button"]',
    'button[aria-label*="send" i]',
    'button[title*="send" i]',
    'button[data-testid*="send" i]'
  ].join(",");

  let warningOpen = false;
  let allowOneSend = false;
  let pending = null;

  function getText(editor) {
    if (!editor) return "";
    return "value" in editor ? String(editor.value || "") : String(editor.innerText || editor.textContent || "");
  }

  function setText(editor, value) {
    if (!editor || !editor.isConnected) return;
    editor.focus();
    if ("value" in editor) {
      const prototype = Object.getPrototypeOf(editor);
      const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
      if (setter) setter.call(editor, value);
      else editor.value = value;
      editor.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      editor.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      // Keep the implementation conservative: rich editors may maintain their
      // own state, so the input event asks the page framework to reconcile.
      editor.textContent = value;
      editor.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true, inputType: "insertText", data: value }));
    }
  }

  function closeWarning() {
    document.getElementById("promptshield-warning")?.remove();
    warningOpen = false;
    pending = null;
  }

  function makeButton(label, className, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
  }

  function findSendButton(editor) {
    const form = editor?.closest?.("form");
    return form?.querySelector(SEND_SELECTOR) || document.querySelector(SEND_SELECTOR);
  }

  function continueSend() {
    const target = pending?.editor;
    if (!target?.isConnected) {
      closeWarning();
      return;
    }

    closeWarning();
    allowOneSend = true;
    const button = findSendButton(target);
    if (button && !button.disabled) {
      button.click();
      // If the site's handler does not trigger a submit synchronously, don't
      // leave a stale bypass enabled for a later user action.
      queueMicrotask(() => { allowOneSend = false; });
      return;
    }

    const form = target.closest("form");
    if (form?.requestSubmit) {
      form.requestSubmit();
      queueMicrotask(() => { allowOneSend = false; });
    } else {
      allowOneSend = false;
      alert("PromptShield couldn't find the site's send control. Please use the site's send button after reviewing the prompt.");
    }
  }

  function showWarning(editor, findings) {
    closeWarning();
    warningOpen = true;
    pending = { editor, findings, text: getText(editor) };

    const panel = document.createElement("section");
    panel.id = "promptshield-warning";
    panel.setAttribute("role", "alertdialog");
    panel.setAttribute("aria-label", "PromptShield secret warning");

    const title = document.createElement("div");
    title.className = "ps-title";
    const mark = document.createElement("span");
    mark.className = "ps-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "!";
    const heading = document.createElement("span");
    heading.textContent = "Possible secrets detected";
    title.append(mark, heading);

    const description = document.createElement("p");
    description.textContent = `Found ${findings.length} possible secret pattern(s). Review or redact them before continuing.`;

    const list = document.createElement("div");
    list.className = "ps-list";
    list.textContent = [...new Set(findings.flatMap(item => item.types || [item.type]))].join(" · ");

    const actions = document.createElement("div");
    actions.className = "ps-actions";
    actions.append(
      makeButton("Redact & review", "ps-redact", () => {
        const saved = pending;
        if (saved?.editor?.isConnected) {
          setText(saved.editor, PromptShieldScanner.redact(saved.text, saved.findings));
          saved.editor.focus();
        }
        closeWarning();
      }),
      makeButton("Send anyway", "ps-send", continueSend),
      makeButton("Keep editing", "ps-cancel", closeWarning)
    );

    panel.append(title, description, list, actions);
    document.body.append(panel);
  }

  function shouldWarn(editor, event) {
    if (!editor) return false;
    if (allowOneSend) {
      // Keep the one-shot bypass active through a synchronous form submit.
      // The submit listener consumes it; a microtask clears it if no submit fires.
      return false;
    }
    // While the warning is open, don't allow the underlying site's send button
    // to submit by clicking around the floating warning.
    if (warningOpen) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      return true;
    }

    const text = getText(editor);
    if (!text.trim()) return false;
    const findings = PromptShieldScanner.scan(text);
    if (!findings.length) return false;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    showWarning(editor, findings);
    return true;
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    const editor = event.target?.closest?.(EDITOR_SELECTOR);
    if (editor) shouldWarn(editor, event);
  }, true);

  document.addEventListener("click", (event) => {
    const button = event.target?.closest?.(SEND_SELECTOR);
    if (!button) return;
    const form = button.closest("form");
    const editor = form?.querySelector(EDITOR_SELECTOR) || document.querySelector(EDITOR_SELECTOR);
    if (editor) shouldWarn(editor, event);
  }, true);

  // A fallback for send forms whose page sends by submitting a form instead
  // of a recognizable button. It is best-effort and site-specific behavior may vary.
  document.addEventListener("submit", (event) => {
    if (allowOneSend) {
      allowOneSend = false;
      return;
    }
    if (warningOpen) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      return;
    }
    const form = event.target;
    const editor = form?.querySelector?.(EDITOR_SELECTOR);
    if (editor) shouldWarn(editor, event);
  }, true);
})();
