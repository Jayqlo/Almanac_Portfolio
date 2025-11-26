// Silhouette_Main.js — Handles login, matrix animation, affinity and identification logic
document.addEventListener("DOMContentLoaded", () => {
  /* MATRIX */
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const fontSize = 16;
  let columns, drops;

  function resizeMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resizeMatrix();
  window.addEventListener("resize", resizeMatrix);
  setInterval(drawMatrix, 33);

  /* NAVIGATION */
  const closeBtn = document.getElementById("closeBtn");
  if (closeBtn) closeBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  const user = getActiveUser();

  /* ============== AFFINITY LOGIN ============== */
  const boxes = document.querySelectorAll(".passBox");
  boxes.forEach((box, i) => {
    box.addEventListener("input", () => {
      if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
    });
  });

  const loginBtn = document.getElementById("loginBtn");
  const passGrid = document.getElementById("passcodeGrid");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (!user || !user.id) {
        alert("No active user found. Please log in to Almanac first.");
        return;
      }

      const entered = Array.from(boxes).map(b => b.value).join("");
      const correct = affinityKeys[user.id.toLowerCase()];

      if (entered === correct) {
        document.getElementById("affinityLogin").style.display = "none";
        document.getElementById("affinityContent").style.display = "block";
        loadAffinityData(user.id.toLowerCase());
      } else {
        // ✦ Red glow feedback instead of alert ✦
        passGrid.classList.add("passcode-error");
        setTimeout(() => {
          passGrid.classList.remove("passcode-error");
        }, 1100);
      }
    });
  }

  const affinityBack = document.getElementById("affinityBack");
  if (affinityBack) affinityBack.addEventListener("click", () => {
    document.getElementById("affinityContent").style.display = "none";
    document.getElementById("affinityLogin").style.display = "block";
  });

  /* ============== IDENTIFICATION DATA ============== */
  const identBox = document.getElementById("identBox");
  const identLockedView = document.getElementById("identLockedView");
  const identDateInput = document.getElementById("identDateInput");
  const identUnlockBtn = document.getElementById("identUnlockBtn");
  const identLoading = document.getElementById("identLoading");
  const identContent = document.getElementById("identContent");
  const identClose = document.getElementById("identClose");

  if (identBox) identBox.classList.add("ident-locked-state");

  if (identLockedView) identLockedView.style.display = "none";
  if (identLoading) identLoading.style.display = "none";
  if (identContent) identContent.style.display = "none";

  function todayISO() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function randomDate(yearStart = 1990, yearEnd = new Date().getFullYear()) {
    const y = Math.floor(Math.random() * (yearEnd - yearStart + 1)) + yearStart;
    const m = Math.floor(Math.random() * 12) + 1;
    const d = Math.floor(Math.random() * 28) + 1;
    const mm = String(m).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }

  function seedRandomDateInput() {
    if (!identDateInput) return;
    identDateInput.value = randomDate(1990, new Date().getFullYear());
  }

  function ensureWarningEl() {
    if (!identBox) return null;
    let w = identBox.querySelector(".ident-warning");
    if (!w) {
      w = document.createElement("div");
      w.className = "ident-warning";
      w.setAttribute("aria-hidden", "true");
      identBox.appendChild(w);
    }
    return w;
  }

  function showCenterWarning() {
    const w = ensureWarningEl();
    if (!w) return;
    w.textContent = "!";
    w.classList.add("visible");
    setTimeout(() => {
      w.classList.remove("visible");
    }, 900);
  }

  if (identBox) {
    identBox.addEventListener("click", (ev) => {
      if (identBox.classList.contains("ident-unlocked")) return;
      if (identLockedView) {
        identLockedView.style.display = "block";
        identBox.classList.add("ident-ui-active");
      }
      seedRandomDateInput();
      setTimeout(() => {
        try { identDateInput.focus(); } catch (e) {}
      }, 60);
      ev.stopPropagation();
    }, { passive: true });
  }

  function wrongDateFeedback() {
    if (identBox) identBox.classList.add("ident-error");
    showCenterWarning();
    setTimeout(() => {
      if (identBox) identBox.classList.remove("ident-error");
    }, 1100);
  }

  if (identUnlockBtn) {
    identUnlockBtn.addEventListener("click", () => {
      if (!user || !user.id) {
        alert("No active user found. Please log in to Almanac first.");
        return;
      }

      const enteredDate = identDateInput ? identDateInput.value : "";
      const today = todayISO();

      if (enteredDate !== today) {
        wrongDateFeedback();
        return;
      }

      if (identLockedView) identLockedView.style.display = "none";
      if (identLoading) {
        identLoading.style.display = "flex";
        identLoading.classList.add("pulse-active");
      }

      setTimeout(() => {
        if (identLoading) {
          identLoading.style.display = "none";
          identLoading.classList.remove("pulse-active");
        }
        if (identContent) identContent.style.display = "block";
        if (identBox) {
          identBox.classList.remove("ident-locked-state");
          identBox.classList.add("ident-unlocked");
          identBox.classList.remove("ident-ui-active");
        }
        populateIdentification(user.id);
        if (identLockedView) identLockedView.style.display = "none";
        if (identDateInput) identDateInput.style.display = "none";
        if (identUnlockBtn) identUnlockBtn.style.display = "none";
      }, 2300);
    });
  }

  if (identClose) {
    identClose.addEventListener("click", () => {
      if (identContent) identContent.style.display = "none";
      if (identLoading) identLoading.style.display = "none";
      if (identLockedView) identLockedView.style.display = "none";
      if (identDateInput) {
        identDateInput.value = "";
        identDateInput.style.display = "";
      }
      if (identUnlockBtn) identUnlockBtn.style.display = "";
      if (identBox) {
        identBox.classList.remove("ident-unlocked");
        identBox.classList.add("ident-locked-state");
        identBox.classList.remove("ident-ui-active");
      }
    });
  }

  /* COLLAPSIBLE USER_SILHOUETTE */
  const collapsible = document.querySelector(".collapsible");
  const content = document.querySelector(".collapse-content");
  if (collapsible) {
    collapsible.addEventListener("click", () => {
      collapsible.classList.toggle("active");
      if (!content) return;
      content.style.display = content.style.display === "block" ? "none" : "block";
    });
  }
});

