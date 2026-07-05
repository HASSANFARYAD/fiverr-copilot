(function () {
  "use strict";

  const API_BASE = "http://localhost:8777";

  let panel = null;
  let isPanelOpen = false;

  const STATE = {
    intent: null,
    confidence: null,
    replyDraft: null,
    buyerName: "",
    messageText: "",
  };

  function init() {
    injectFloatingButton();
    waitForConversation().then(() => {
      detectMessage();
    });
  }

  function injectFloatingButton() {
    const btn = document.createElement("div");
    btn.id = "fiverr-copilot-fab";
    btn.innerHTML = `
      <div class="copilot-fab-inner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
    `;
    btn.addEventListener("click", togglePanel);
    document.body.appendChild(btn);
  }

  function togglePanel() {
    if (isPanelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function openPanel() {
    if (!panel) {
      panel = createPanel();
      document.body.appendChild(panel);
    }
    panel.classList.add("copilot-panel--open");
    isPanelOpen = true;

    document.getElementById("fiverr-copilot-fab")?.classList.add("copilot-fab--active");

    checkBackendHealth();
    if (STATE.messageText) {
      classifyCurrentMessage();
    }
  }

  function closePanel() {
    if (panel) {
      panel.classList.remove("copilot-panel--open");
    }
    isPanelOpen = false;
    document.getElementById("fiverr-copilot-fab")?.classList.remove("copilot-fab--active");
  }

  function createPanel() {
    const el = document.createElement("div");
    el.id = "copilot-panel";
    el.innerHTML = `
      <div class="copilot-panel-header">
        <span class="copilot-panel-title">Fiverr Copilot</span>
        <button class="copilot-panel-close" id="copilot-close-btn">✕</button>
      </div>
      <div class="copilot-panel-body">
        <div id="copilot-health" class="copilot-section">
          <div class="copilot-status-dot copilot-status--checking"></div>
          <span>Checking backend...</span>
        </div>

        <div id="copilot-conversation-section" class="copilot-section" style="display:none">
          <div class="copilot-section-label">Conversation</div>
          <div id="copilot-buyer-name" class="copilot-buyer-name"></div>
        </div>

        <div id="copilot-classify-section" class="copilot-section" style="display:none">
          <div class="copilot-section-label">Intent Classification</div>
          <div id="copilot-intent-badge" class="copilot-intent-badge"></div>
          <div id="copilot-confidence" class="copilot-confidence"></div>
          <button class="copilot-btn copilot-btn-secondary" id="copilot-classify-btn">Classify Message</button>
        </div>

        <div id="copilot-reply-section" class="copilot-section" style="display:none">
          <div class="copilot-section-label">Draft Reply</div>
          <div id="copilot-reply-content" class="copilot-reply-content"></div>
          <div class="copilot-reply-actions">
            <button class="copilot-btn copilot-btn-primary" id="copilot-copy-btn">Copy to Clipboard</button>
            <button class="copilot-btn copilot-btn-secondary" id="copilot-regen-btn">Regenerate</button>
          </div>
        </div>

        <div id="copilot-deadline-section" class="copilot-section" style="display:none">
          <div class="copilot-section-label">Response Timer</div>
          <div id="copilot-timer" class="copilot-timer">--:--:--</div>
          <div class="copilot-timer-bar">
            <div id="copilot-timer-bar-fill" class="copilot-timer-bar-fill"></div>
          </div>
        </div>

        <div id="copilot-error" class="copilot-error" style="display:none"></div>
      </div>
    `;

    el.querySelector("#copilot-close-btn").addEventListener("click", closePanel);
    el.querySelector("#copilot-classify-btn").addEventListener("click", () => classifyCurrentMessage());
    el.querySelector("#copilot-copy-btn").addEventListener("click", copyReply);
    el.querySelector("#copilot-regen-btn").addEventListener("click", () => generateDraft());

    return el;
  }

  async function checkBackendHealth() {
    const healthEl = document.getElementById("copilot-health");
    const dot = healthEl?.querySelector(".copilot-status-dot");
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        dot.className = "copilot-status-dot copilot-status--ok";
        healthEl.querySelector("span").textContent = "Backend connected";
      } else {
        throw new Error();
      }
    } catch {
      dot.className = "copilot-status-dot copilot-status--error";
      healthEl.querySelector("span").textContent = "Backend offline — start with: uvicorn backend.main:app --reload";
    }
  }

  function detectMessage() {
    const msgEl = document.querySelector('[class*="message"] [class*="text"], [class*="chat"] [class*="message"], .conversation-panel');
    if (msgEl) {
      STATE.messageText = msgEl.textContent.trim();
      const nameEl = document.querySelector('[class*="username"], [class*="buyer-name"], [class*="participant"]');
      if (nameEl) STATE.buyerName = nameEl.textContent.trim();

      const convSection = document.getElementById("copilot-conversation-section");
      if (convSection) {
        convSection.style.display = "block";
        const nameDisplay = document.getElementById("copilot-buyer-name");
        if (nameDisplay) nameDisplay.textContent = STATE.buyerName || "Unknown buyer";
      }
    }
  }

  async function classifyCurrentMessage() {
    const classifySection = document.getElementById("copilot-classify-section");
    if (!classifySection) return;
    classifySection.style.display = "block";

    const btn = document.getElementById("copilot-classify-btn");
    btn.textContent = "Classifying...";
    btn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/extension/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: STATE.messageText }),
      });
      const data = await res.json();
      STATE.intent = data.intent_label || "unknown";
      STATE.confidence = data.confidence || 0;

      const badge = document.getElementById("copilot-intent-badge");
      badge.textContent = STATE.intent;
      badge.className = `copilot-intent-badge copilot-intent--${STATE.intent}`;

      const confEl = document.getElementById("copilot-confidence");
      confEl.textContent = `${Math.round(STATE.confidence * 100)}% confidence`;

      btn.style.display = "none";

      generateDraft();
      startTimer();
    } catch {
      showError("Classification failed. Is the backend running?");
      btn.textContent = "Classify Message";
      btn.disabled = false;
    }
  }

  async function generateDraft() {
    const replySection = document.getElementById("copilot-reply-section");
    if (!replySection) return;
    replySection.style.display = "block";

    const contentEl = document.getElementById("copilot-reply-content");
    contentEl.textContent = "Generating...";

    try {
      const res = await fetch(`${API_BASE}/extension/reply-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: STATE.messageText,
          tone: "professional",
        }),
      });
      const data = await res.json();
      STATE.replyDraft = data.content || data.reply || "Hi there!";
      contentEl.textContent = STATE.replyDraft;
    } catch {
      contentEl.textContent = "Could not generate reply. Check backend.";
    }
  }

  function copyReply() {
    if (!STATE.replyDraft) return;
    navigator.clipboard.writeText(STATE.replyDraft).then(() => {
      const btn = document.getElementById("copilot-copy-btn");
      btn.textContent = "Copied! ✓";
      setTimeout(() => { btn.textContent = "Copy to Clipboard"; }, 2000);
    });
  }

  function startTimer() {
    const section = document.getElementById("copilot-deadline-section");
    if (section) section.style.display = "block";

    const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const timerEl = document.getElementById("copilot-timer");
    const barFill = document.getElementById("copilot-timer-bar-fill");

    function tick() {
      const now = Date.now();
      const remaining = deadline.getTime() - now;
      if (remaining <= 0) {
        timerEl.textContent = "00:00:00";
        barFill.style.width = "100%";
        barFill.style.background = "#ef4444";
        return;
      }

      const total = 24 * 60 * 60 * 1000;
      const pct = ((total - remaining) / total) * 100;
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((remaining % (1000 * 60)) / 1000);

      timerEl.textContent = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      barFill.style.width = `${pct}%`;

      const color = remaining < 6 * 60 * 60 * 1000 ? "#ef4444" : remaining < 12 * 60 * 60 * 1000 ? "#f59e0b" : "#22c55e";
      barFill.style.background = color;
    }

    tick();
    setInterval(tick, 1000);
  }

  function showError(msg) {
    const errEl = document.getElementById("copilot-error");
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = "block";
    }
  }

  async function waitForConversation() {
    return new Promise((resolve) => {
      const check = () => {
        const msg = document.querySelector('[class*="message"]');
        if (msg) return resolve();
        setTimeout(check, 1000);
      };
      setTimeout(check, 2000);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
