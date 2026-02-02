const SECRET_UNLOCK = "abby grace siervo";
const RESET_PASSWORD = "apple";
const TOTAL = 6;

const unlockInput = document.getElementById("unlockInput");
const lockScreen = document.getElementById("lockScreen");
const card = document.getElementById("card");
const grid = document.getElementById("tokenGrid");
const resetInput = document.getElementById("resetInput");

/* =====================
   UNLOCK
===================== */
function unlock() {
  const input = unlockInput.value.trim().toLowerCase();

  if (input === SECRET_UNLOCK) {
    lockScreen.classList.add("hidden");
    card.classList.remove("hidden");
    loadTokens();
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

  if (body.classList.contains("dark")) {
    btn.innerText = "☀️";
  } else {
    btn.innerText = "🌙";
  }
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
