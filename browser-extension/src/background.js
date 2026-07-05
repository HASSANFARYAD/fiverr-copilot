const API_BASE = "http://localhost:8777";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "CLASSIFY_MESSAGE":
      classifyMessage(message.text, sendResponse);
      return true;
    case "GENERATE_REPLY":
      generateReply(message.text, message.tone, sendResponse);
      return true;
    case "FETCH_CONVERSATIONS":
      fetchConversations(sendResponse);
      return true;
    case "FETCH_GIGS":
      fetchGigs(sendResponse);
      return true;
    case "HEALTH_CHECK":
      healthCheck(sendResponse);
      return true;
  }
});

async function healthCheck(sendResponse) {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    sendResponse({ ok: true, data });
  } catch {
    sendResponse({ ok: false, error: "Backend not running" });
  }
}

async function classifyMessage(text, sendResponse) {
  try {
    const res = await fetch(`${API_BASE}/extension/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    sendResponse({ ok: true, data });
  } catch {
    sendResponse({ ok: false, error: "Classification failed" });
  }
}

async function generateReply(text, tone, sendResponse) {
  try {
    const res = await fetch(`${API_BASE}/extension/reply-draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, tone: tone || "professional" }),
    });
    const data = await res.json();
    sendResponse({ ok: true, data });
  } catch {
    sendResponse({ ok: false, error: "Reply generation failed" });
  }
}

async function fetchConversations(sendResponse) {
  try {
    const res = await fetch(`${API_BASE}/conversations`);
    const data = await res.json();
    sendResponse({ ok: true, data });
  } catch {
    sendResponse({ ok: false, error: "Failed to fetch conversations" });
  }
}

async function fetchGigs(sendResponse) {
  try {
    const res = await fetch(`${API_BASE}/gigs`);
    const data = await res.json();
    sendResponse({ ok: true, data });
  } catch {
    sendResponse({ ok: false, error: "Failed to fetch gigs" });
  }
}
