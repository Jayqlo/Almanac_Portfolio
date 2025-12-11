// Classified_UserInfo.js
// Editable "database" of users
const USERS = {
  li: {
    id: "",
    name: "",
    codename: "crinkles",
    email: "",
    contact: {
      phone: "+63-00000-0000",
      landline: "03-3456789",
      email: "user3@example.com"
    },
    social: {
      facebook: "facebook.com/user3",
      messenger: "m.me/user3",
      instagram: "@user3",
      tiktok: "@user3_tiktok",
      tiktok_business: "@user3_tiktokbiz",
      twitter: "@user3_twitter"
    },
    conference: {
      viber: "viber://chat?number=03456789101",
      zoom: "zoom.us/c/123456789",
      teams: "teams.microsoft.com/l/meetup-join/abc",
      whatsapp: "wa.me/09123456789",
      telegram: "t.me/user3",
      google_meet: "meet.google.com/abc-defg-hij"
    }
  },
  
  xy: {
    id: "",
    name: "",
    codename: "Liquidator",
    email: "",
    contact: {
      phone: "",
      landline: "02-2345678",
      email: "user2@gmail.com"
    },
    social: {
      facebook: "",
      messenger: "",
      instagram: "",
      tiktok: "",
      tiktok_business: "",
      twitter: ""
    },
    conference: {
      viber: "",
      zoom: "",
      teams: "",
      whatsapp: "",
      telegram: "",
      google_meet: ""
    }
  },
  
  by: {
    id: "",
    name: "",
    codename: "FranzFries",
    email: "",
    contact: {
      phone: "+63-936-738-7316",
      landline: "",
      email: ""
    },
    social: {
      facebook: "m.facebook.com/karrenfranzromero/",
      messenger: "m.me/karrenfranzromero/",
      instagram: "www.instagram.com/karrenfranzromero", 
      tiktok: "www.tiktok.com/@karren_l_v", 
      tiktok_business: "https://vt.tiktok.com/ZSfGNVyya/?page=TikTokShop", 
      twitter: ""
    },
    conference: {
      viber: "",
      zoom: "",
      teams: "",
      whatsapp: "",
      telegram: "",
      google_meet: "meet.google.com/mcjwctwqyv"
    }
  }
};

// Get user object by key
function getUserInfo(userKey) {
  if (!userKey) return null;
  return USERS[userKey] || null;
}

// Set active user (stores full user object)
function setActiveUser(userKey) {
  const user = getUserInfo(userKey);
  if (!user) return false;
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("loggedInUserKey", userKey);
  return true;
}

// Logout
/*
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInUserKey");
}
*/