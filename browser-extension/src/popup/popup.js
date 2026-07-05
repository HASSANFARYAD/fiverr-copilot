(function () {
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const content = document.getElementById("content");
  const loadingMsg = document.getElementById("loadingMsg");

  chrome.runtime.sendMessage({ type: "HEALTH_CHECK" }, (res) => {
    if (res && res.ok) {
      statusDot.className = "dot ok";
      statusText.textContent = "Backend connected";
      loadDashboard();
    } else {
      statusDot.className = "dot err";
      statusText.textContent = "Backend offline — start the server";
      loadingMsg.style.display = "none";
      content.innerHTML = `<div class="error">⚠ Backend not running.<br><br>Run in terminal:<br><code style="font-size:12px;background:#f3f4f6;padding:4px 8px;border-radius:4px;display:inline-block;margin-top:4px;">uvicorn backend.main:app --reload</code></div>`;
    }
  });

  function loadDashboard() {
    chrome.runtime.sendMessage({ type: "FETCH_CONVERSATIONS" }, (convRes) => {
      chrome.runtime.sendMessage({ type: "FETCH_GIGS" }, (gigRes) => {
        loadingMsg.style.display = "none";

        const convCount = convRes?.ok ? convRes.data?.length || 0 : 0;
        const gigCount = gigRes?.ok ? gigRes.data?.length || 0 : 0;
        const overdue = convRes?.ok ? convRes.data?.filter((c) => c.status === "active")?.length || 0 : 0;

        const gigScore = gigRes?.ok && gigRes.data?.length > 0 ? gigRes.data[0].score || 0 : 0;

        content.innerHTML = `
          <div class="section">
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-value ${gigScore >= 80 ? 'green' : gigScore >= 50 ? 'yellow' : 'red'}">${gigScore}</div>
                <div class="stat-label">Gig Score</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${convCount}</div>
                <div class="stat-label">Conversations</div>
              </div>
              <div class="stat-card">
                <div class="stat-value ${overdue > 0 ? 'red' : 'green'}">${overdue}</div>
                <div class="stat-label">Active</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${gigCount}</div>
                <div class="stat-label">Gig Drafts</div>
              </div>
            </div>
          </div>
          <div style="margin-top:12px;padding:10px 14px;background:#f0f9ff;border-radius:8px;font-size:13px;color:#1e40af;">
            💡 Open <strong>Fiverr inbox</strong> to classify messages and draft replies.
          </div>
        `;
      });
    });
  }
})();
