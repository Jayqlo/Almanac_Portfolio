// Qr_Main.js
document.addEventListener("DOMContentLoaded", () => {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userData = urlParams.get("user");
    const platform = urlParams.get("platform");

    if (!userData || !platform) {
        alert("Missing user or platform data.");
        window.history.back();
        return;
    }

    // Decode user object
    let user;
    try {
        user = JSON.parse(decodeURIComponent(userData));
    } catch (e) {
        console.error(e);
        alert("Invalid user data.");
        window.history.back();
        return;
    }

    // Determine link for the platform
    const platformMap = {
        facebook: user.social?.facebook,
        messenger: user.social?.messenger,
        instagram: user.social?.instagram,
        tiktok: user.social?.tiktok,
        tiktok_business: user.social?.tiktok_business,
        twitter: user.social?.twitter,
        viber: user.conference?.viber,
        zoom: user.conference?.zoom,
        teams: user.conference?.teams,
        whatsapp: user.conference?.whatsapp,
        telegram: user.conference?.telegram,
        google_meet: user.conference?.google_meet
    };

    const link = platformMap[platform];

    // Elements
    const platformNameEl = document.getElementById("platform-name");
    const linkDisplayEl = document.getElementById("link-display");
    const qrCanvas = document.getElementById("qr-code");
    const copyBtn = document.getElementById("copy-btn");
    const openBtn = document.getElementById("open-btn");
    const backBtn = document.getElementById("back-btn");

    // Set platform name
    platformNameEl.textContent = platform.charAt(0).toUpperCase() + platform.slice(1).replace("_", " ");

    if (link && link.trim() !== "") {
        // Valid link: generate QR and enable buttons
        linkDisplayEl.textContent = link;

        QRCode.toCanvas(qrCanvas, link.startsWith("http") ? link : `https://${link}`, { width: 250 }, function (error) {
            if (error) console.error(error);
        });

        copyBtn.disabled = false;
        openBtn.disabled = false;

        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(link).then(() => {
                alert("Link copied to clipboard!");
            }).catch(err => {
                console.error("Failed to copy: ", err);
            });
        });

        openBtn.addEventListener("click", () => {
            window.open(link.startsWith("http") ? link : `https://${link}`, "_blank");
        });
    } else {
        // No link: show N/A, hide QR, disable buttons
        linkDisplayEl.textContent = "N/A";
        qrCanvas.style.display = "none";
        copyBtn.disabled = true;
        openBtn.disabled = true;
    }

    // Back button
    backBtn.addEventListener("click", () => {
        window.history.back();
    });
});
