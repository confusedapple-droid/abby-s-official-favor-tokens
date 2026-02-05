const SECRET_UNLOCK = "abby grace siervo";
const RESET_PASSWORD = "apple";
const TOTAL = 6;

const unlockInput = document.getElementById("unlockInput");
const lockScreen = document.getElementById("lockScreen");
const card = document.getElementById("card");
const grid = document.getElementById("tokenGrid");
const resetInput = document.getElementById("resetInput");

/* =====================
   PHILIPPINE TIME CHECK
===================== */
function isFeb28PHTime() {
  const nowUTC = new Date();
  const phTime = new Date(nowUTC.getTime() + 8 * 60 * 60 * 1000);
  return phTime.getMonth() === 1 && phTime.getDate() === 28;
}

/* =====================
   MESSAGE PAGE
===================== */
function showMessagePage() {
  lockScreen.classList.add("hidden");
  card.classList.add("hidden");

  const page = document.getElementById("messagePage");
  page.classList.remove("hidden");

  const music = document.getElementById("messageMusic");
  music.volume = 0.6;
  music.currentTime = 0; // play once from start
  music.play().catch(() => {});
}

function toggleMessageMusic() {
  const music = document.getElementById("messageMusic");
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

/* =====================
   UNLOCK
===================== */
function unlock() {
  const input = unlockInput.value.trim().toLowerCase();

  if (input === SECRET_UNLOCK) {
    lockScreen.classList.add("hidden");
    card.classList.remove("hidden");
    loadTokens();

  } else if (input === "022801") {
    if (isFeb28PHTime()) {
      showMessagePage();
    } else {
      alert("💗 This message unlocks on February 28 (Philippine Time)");
    }

  } else {
    alert("Wrong access password");
  }
}

/* =====================
   LOAD TOKENS (REALTIME)
===================== */
function loadTokens() {
  grid.innerHTML = "";

  for (let i = 0; i < TOTAL; i++) {
    const t = document.createElement("div");
    t.className = "token";
    t.textContent = "TAP";
    t.onclick = () => redeem(i);
    grid.appendChild(t);

    db.collection("tokens")
      .doc(String(i))
      .onSnapshot(doc => {
        if (doc.exists && doc.data().redeemed === true) {
          t.textContent = "REDEEMED";
          t.classList.add("redeemed");
        } else {
          t.textContent = "TAP";
          t.classList.remove("redeemed");
        }
      });
  }
}

/* =====================
   REDEEM
===================== */
function redeem(i) {
  db.collection("tokens").doc(String(i)).set({ redeemed: true });
}

/* =====================
   RESET (GLOBAL)
===================== */
function resetTokens() {
  if (resetInput.value !== RESET_PASSWORD) {
    alert("Wrong password");
    return;
  }

  for (let i = 0; i < TOTAL; i++) {
    db.collection("tokens").doc(String(i)).set({ redeemed: false });
  }
}

/* =====================
   DARK MODE
===================== */
function toggleDark() {
  const body = document.body;
  const btn = document.getElementById("themeToggle");

  body.classList.toggle("dark");
  btn.innerText = body.classList.contains("dark") ? "☀️" : "🌙";
}

/* =====================
   FLIP
===================== */
function flipCard() {
  card.classList.toggle("flipped");
}

/* =====================
   SWIPE
===================== */
let startX = 0;

card.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

card.addEventListener("touchend", e => {
  if (Math.abs(e.changedTouches[0].clientX - startX) > 50) {
    flipCard();
  }
});
