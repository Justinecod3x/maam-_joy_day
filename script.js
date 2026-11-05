
 // =====================================
 // GET HTML ELEMENTS
 // =====================================

const openGift = document.getElementById("openGift");
const gift = document.getElementById("gift");

const welcome = document.getElementById("welcome");
const birthday = document.getElementById("birthday");

const replay = document.getElementById("replay");

const musicButton = document.getElementById("musicButton");

const balloons = document.getElementById("balloons");
const confettiContainer = document.getElementById("confetti-container");


// =====================================
// AUTOMATIC BIRTHDAY MUSIC
// =====================================

let audioContext = null;
let musicPlaying = false;
let musicTimer = null;
let noteIndex = 0;

// A cheerful original birthday melody
const birthdayNotes = [
    523.25, 523.25, 587.33, 523.25,
    698.46, 659.25, 523.25, 523.25,
    587.33, 523.25, 783.99, 698.46,
    523.25, 523.25, 1046.50, 880.00,
    698.46, 659.25, 587.33, 932.33,
    932.33, 880.00, 698.46, 783.99,
    698.46
];

// Update music button
function updateMusicButton() {

    musicButton.textContent = musicPlaying
        ? "🎵 Music On"
        : "🎵 Music Off";

}

// Play one musical note
function playNote(frequency) {

    if (!audioContext || !musicPlaying) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.12,
        audioContext.currentTime + 0.04
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.30
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.32);

}

// Play the next note
function playNextNote() {

    if (!musicPlaying) return;

    const frequency =
        birthdayNotes[noteIndex % birthdayNotes.length];

    playNote(frequency);

    noteIndex++;

}

// Start birthday music
async function playBirthdayMusic() {

    try {

        if (!audioContext) {

            const AudioContext =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContext) {
                throw new Error("Your browser does not support Web Audio.");
            }

            audioContext = new AudioContext();

        }

        await audioContext.resume();

        if (musicPlaying) return;

        musicPlaying = true;
        noteIndex = 0;

        playNextNote();

        musicTimer = setInterval(function () {

            playNextNote();

        }, 350);

        updateMusicButton();

        console.log("Birthday celebration music started!");

    } catch (error) {

        console.error("Music playback error:", error);

        musicButton.textContent = "⚠️ Music unavailable";

    }

}

// Stop birthday music
function pauseBirthdayMusic() {

    musicPlaying = false;

    clearInterval(musicTimer);
    musicTimer = null;

    updateMusicButton();

}


// =====================================
// OPEN BIRTHDAY SURPRISE
// =====================================

openGift.addEventListener("click", function () {

    if (openGift.disabled) return;

    openGift.disabled = true;

    // Start gift animation
    gift.classList.add("opening");

    // Automatically start birthday music
    playBirthdayMusic();

    // Show birthday celebration
    setTimeout(function () {

        welcome.style.display = "none";

        birthday.style.display = "flex";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        // Start celebration effects
        startCelebration();

    }, 900);

});


// =====================================
// MUSIC ON / OFF BUTTON
// =====================================

musicButton.addEventListener("click", function () {

    if (musicPlaying) {

        pauseBirthdayMusic();

    } else {

        playBirthdayMusic();

    }

});


// =====================================
// START CELEBRATION
// =====================================

function startCelebration() {

    createConfetti(100);

    createBalloons(20);

}


// =====================================
// CONFETTI EFFECT
// =====================================

function createConfetti(amount) {

    const colors = [
        "#ff69b4",
        "#ffd700",
        "#87ceeb",
        "#98fb98",
        "#dda0dd"
    ];

    for (let i = 0; i < amount; i++) {

        const confetti = document.createElement("div");

        confetti.style.position = "fixed";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-20px";
        confetti.style.width = "10px";
        confetti.style.height = "10px";

        confetti.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        confetti.style.borderRadius = "50%";
        confetti.style.zIndex = "9999";
        confetti.style.pointerEvents = "none";
        confetti.style.animation = "fall 5s linear forwards";

        confettiContainer.appendChild(confetti);

        setTimeout(function () {

            confetti.remove();

        }, 7000);

    }

}


// =====================================
// FLOATING BALLOONS
// =====================================

function createBalloons(amount) {

    const decorations = ["🎈", "💗", "🌸", "🎀"];

    for (let i = 0; i < amount; i++) {

        const balloon = document.createElement("span");

        balloon.textContent =
            decorations[Math.floor(Math.random() * decorations.length)];

        balloon.style.position = "fixed";
        balloon.style.left = Math.random() * 100 + "vw";
        balloon.style.bottom = "-50px";
        balloon.style.fontSize = "30px";
        balloon.style.zIndex = "999";
        balloon.style.pointerEvents = "none";
        balloon.style.animation = "floatUp 10s linear forwards";

        balloons.appendChild(balloon);

        setTimeout(function () {

            balloon.remove();

        }, 11000);

    }

}


// =====================================
// REPLAY BIRTHDAY SURPRISE
// =====================================

replay.addEventListener("click", function () {

    // Stop birthday music
    pauseBirthdayMusic();

    // Hide birthday celebration
    birthday.style.display = "none";

    // Show welcome page
    welcome.style.display = "flex";

    // Reset gift animation
    gift.classList.remove("opening");

    // Enable Open Gift button again
    openGift.disabled = false;

    // Remove remaining celebration effects
    confettiContainer.innerHTML = "";
    balloons.innerHTML = "";

    // Return to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
