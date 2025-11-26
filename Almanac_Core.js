/* =========================================
   Almanac_Core.js — Core logic & user handling
   Retains multiple codeNames & codeDates per user
   Modular with Almanac_Userinf.js and Almanac_Data.js
========================================= */

/* ================================
   USER IDENTIFIER DATABASE
================================== */
const users = [
  {
    id: "xy",
    codeName: "liquidator",
    codeNames: ["xyx", "grif"],
    codeDates: ["2004-02-20", "2023-11-12"]
  },
  {
    id: "by",
    codeName: "FranzFries",
    codeNames: ["franz", "fries"],
    codeDates: ["1999-03-08", "2023-11-12"]
  },
  // 🧱 TEMPLATE USER - copy to add new
  {
    id: "",
    codeName: "",
    codeNames: ["", ""],
    codeDates: ["", ""]
  },

  {
    id: "crinkles",
    codeName: "Crinkles",
    codeNames: ["Crinkles", "Liatot"],
    codeDates: ["2023-04-20", "2023-11-12"]
  },
  {
    id: "user1",
    codeName: "User1",
    codeNames: ["user1", "user01"],
    codeDates: ["2000-01-01", "2000-12-12"]
  }
];

/* ================================
   IDENTIFIER HELPERS
================================== */
function getIdentifiers(u) {
  if (!u) return [];
  const ids = new Set();
  ["codeName", "id"].forEach((k) => {
    if (u[k]) ids.add(String(u[k]).toLowerCase());
  });
  if (Array.isArray(u.codeNames))
    u.codeNames.forEach((c) => ids.add(String(c).toLowerCase()));
  return Array.from(ids);
}

/* ================================
   LOGIN LOGIC
================================== */
function getLoggedUserObj() {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser") || "null");
  } catch {
    return null;
  }
}

/**
 * Validates login credentials (identifier + date)
 * @param {string} identifier
 * @param {string} date
 * @returns {object|null} user object or null
 */
function validateLogin(identifier, date) {
  const id = identifier.trim().toLowerCase();
  if (!id) return null;

  // Check all users
  for (const u of users) {
    const ids = getIdentifiers(u);
    if (ids.includes(id)) {
      // Found matching identifier
      if (!u.codeDates || u.codeDates.length === 0) return u;
      if (u.codeDates.includes(date)) return u;
    }
  }
  return null;
}

/* ================================
   READY EVENT
================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Almanac Core Initialized ✓");

  // Ensure localStorage data integrity
  const logged = getLoggedUserObj();
  if (logged && !logged.id) {
    localStorage.removeItem("loggedInUser");
  }
});
