// Silhouette_Core.js — Holds per-user affinity passcodes

const affinityKeys = {
  xy: "0220",
  by: "0308",
  crinkles: "0420"
};

// Helper to get currently logged-in user (from Almanac)
function getActiveUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser") || "null");
  } catch {
    return null;
  }
}