function getActiveUser() {
  const raw = localStorage.getItem("loggedInUser");
  const rawKey = localStorage.getItem("loggedInUserKey");
  
  if (!raw && !rawKey) return null;
  
  let activeUser = null;
  let key = rawKey;
  
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        activeUser = parsed;
        key = parsed.id || rawKey;
      } else if (typeof parsed === "string") {
        key = parsed;
      }
    } catch {
      key = raw;
    }
  }
  
  // Fill full object if contact, social, or conference is missing
  if (
    (!activeUser?.contact || !activeUser?.social || !activeUser?.conference) &&
    typeof getUserInfo === "function"
  ) {
    const fullUser = getUserInfo(key);
    if (fullUser) activeUser = fullUser;
  }
  
  return activeUser;
}

function safeSetText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}

/* -----------------------------------------
   NEW: Render Platform (Clickable / N/A)
----------------------------------------- */
function renderService(id, platformName, value) {
  const el = document.getElementById(id);
  if (!el) return;
  
  if (value && value.trim() !== "") {
    el.textContent = platformName;
    el.href = value.startsWith("http") ? value : `https://${value}`;
    el.classList.add("value-enabled");
    el.classList.remove("value-disabled");
  } else {
    el.textContent = "N/A";
    el.removeAttribute("href");
    el.classList.add("value-disabled");
    el.classList.remove("value-enabled");
  }
}

// Open QR page for clicked platform
function openQR(platformId) {
    const activeUser = getActiveUser();
    if (!activeUser) {
        alert("No active user found.");
        return;
    }

    // Encode user object and platform to URL
    const userData = encodeURIComponent(JSON.stringify(activeUser));
    const platform = encodeURIComponent(platformId);

    window.location.href = `Qr/Qr.html?user=${userData}&platform=${platform}`;
}


document.addEventListener("DOMContentLoaded", function() {
  const activeUser = getActiveUser();
  
  if (!activeUser) {
    safeSetText("greeting", "User data not found.");
    return;
  }
  
  const displayName = activeUser.codename || activeUser.codeName || activeUser.name || "Agent";
  safeSetText("greeting", `Welcome, ${displayName}!`);
  
  // Contact info
  safeSetText("phone", `Phone Number: ${activeUser.contact?.phone || "N/A"}`);
  safeSetText("landline", `Landline Number: ${activeUser.contact?.landline || "N/A"}`);
  safeSetText("email", `Email: ${activeUser.contact?.email || activeUser.email || "N/A"}`);
  
  // Social channels
  renderService("facebook", "Facebook", activeUser.social?.facebook);
  renderService("messenger", "Messenger", activeUser.social?.messenger);
  renderService("instagram", "Instagram", activeUser.social?.instagram);
  renderService("tiktok", "TikTok", activeUser.social?.tiktok);
  renderService("tiktok_business", "Affiliate/ Business", activeUser.social?.tiktok_business);
  renderService("twitter", "Twitter/X", activeUser.social?.twitter);
  
  // Conference platforms
  renderService("viber", "Viber", activeUser.conference?.viber);
  renderService("zoom", "Zoom", activeUser.conference?.zoom);
  renderService("teams", "Microsoft Teams", activeUser.conference?.teams);
  renderService("whatsapp", "WhatsApp", activeUser.conference?.whatsapp);
  renderService("telegram", "Telegram", activeUser.conference?.telegram);
  renderService("google_meet", "Google Meet", activeUser.conference?.google_meet); 
  
      // Attach click event to all QR buttons
    document.querySelectorAll(".qr-btn").forEach(btn => {
          btn.addEventListener("click", function() {
                const platformId = this.getAttribute("data-type");
                openQR(platformId);
});
});
})