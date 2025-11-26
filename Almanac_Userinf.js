/* =========================================
   Almanac_Userinf.js
   - Contains personal information per user
   - Works with identifiers from Almanac_Core.js
   - Uses "userInfo" global for easy access
========================================= */

(() => {
  // Global userInfo object — system reads from here
  window.userInfo = {
    
    xy: {
      name: "Yexy Griffin",
      email: "undefined",
      birthdate: "null",
      profilePic:
        "",
      terminals: [
        { title: "", link: "" },
        { title: "", link: "" },
        { title: "", link: "" }
      ]
    },

    by: {
      name: "Karren Franz",
      email: "undefined",
      birthdate: "null",
      profilePic:
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Profile_Picture/IMG_20250402_204912_712.jpg",
      terminals: [
        { title: "Spotify", link: "https://open.spotify.com/playlist/2XrBlGt7CWCsy6Ox1jfn9N?si=_2Cv4hIcSMqasPGUxkD17A&pi=r5sDk5jeQpSxZ" },
        { title: "11.12_Scroll Letter", link: "https://jayqlo.github.io/11.12_Scroll-Letter/" },
        { title: "10.12 Letter", link: "https://jayqlo.github.io/MMXXV_12_10/" },
        { title: "8-12", link: "https://jayqlo.github.io/8.12/" },
        { title: "CherrySwing", link: "https://jayqlo.github.io/CherrySwing_By/"},
        { title: "", link: "" },
        { title: "", link: "" }
      ]
    },

    crinkles: {
      name: "Lian Franz",
      email: "undefined",
      birthdate: "null",
      profilePic:
        "https://www.dropbox.com/scl/fi/na2bwhnu80v8tr7spo1vk/IMG_20250601_160746_266.jpg?rlkey=h8sqa05ru33e54s7jgn9webi0&st=cap9zdb3&raw=1",
      terminals: [
        { title: "", link: "" },
        { title: "", link: "" },
        { title: "", link: "" }
      ]
    },

    // TEMPLATE — for adding new users
    templateUser: {
      name: "",
      email: "",
      birthdate: "",
      profilePic: "",
      terminals: [
        { title: "", link: "" },
        { title: "", link: "" },
        { title: "", link: "" }
      ]
    }
  };
})();