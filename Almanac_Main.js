/* =========================================
  Almanac_Main.js
  - Handles Matrix animation, Login/Home flow,
    Hamburger, Clock, Info Popup, Portfolio overlay
  - Integrates with Almanac_Userinf.js terminals data
  - ✨ Added profilePic offline-first / online-fallback helpers
========================================= */

(() => {
  /* =========================================
     MATRIX BACKGROUND
   ========================================== */
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()".split("");
  const fontSize = 14;
  let columns = 0, drops = [];

  function resizeMatrix() {
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(0);
  }

  function drawMatrix() {
    if (!canvas || !ctx || drops.length === 0) return;
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  if (canvas && ctx) {
    resizeMatrix();
    window.addEventListener("resize", resizeMatrix);
    setInterval(drawMatrix, 50);
  }

  /* =========================================
     MEDIA FALLBACK HELPERS (new)
     - resolveMediaCandidates(path, userId, type)
     - applyImageFallback(imgEl, candidates)
   ========================================== */

  /**
   * Build local candidate paths and return an object:
   * {
   *   localCandidates: [ "Almanac_LocalStorage.Data/User_yexy/Quintessence/profile.jpg", "Subfolder/profile.jpg", ... ],
   *   online: "https://... (if provided)" 
   * }
   *
   * Rules:
   * - If path is empty -> return empty
   * - If path looks like a local path (contains 'Almanac_LocalStorage.Data' or starts with 'Subfolder' or contains '/Quintessence/') -> keep it as local candidate
   * - If path is a URL -> set online, also derive filename and create per-user local candidates:
   *     Almanac_LocalStorage.Data/User_<userId>/Quintessence/<filename>
   *     Almanac_LocalStorage.Data/User_<userId>/<filename>
   *     Subfolder/<filename>
   */
  function resolveMediaCandidates(path, userId, type = "Quintessence") {
    if (!path || typeof path !== "string" || path.trim() === "") return { localCandidates: [], online: "" };
    path = path.trim();

    const localCandidates = [];
    let online = "";

    // If user stored a local relative path directly, accept it first
    if (/Almanac_LocalStorage\.Data\/|^Subfolder\/|\/Quintessence\/|\/Video\/|\/Music\//i.test(path) && !/^https?:\/\//i.test(path)) {
      // Provide the exact user-provided local path as primary local candidate
      localCandidates.push(path);
      return { localCandidates, online: "" };
    }

    // If it's a URL, keep it as online and also derive filename
    if (/^https?:\/\//i.test(path) || /drive\.google\.com|dropbox\.com/i.test(path)) {
      online = path;

      // try to extract filename (strip query string)
      try {
        const url = new URL(path);
        let filename = (url.pathname || "").split("/").filter(Boolean).pop() || "";
        if (!filename) {
          // fallback to last part of full string without query
          const last = path.split("?")[0].split("/").pop();
          filename = last || "";
        }
        // ensure filename has extension
        if (filename && /\.[a-z0-9]{2,6}$/i.test(filename)) {
          if (userId) {
            // userId likely 'yexy' etc. create per-user candidates
            localCandidates.push(`Almanac_LocalStorage.Data/User_${userId}/${type}/${filename}`);
            localCandidates.push(`Almanac_LocalStorage.Data/User_${userId}/${filename}`);
          }
          // general fallback locations
          localCandidates.push(`Subfolder/${filename}`);
          localCandidates.push(`assets/${filename}`);
        }
      } catch (e) {
        // best-effort fallback
        const last = path.split("?")[0].split("/").pop() || "";
        if (last && /\.[a-z0-9]{2,6}$/i.test(last)) {
          if (userId) {
            localCandidates.push(`Almanac_LocalStorage.Data/User_${userId}/${type}/${last}`);
            localCandidates.push(`Almanac_LocalStorage.Data/User_${userId}/${last}`);
          }
          localCandidates.push(`Subfolder/${last}`);
          localCandidates.push(`assets/${last}`);
        }
      }

      return { localCandidates, online };
    }

    // If it's not a URL and not matching the special local patterns above, we assume it's a bare filename or relative path
    // e.g. "profile.jpg" or "profile.png" -> try per-user then general
    const filename = path.split("/").pop();
    if (filename && /\.[a-z0-9]{2,6}$/i.test(filename)) {
      if (userId) {
        localCandidates.push(`Almanac_LocalStorage.Data/User_${userId}/${type}/${filename}`);
        localCandidates.push(`Almanac_LocalStorage.Data/User_${userId}/${filename}`);
      }
      localCandidates.push(`Subfolder/${filename}`);
      localCandidates.push(`assets/${filename}`);
      return { localCandidates, online: "" };
    }

    // Fallback no candidates
    return { localCandidates: [], online: "" };
  }

  /**
   * applyImageFallback(imgEl, candidates)
   * - candidates: { localCandidates: [...], online: "..." }
   * Tries localCandidates in order; if each fails, finally tries online.
   */
  function applyImageFallback(imgEl, candidates) {
    if (!imgEl || !candidates) return;
    const locals = Array.isArray(candidates.localCandidates) ? candidates.localCandidates.slice() : [];
    const online = candidates.online || "";

    // helper to try next local candidate or fallback to online
    function tryNextLocal() {
      if (locals.length === 0) {
        if (online) {
          imgEl.onerror = null;
          imgEl.src = online;
          imgEl.dataset._attempt = "online";
          // final safety net
          imgEl.onerror = function () {
            imgEl.onerror = null;
            // optional: set a default placeholder image (uncomment and provide path if desired)
            // imgEl.src = "assets/default-profile.png";
            imgEl.removeAttribute("src");
          };
        } else {
          imgEl.onerror = null;
          imgEl.removeAttribute("src");
        }
        return;
      }

      const candidate = locals.shift();
      imgEl.src = candidate;
      imgEl.dataset._attempt = "local";
      imgEl.dataset._candidate = candidate;
      imgEl.onerror = function () {
        imgEl.onerror = null;
        // try the next candidate
        tryNextLocal();
      };
    }

    tryNextLocal();
  }

  /* =========================================
     CLOCK
   ========================================== */
  function startClock() {
    const dateDisplay = document.getElementById("dateTimeDisplay");
    const lineDisplay = document.getElementById("dateLine");
    if (!dateDisplay || !lineDisplay) return;

    function updateTime() {
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");
      const monthName = now.toLocaleString("en-US", { month: "long" });
      const weekday = now.toLocaleString("en-US", { weekday: "long" });

      dateDisplay.textContent = `${mm}-${dd}-${yyyy}   ${hh}:${min}`;
      lineDisplay.textContent = `${monthName} : ${weekday}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
  }
  
  /* ======= 🔹 ADD THIS helper before login() ========= */
  function showMessage(msg) {
    let box = document.getElementById("messageBox");
    if (!box) {
      box = document.createElement("div");
      box.id = "messageBox";
      box.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background: rgba(0,0,0,0.8);
        color: #ff3333;
        font-weight: bold;
        border: 1px solid red;
        border-radius: 5px;
        z-index: 9999;
        text-align: center;
      `;
      document.body.appendChild(box);
    }
    box.textContent = msg;
    box.style.display = "block";

    setTimeout(() => {
      box.style.display = "none";
    }, 3000);
  }
  
  /* =========================================
     LOGIN / LOGOUT
   ========================================== */
  function getLoggedUser() {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser") || "null");
    } catch {
      return null;
    }
  }

  function login() {
    const rawId = document.getElementById("identifier")?.value.trim() || "";
    const id = rawId.toLowerCase();
    const date = document.getElementById("dateInput")?.value || "";

    if (!id) return showMessage("Enter identifier");

    if (id === "admin_v12") {
      window.location.href = "./Admin_v12/Admin.html";
      return;
    }

    if (!date) return showMessage("Select a date");

    if (typeof users === "undefined") {
      showMessage("User data not ready. Try again.");
      return;
    }

    const ids = id.split(",").map((x) => x.trim());
    const candidate = users.find((u) =>
      getIdentifiers(u).some((val) => ids.includes(val))
    );

    if (!candidate) return showMessage("No user found");

    const dates = Array.isArray(candidate.codeDates) ? candidate.codeDates : [];
    if (dates.length > 0 && !dates.includes(date)) {
      return showMessage("Incorrect date for this identifier");
    }

    const userInfoData =
      window.userInfo && window.userInfo[candidate.id]
        ? window.userInfo[candidate.id]
        : {};

    const mergedUser = { ...candidate, ...userInfoData };

    localStorage.setItem("loggedInUser", JSON.stringify(mergedUser));

     // 🔄 Redirect to Entry page instead of Home
     window.location.href = "./Entry/Entry.html";
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    document.getElementById("homePage").style.display = "none";
    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("hamburger").style.display = "none";
  }

  /* =========================================
     HOME INITIALIZATION
   ========================================== */
  function showHome(user) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
    document.getElementById("hamburger").style.display = "inline-block";
    startClock();
    populateHome(user);
    setupPortfolioModal(user);
  }

  function populateHome(user) {
    const nameEl = document.getElementById("userName");
    const picEl = document.getElementById("profilePic");
    const profileEl = document.getElementById("profile");

    if (nameEl) nameEl.textContent = user.name;

    // ---- PROFILE PICTURE: offline-first then online fallback ----
    if (picEl) {
      // user.id expected to be like 'yexy', 'cherry', 'crinkles'
      const candidates = resolveMediaCandidates(user.profilePic || "", user.id || "");
      applyImageFallback(picEl, candidates);
      picEl.alt = `${user.name || "Profile"} picture`;
    }

    if (profileEl) {
      profileEl.innerHTML = `
        <div><strong>Name:</strong> ${user.name}</div>
        <div><strong>Codename(s):</strong> ${
          Array.isArray(user.codeName)
            ? user.codeName.join(", ")
            : user.codeName || "N/A"
        }</div>
        <div><strong>Email:</strong> ${user.email}</div>
        <div><strong>Birthdate:</strong> ${user.birthdate || "N/A"}</div>
      `;
    }
  }

  /* =========================================
     PORTFOLIO MODAL (overlay)
   ========================================== */
  function setupPortfolioModal(user) {
    const menuPortfolio = document.getElementById("menuPortfolio");
    if (!menuPortfolio) return;

    let modal = document.getElementById("portfolioModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "portfolioModal";
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 100;
        color: #0f0;
        text-align: center;
        padding: 20px;
      `;
      modal.innerHTML = `
        <button id="portfolioClose" style="
          position: absolute; top: 15px; right: 20px;
          color: #ff3333; font-size: 28px; background: none; border: none;
          cursor: pointer; text-shadow: 0 0 10px #ff3333;
        ">×</button>
        <h2 style="color:#ff3333; text-shadow:0 0 10px #ff3333;">PORTFOLIO</h2>
        <ul id="terminalList" class="terminal-list" style="list-style:none; padding:0; margin-top:20px;"></ul>
      `;
      document.body.appendChild(modal);
    }

    const closeBtn = modal.querySelector("#portfolioClose");
    const linksContainer = modal.querySelector("#terminalList"); // ✅ updated ID

    menuPortfolio.addEventListener("click", () => {
      if (!linksContainer) return;
      linksContainer.innerHTML = "";

      if (user.terminals && user.terminals.length > 0) {
        user.terminals.forEach((t) => {
          if (!t.title) return;
          const li = document.createElement("li");
          li.className = "terminal-item";
          li.innerHTML = `<a href="${t.link}" target="_blank" style="
            display:inline-block;
            margin:8px 0;
            color:#0f0;
            text-decoration:none;
            font-size:18px;
            font-weight:bold;
            text-shadow:0 0 8px #0f0;
            transition: all 0.2s ease-in-out;
          ">➤ ${t.title}</a>`;
          linksContainer.appendChild(li);
        });
      } else {
        linksContainer.innerHTML = "<p>No portfolio links available.</p>";
      }

      modal.style.display = "flex";
    });

    if (closeBtn)
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
  }

  /* =========================================
     HAMBURGER MENU
   ========================================== */
  function setupMenu() {
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menuDropdown");
    if (!hamburger || !menu) return;

    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle("open");
      hamburger.classList.toggle("active", isOpen);
    });

    window.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove("open");
        hamburger.classList.remove("active");
      }
    });

    document.querySelectorAll("[data-info]").forEach((el) => {
      el.addEventListener("click", () => showInfoPopup(el.dataset.info));
    });

    const logoutBtn = document.getElementById("menuLogout");
    if (logoutBtn) logoutBtn.addEventListener("click", () => logout());
  }

  /* =========================================
     INFO POPUP
   ========================================== */
  const infoData = {
    intro: `Welcome. This is your Almanac_Portfolio.`,
    privacy: `Feature not yet air, thanks for standing by.`,
    about: `Available - Negative`,
    help: `This Feature is not yet available or the Developer/ Creator Didn't put the function online, Please stay tuned!`,
    hotline:'Any inquiries about Almanac_Portfolio or privacy policy, and or protection. Kindly Go-To "Contact" To Reach Developer, IT, Creator.'
  };

  function showInfoPopup(type) {
    const popup = document.getElementById("infoPopup");
    const title = document.getElementById("infoTitle");
    const text = document.getElementById("infoText");
    if (!popup || !title || !text) return;
    title.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    text.textContent = infoData[type] || "";
    popup.style.display = "flex";
  }

  const infoCloseBtn = document.getElementById("infoClose");
  if (infoCloseBtn)
    infoCloseBtn.addEventListener("click", () => {
      const popup = document.getElementById("infoPopup");
      if (popup) popup.style.display = "none";
    });

  /* =========================================
     PAGE INIT
   ========================================== */
  document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.addEventListener("click", login);
    setupMenu();

    const user = getLoggedUser();
    if (user) {
      showHome(user);
    } else {
      if (document.getElementById("loginPage"))
        document.getElementById("loginPage").style.display = "flex";
      if (document.getElementById("homePage"))
        document.getElementById("homePage").style.display = "none";
      if (document.getElementById("hamburger"))
        document.getElementById("hamburger").style.display = "none";
    }

    // -------------------------------
    // NOTE: Updated card toggle handler
    // We now ignore clicks that start inside the camera gallery so image clicks
    // don't bubble up and collapse the camera card.
    // -------------------------------
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", (ev) => {
        // If click originated inside the camera gallery, ignore it.
        // This prevents the gallery from collapsing when user clicks images.
        const clickedInsideGallery = !!ev.target.closest("#cameraGallery");
        if (clickedInsideGallery) return;

        const content = card.querySelector(".card-content");
        if (!content) return;
        const open = content.style.display === "block";
        content.style.display = open ? "none" : "block";
      });
    });
  });
})();