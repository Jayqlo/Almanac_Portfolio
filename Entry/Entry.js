// Prevent access if user isn't logged in
const loggedUser = localStorage.getItem("loggedInUser");
if (!loggedUser) {
    window.location.href = "../../index.html";  // send back to login
}

const messages = [  
    " ! Upcoming Update; New Features : Classified and Qr will be added and live on or before Dec 11th, 2025.", 
    "Welcome! These reminders are important before accessing the website.",
    "Hi My Dearest User-Guests. I would like to give you a heads-up information about this Website. If you may encounter your profile picture, quintessence-photo, videos, and music are not visible or live. It's for the reason the system are updating. And it's totally normal.",
    "This may take 6-12 hours depending. Typically, approximately 240-360 minutes are required for photo and music. And Video could take 12 hours maximum to integrate.",
    "Yet The Portfolio are still online. Such as Spotify, Letter, Messages, Mini-games, And Space are accessable. Expressing Gratitude for your patience...",
    "Again, Thank you and have a nice check-in!",
    "Final reminder — click Continue if you understand and agree."
];

let currentIndex = 0;

const messageText = document.getElementById('messageText');
const progressTracker = document.getElementById('progressTracker'); // 👈 NEW
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// 📝 Show current message + progress
function renderMessage() {
    messageText.style.opacity = 0; // 🔹 Animation: start fade out

    setTimeout(() => { // 🔹 Delay for smooth fade-in
        messageText.textContent = messages[currentIndex];
        messageText.style.opacity = 1;

        // 🔢 Update progress text
        progressTracker.textContent = `Message ${currentIndex + 1} of ${messages.length}`;

        // 🔘 Update buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.textContent = currentIndex === messages.length - 1 ? "Continue" : "Next";
    }, 200);
}

// 👉 Next Button Click
nextBtn.addEventListener('click', () => {
    if (currentIndex < messages.length - 1) {
        currentIndex++;
        renderMessage();
    } else {
     window.location.href = "../Loading_Animation/Login/Login.html";
    } 
 });

// 👈 Previous Button Click
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        renderMessage();
    }
})

renderMessage(); // Initial

/* ✨ Background Particle Animation */
const canvas = document.getElementById('bgParticles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
        ctx.fillStyle = "#ff7f11";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animate);
}

animate();

// 🔹 Adjust canvas size when resizing window
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});