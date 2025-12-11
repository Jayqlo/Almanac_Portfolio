/* =========================================
   Almanac_Data.js
   - Contains user-specific media (photos, videos, music)
   - Works with identifiers from Almanac_Core.js
   - Updated modular version (multi-user ready)
========================================= */

(() => {
    // ---------------------------
  // Helper: Media path resolver
  // ---------------------------
  // Returns { local: "...", online: "..." }
  function resolveMediaCandidates(item) {
    if (!item || typeof item !== "string" || item.trim() === "") {
      return { local: "", online: "" };
    }

    item = item.trim();

    // If the provided value is already a local filename (no http)
    if (!/^https?:\/\//i.test(item)) {
      return {
        local: `Subfolder/${item}`,
        online: "" // no online fallback provided
      };
    }

    // If it's an http(s) link — try to derive a filename for local fallback
    try {
      // Remove query string then get last path segment
      const url = new URL(item);
      let pathname = url.pathname || "";
      const lastSegment = pathname.split("/").filter(Boolean).pop() || "";
      // If lastSegment looks like a filename with extension use it; otherwise keep empty
      const filename = /\.[a-z0-9]{2,6}$/i.test(lastSegment) ? lastSegment : "";
      return {
        local: filename ? `Subfolder/${filename}` : "", // local candidate (may or may not exist)
        online: item
      };
    } catch (e) {
      // fallback simple split (in case URL() fails)
      const withoutQS = item.split("?")[0];
      const last = withoutQS.split("/").pop() || "";
      const filename = /\.[a-z0-9]{2,6}$/i.test(last) ? last : "";
      return {
        local: filename ? `Subfolder/${filename}` : "",
        online: item
      };
    }
  }

  // Apply fallback behavior to an <img> element:
  // try local first (if provided), then online (if provided).
  function applyImageFallback(imgEl, candidates) {
    if (!imgEl) return;
    const { local, online } = candidates;

    // Helper to set src safely with a single-onerror swap
    function tryLocalThenOnline() {
      if (local) {
        imgEl.src = local;
        imgEl.dataset._attempt = "local";
        imgEl.onerror = function () {
          // local failed -> try online if available
          imgEl.onerror = null;
          if (online) {
            imgEl.src = online;
            imgEl.dataset._attempt = "online";
            // if online fails too, clear src to avoid broken icon
            imgEl.onerror = function () {
              imgEl.onerror = null;
              imgEl.removeAttribute("src");
            };
          } else {
            imgEl.removeAttribute("src");
          }
        };
      } else if (online) {
        // no local candidate, just load online
        imgEl.src = online;
        imgEl.dataset._attempt = "online";
        imgEl.onerror = function () {
          imgEl.onerror = null;
          imgEl.removeAttribute("src");
        };
      } else {
        // nothing available
        imgEl.removeAttribute("src");
      }
    }

    tryLocalThenOnline();
  }

  // Apply fallback behavior to <video> element (src attr)
  function applyVideoFallback(videoEl, candidates) {
    if (!videoEl) return;
    const { local, online } = candidates;

    // Try local first, then online. Use error event.
    function tryLocalThenOnline() {
      if (local) {
        videoEl.src = local;
        videoEl.dataset._attempt = "local";
        // Some browsers fire 'error' on <video> when source cannot be loaded
        videoEl.onerror = function () {
          videoEl.onerror = null;
          if (online) {
            videoEl.src = online;
            videoEl.dataset._attempt = "online";
            videoEl.onerror = function () {
              videoEl.onerror = null;
              videoEl.removeAttribute("src");
            };
          } else {
            videoEl.removeAttribute("src");
          }
        };
      } else if (online) {
        videoEl.src = online;
        videoEl.dataset._attempt = "online";
        videoEl.onerror = function () {
          videoEl.onerror = null;
          videoEl.removeAttribute("src");
        };
      } else {
        videoEl.removeAttribute("src");
      }
    }

    tryLocalThenOnline();
  }

  // Apply fallback behavior to <audio> element
  function applyAudioFallback(audioEl, candidates) {
    if (!audioEl) return;
    const { local, online } = candidates;

    function tryLocalThenOnline() {
      if (local) {
        audioEl.src = local;
        audioEl.dataset._attempt = "local";
        audioEl.onerror = function () {
          audioEl.onerror = null;
          if (online) {
            audioEl.src = online;
            audioEl.dataset._attempt = "online";
            audioEl.onerror = function () {
              audioEl.onerror = null;
              audioEl.removeAttribute("src");
            };
          } else {
            audioEl.removeAttribute("src");
          }
        };
      } else if (online) {
        audioEl.src = online;
        audioEl.dataset._attempt = "online";
        audioEl.onerror = function () {
          audioEl.onerror = null;
          audioEl.removeAttribute("src");
        };
      } else {
        audioEl.removeAttribute("src");
      }
    }

    tryLocalThenOnline();
  }
  // Global userMedia object — system reads from here
  window.userMedia = {
    xy: {
      quintessenceImages: [
        "https://lh3.googleusercontent.com/d/1UJaZrogtxzFi84AJeDt7PEBHtdKg4OMP",
        "https://lh3.googleusercontent.com/d/16ObYjx9HPxlWCvr1nYg0WpUkucrG_MAW",
        "https://www.dropbox.com/scl/fi/fvir1hdf2ugrhg1clu587/1760106817956.jpg?rlkey=sj8l3x06ygqo5w8u6dv1rd9bd&st=jw115osn&raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1",
        "https://www.dropbox.com/scl/fi/hco02csqdljnaamidwb16/IMG_1582.jpeg?raw=1"
      ],
      videos: [
        "https://www.dropbox.com/scl/fi/8avr5k32vpgqkvn2dxcaq/Screen_Recording_20251010_211439.mp4?rlkey=gfss7pc379l24p3sc4gthz3t7&st=l6xl27f1&raw=1",
        "https://www.dropbox.com/scl/fi/fqiqj95xfex2s4zx455y6/1720797979872.mp4?rlkey=20ye5fvk8wczpcjvjdtf2qpa7&st=b3dqodqf&raw=1",
        "https://drive.google.com/file/d/1vOCnyZgmw6MVQdS0rbmw12VHxK8q9R3a/preview",
        "https://drive.google.com/file/d/1AQYOcAYUCGjH--wow-70xO-nwAh11rsk/preview",
        "https://www.dropbox.com/scl/fi/8avr5k32vpgqkvn2dxcaq/Screen_Recording_20251010_211439.mp4?raw=1",
        "https://www.dropbox.com/scl/fi/8avr5k32vpgqkvn2dxcaq/Screen_Recording_20251010_211439.mp4?raw=1",
        "https://www.dropbox.com/scl/fi/8avr5k32vpgqkvn2dxcaq/Screen_Recording_20251010_211439.mp4?raw=1",
        "https://www.dropbox.com/scl/fi/8avr5k32vpgqkvn2dxcaq/Screen_Recording_20251010_211439.mp4?raw=1"
      ],
      musicTracks: [
        {
          title: "Track 1",
          src: "your_link_1.mp3"
        },
        { title: "Track 2", src: "your_link_2.mp3" },
        { title: "Track 3", src: "your_link_3.mp3" },
        { title: "Track 4", src: "your_link_4.mp3" },
        { title: "Track 5", src: "your_link_5.mp3" }
      ]
    },

    by: {
      quintessenceImages: [
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/1718033495096.jpg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/IMG_20241113_085411_617.jpg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/Screenshot_20251119-105542.jpg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/received_666697109012255.jpeg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/IMG_20250213_201703_244.jpg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/IMG_20250213_201709_317.jpg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/received_862444682040420.jpeg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/received_1747114119130566.jpeg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/IMG_20241123_095901_891.jpg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/IMG_20251116_153025_259.jpg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/IMG_20251112_180530_217.jpg",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Quintessence/IMG_20251112_180526_184.jpg"
      ],
      videos: [
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Video/VID_20250220_100939_230.mp4",
        "https://pub-f1cc6487bcfe4794acddbdc0eff6668e.r2.dev/User_FranzFries/Video/lv_0_20250309001300.mp4",
        "Almanac_LocalStorage.Data/User_FranzFries/Video/VID_20250220_100939_230.mp4",
        "https://www.dropbox.com/scl/fi/wog49x9y61k5293latn1j/VID_20250902_213411.mp4?rlkey=681xvdy14frcpay5bo4009vqp&st=f0m4dalu&raw=1",
        "https://www.dropbox.com/scl/fi/tv4dtiovqpohjo23t97ig/VID_20240620_172103.mp4?rlkey=b4fkdxqax7ghl32o16lqb5ik4&st=irhdfrgs&raw=1",
        "https://www.dropbox.com/scl/fi/3s5cnxsyeco51pajqdszz/VID_20240630_213108.mp4?rlkey=g48klfpmz9qeemg80w2wmzh69&st=gefki1jt&raw=1",
        "https://www.dropbox.com/scl/fi/rteylq18ramb8j5p1hir0/VID_20250531_054418.mp4?rlkey=emzlwh6dq34l6za9ewzov5o5z&st=0bwa1or9&raw=1",
        "https://www.dropbox.com/scl/fi/ldqbud5jrfc9n4a3n9wps/VID_20250829_223229.mp4?rlkey=sg36h8hza4ne6a0mm30ulo4be&st=uqlbzhyr&raw=1"
      ],
      musicTracks: [
        {
          title: "Miley Cyrus - Adore You (Official Video)",
          src: "Almanac_LocalStorage.Data/User_FranzFries/Music/Miley_Cyrus_-_Adore_You_(Official_Video).mp3"
        },
        { title: "Gayuma - NOBITA & Yeng Constantino(Official Music Video)", src: "Almanac_LocalStorage.Data/User_FranzFries/Music/Gayuma_-_NOBITA_&amp;_Yeng_Constantino(Official_Music_Video).mp3" },
        { title: "A1 - Heaven By Your Side",src: "Almanac_LocalStorage.Data/User_FranzFries/Music/A1_-_Heaven_By_Your_Side_(Audio).mp3" },
        { title: "", src: "" },
        { title: "", src: "" },
      ]
    },
    
     crinkles: {
      quintessenceImages: [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      videos: [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      musicTracks: [
        { title: "Track 1", src: "your_link_2.mp3" },
        { title: "Track 2", src: "your_link_2.mp3" },
        { title: "Track 3", src: "your_link_3.mp3" },
        { title: "Track 4", src: "your_link_4.mp3" },
        { title: "Track 5", src: "your_link_5.mp3" }
      ]
     },
  };

  // When DOM loads, apply media for the logged-in user
  document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!user || !user.id || !window.userMedia[user.id]) return;

    const { quintessenceImages, videos, musicTracks } = window.userMedia[user.id];
    renderCameraRolls(quintessenceImages, videos);
    renderMusic(musicTracks);
  });

  /* ===============================
      CAMERA ROLLS
  =============================== */
  function resolveMediaPath(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.includes("dropbox.com") || path.includes("drive.google.com")) {
    return path; // online links as-is
  }
  return path.startsWith("/") ? path : `/${path}`; // convert to valid local path
}

  function renderCameraRolls(quintessenceImages, videos) {
    const gallery = document.getElementById("cameraGallery");
    if (!gallery) return;

    gallery.innerHTML = `
      <div class="subsection">
        <h3 class="sub-label">Quintessence:</h3>
        <div class="image-gallery-grid">
          ${quintessenceImages
            .map(
              (link, i) => `
            <div class="image-wrapper">
              <span class="counter">(${i + 1})</span>
              <img src="${resolveMediaPath(link)}" alt="Memory ${i + 1}" class="gallery-img" />
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="subsection">
        <h3 class="sub-label">Video:</h3>
        <div class="video-gallery-grid">
          ${videos
            .map((v, i) => {
              if (v.includes("drive.google.com/file")) {
                return `
                <div class="video-wrapper">
                  <span class="counter">(${i + 1})</span>
                  <iframe src="${v}" allow="autoplay" class="gallery-video" loading="lazy"></iframe>
                </div>`;
              } else {
                return `
                <div class="video-wrapper">
                  <span class="counter">(${i + 1})</span>
                  <video src="${resolveMediaPath(v)}" controls class="gallery-video"></video>
                </div>`;
              }
            })
            .join("")}
        </div>
      </div>

      <div class="note-text">
        Once click full view, you can view the entire camera Rolls and music.
      </div>
    `;
  }

  /* ===============================
      MUSIC SECTION
  =============================== */
  function renderMusic(musicTracks) {
    const musicContainer = document.getElementById("music");
    if (!musicContainer) return;

    musicContainer.innerHTML = `
      <div class="music-list">
        ${musicTracks
          .map(
            (t, i) => `
          <div class="music-item">
            <div class="music-track">(${i + 1}) ${t.title}</div>
            <audio controls preload="none" src="${resolveMediaPath(t.src)}"></audio>
          </div>`
          )
          .join("")}
        <div class="note-text">
          Once click full view, you can view the entire camera Rolls and music.
        </div>
      </div>
    `;
  }

  /* ===============================
      STYLE SUPPORT
  =============================== */
  const rollsStyle = document.createElement("style");
  rollsStyle.textContent = `
    .sub-label {
      color: #0f0;
      text-align: left;
      font-size: 16px;
      margin: 10px 0 5px 10px;
      text-shadow: 0 0 6px #0f0;
    }

    .image-gallery-grid,
    .video-gallery-grid {
      display: grid;
      gap: 10px;
      justify-content: center;
    }

    .image-gallery-grid {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      margin-bottom: 20px;
    }

    .video-gallery-grid {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      margin-bottom: 20px;
    }

    .gallery-img,
    .gallery-video,
    iframe.gallery-video {
      width: 100%;
      border-radius: 8px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .gallery-img:hover,
    .gallery-video:hover,
    iframe.gallery-video:hover {
      transform: scale(1.05);
      box-shadow: 0 0 12px #ff3333;
    }

    .note-text {
      color: #bfffbf;
      font-size: 13px;
      text-align: center;
      margin-top: 15px;
      text-shadow: 0 0 4px #0f0;
    }

    .music-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      margin-top: 20px;
    }

    .music-item {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #0f0;
      border-radius: 8px;
      padding: 10px;
      width: 90%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 0 12px rgba(0,255,0,0.2);
    }

    .music-track {
      color: #bfffbf;
      margin-bottom: 5px;
      font-size: 14px;
    }

    .counter {
      display: block;
      color: #ff3333;
      font-size: 12px;
      margin-bottom: 4px;
      text-align: center;
    }

    audio {
      width: 100%;
    }


    @media (max-width: 640px) {
      .image-gallery-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }

      .video-gallery-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
  `;
  document.head.appendChild(rollsStyle);

  /* ===============================
     🆕 IMAGE VIEWER INTEGRATION
     - Added so clicking images opens full-view without collapsing camera card
     - Adds prev/next, counter, minimize, ESC, keyboard arrows, swipe
     - Uses event-capture to stop <details>/<summary> toggles
  =============================== */
  (function setupImageViewer() {
    const viewerRoot = document.getElementById("imageViewer");
    const overlay = document.getElementById("imageViewerOverlay");
    const viewerImg = document.getElementById("viewerImage");
    const btnClose = document.getElementById("viewerCloseBtn");
    const btnPrev = document.getElementById("viewerPrev");
    const btnNext = document.getElementById("viewerNext");
    const counter = document.getElementById("viewerCounter");
    const galleryRoot = document.getElementById("cameraGallery");

    if (!viewerRoot || !viewerImg || !btnClose || !btnPrev || !btnNext || !counter || !galleryRoot) {
      // viewer HTML not found — fail silently but expose API
      window.AlmanacImageViewer = { refresh: () => {} };
      return;
    }

    let imgs = [];
    let current = 0;
    let zoomScale = 1;

    function refreshImages() {
      // Collect gallery images (filter out empty srcs)
      imgs = Array.from(galleryRoot.querySelectorAll(".gallery-img"))
        .filter(i => i && i.src && i.src.trim() !== "");
    }

    function openAt(index) {
      if (!imgs || imgs.length === 0) return;
      current = ((index % imgs.length) + imgs.length) % imgs.length;
      viewerImg.src = imgs[current].src;
      counter.textContent = `${current + 1} / ${imgs.length}`;
      viewerRoot.style.display = "flex";
      zoomScale = 1;
      viewerImg.style.transform = "translate(0,0) scale(1)";
      // lock page scroll
      document.documentElement.style.overflow = "hidden";
      btnClose.focus();
    }

    function closeViewer() {
      viewerRoot.style.display = "none";
      viewerImg.src = "";
      document.documentElement.style.overflow = "";
    }

    function next() {
      if (!imgs.length) return;
      current = (current + 1) % imgs.length;
      openAt(current);
    }

    function prev() {
      if (!imgs.length) return;
      current = (current - 1 + imgs.length) % imgs.length;
      openAt(current);
    }

    // Stop <details>/<summary> from toggling: capture phase prevents toggles
    galleryRoot.addEventListener("click", (ev) => {
      const img = ev.target.closest("img.gallery-img");
      if (!img) return;
      // prevent default summary toggle and stop bubbling
      ev.preventDefault();
      ev.stopPropagation();

      refreshImages();
      const idx = imgs.findIndex(i => i.src === img.src);
      if (idx >= 0) openAt(idx);
      else openAt(0);
    }, true); // << capture phase important

    // Also prevent keyboard Enter causing toggle while focusing thumbnails
    galleryRoot.addEventListener("keydown", (ev) => {
      const img = ev.target.closest("img.gallery-img");
      if (!img) return;
      if (ev.key === "Enter") {
        ev.preventDefault();
        ev.stopPropagation();
        refreshImages();
        const idx = imgs.findIndex(i => i.src === img.src);
        if (idx >= 0) openAt(idx);
      }
    }, true);

    // Viewer controls
    btnClose.addEventListener("click", (e) => { e.stopPropagation(); closeViewer(); });
    btnNext.addEventListener("click", (e) => { e.stopPropagation(); next(); });
    btnPrev.addEventListener("click", (e) => { e.stopPropagation(); prev(); });

    // Keyboard navigation when viewer open
    document.addEventListener("keydown", (e) => {
      if (viewerRoot.style.display !== "flex") return;
      if (e.key === "Escape") { e.preventDefault(); closeViewer(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    });

    // Prevent clicks inside viewer from collapsing anything
    viewerRoot.addEventListener("click", (ev) => {
      ev.stopPropagation();
    });

    // Swipe detection for mobile
    let touchStartX = 0;
    viewerRoot.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartX = e.touches[0].clientX;
    }, {passive:true});
    viewerRoot.addEventListener("touchend", (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - touchStartX;
      if (diff > 60) { prev(); }
      else if (diff < -60) { next(); }
    });

    // Double tap / double click to toggle simple zoom (desktop + mobile)
    let lastTap = 0;
    viewerImg.addEventListener("dblclick", (e) => {
      // toggle zoom
      zoomScale = zoomScale === 1 ? 2 : 1;
      viewerImg.style.transform = `translate(0,0) scale(${zoomScale})`;
    });

    // Mouse wheel zoom (desktop)
    viewerImg.addEventListener("wheel", (e) => {
      if (viewerRoot.style.display !== "flex") return;
      e.preventDefault();
      const delta = -e.deltaY;
      if (delta > 0) zoomScale = Math.min(3, zoomScale + 0.1);
      else zoomScale = Math.max(1, zoomScale - 0.1);
      viewerImg.style.transform = `translate(0,0) scale(${zoomScale})`;
    }, {passive:false});

    // Expose helper API
    window.AlmanacImageViewer = {
      refresh: refreshImages,
      openIndex: (i) => { refreshImages(); openAt(i); },
      openBySrc: (src) => { refreshImages(); const i = imgs.findIndex(x => x.src === src); if (i>=0) openAt(i); }
    };

    // initial collect (if images already rendered)
    refreshImages();
  })();

})();