/* ============== Affinity content loader ============== */
function loadAffinityData(codeName) {
  const data = silhouetteData[codeName];
  if (!data) return;

  document.getElementById("kinship").textContent = data.kinship || "";
  document.getElementById("partnerName").textContent = data.partnerName || "";
  document.getElementById("anniversaryDate").textContent = data.anniversaryDate || "";
  document.getElementById("beenTogether").textContent = calcDurationSince(data.anniversaryDate || "");
}

/* ============== Identification content population ============== */
function populateIdentification(userId) {
  const dataRoot = window.silhouetteData || silhouetteData || {};
  const data = dataRoot[userId] && dataRoot[userId].identification ? dataRoot[userId].identification : null;
  if (!data) {
    document.getElementById("id_realName").textContent = "N/A";
    document.getElementById("id_givenName").textContent = "";
    document.getElementById("id_middleName").textContent = "";
    document.getElementById("id_middleInitial").textContent = "";
    document.getElementById("id_lastName").textContent = "";
    document.getElementById("id_birthdate").textContent = "";
    document.getElementById("id_age").textContent = "N/A";
    return;
  }

  const realName = data.realName || "";
  const given = data.givenName || "";
  const middle = data.middleName || "";
  const last = data.lastName || "";
  const birth = data.birthdate || "";

  document.getElementById("id_realName").textContent = realName;
  document.getElementById("id_givenName").textContent = given;
  document.getElementById("id_middleName").textContent = middle;
  document.getElementById("id_middleInitial").textContent = middle ? String(middle.trim().charAt(0)).toUpperCase() : "";
  document.getElementById("id_lastName").textContent = last;
  document.getElementById("id_birthdate").textContent = birth;
  document.getElementById("id_age").textContent = calcAge(birth);
}

/* ============== Utility helpers ============== */
function calcDurationSince(dateStr) {
  if (!dateStr) return "N/A";
  const start = new Date(dateStr + "T00:00:00");
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) { months--; days += 30; }
  if (months < 0) { years--; months += 12; }
  return `${years} yr ${months} mo ${days} d`;
}

function calcAge(birthdate) {
  if (!birthdate) return "N/A";
  const bd = new Date(String(birthdate).trim() + "T00:00:00");
  if (isNaN(bd.getTime())) return "N/A";
  const now = new Date();
  let age = now.getFullYear() - bd.getFullYear();
  const m = now.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
  return `${age} yr`;
}