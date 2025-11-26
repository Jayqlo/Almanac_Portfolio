(function () {
  const path = document.getElementById('ekgPath');
  const loadingText = document.getElementById('loadingText');
  const overlay = document.getElementById('overlay');

  // ===== CONFIG =====
  const timeSet = 5.5; // Seconds - animation duration
  const redirectURL = "../../index.html"; // 🔁 After animation, redirect here

  const spikePositions = [0.22, 0.35, 0.48, 0.63, 0.78, 0.92];
  const messages = [
    "Verifying User...",
    "Accessing Secure Data...",
    "Decrypting Systems...",
    "Loading Interface...",
    "Initializing Dashboard...",
    "Almost Ready..."
  ];

  // beep settings
  const beepFreq = 880;
  const beepDur = 0.8;
  const beepGain = 1.4;

  const len = Math.ceil(path.getTotalLength());
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  path.style.setProperty('--dashlen', len);

  let audioCtx = null;
  let masterGain = null;

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 2.3;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      return audioCtx.resume();
    }
    return Promise.resolve();
  }

  function scheduleBeep(atTimeSec, frequency = beepFreq, duration = beepDur, vol = beepGain) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const start = now + atTimeSec;
    const stop = start + duration;

    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;

    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, stop);

    osc.connect(g);
    g.connect(masterGain);

    osc.start(start);
    osc.stop(stop + 0.02);
  }

  function startSequence() {
    path.style.animation = `draw ${timeSet}s linear forwards`;

    spikePositions.forEach((pos, i) => {
      const relativeSec = pos * timeSet;

      scheduleBeep(relativeSec);

      setTimeout(() => {
        loadingText.style.opacity = 0;
        setTimeout(() => {
          loadingText.textContent = messages[i] || "";
          loadingText.style.opacity = 1;
        }, 250);
      }, relativeSec * 1000);
    });

    // 🔁 Redirect after animation completes
    setTimeout(() => {
      window.location.href = redirectURL;
    }, timeSet * 1500 + 2000);
  }

  async function handleStart() {
  try {
    await initAudioContext();
  } catch (err) {
    console.warn('AudioContext resume failed:', err);
  }

  overlay.style.display = 'none'; // remove overlay instantly
  startSequence(); // ⏩ now runs after 1s delay (from load event)
}

/*
  overlay.addEventListener('click', handleStart, { once: true });
  overlay.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      handleStart(ev);
    }
  });

  overlay.tabIndex = 0;
  overlay.focus();
})();
*/

window.addEventListener('load', () => {
  setTimeout(handleStart, 1100); // ⏳ wait 1 second, then start animation
});
})()