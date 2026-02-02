const SECRET_UNLOCK = "abby siervo";
const RESET_PASSWORD = "apple";
const TOTAL = 6;

const unlockInput = document.getElementById("unlockInput");
const lockScreen = document.getElementById("lockScreen");
const card = document.getElementById("card");
const grid = document.getElementById("tokenGrid");
const resetInput = document.getElementById("resetInput");

let tokens = JSON.parse(localStorage.getItem("tokens")) || Array(TOTAL).fill(false);

/* UNLOCK */
function unlock() {
  if (unlockInput.value.trim().toLowerCase() === SECRET_UNLOCK) {
    lockScreen.classList.add("hidden");
    card.classList.remove("hidden");
    loadTokens();
  } else {
    alert("Incorrect access phrase");
  }
}

/* LOAD TOKENS */
function loadTokens() {
  grid.innerHTML = "";

  tokens.forEach((redeemed, i) => {
    const t = document.createElement("div");
    t.className = "token";
    t.textContent = redeemed ? "REDEEMED" : "TAP";

    if (redeemed) t.classList.add("redeemed");

    t.onclick = () => redeem(i);
    grid.appendChild(t);
  });
}

/* REDEEM */
function redeem(i) {
  if (tokens[i]) return;
  tokens[i] = true;
  save();
  loadTokens();
}

/* RESET */
function resetTokens() {
  if (resetInput.value !== RESET_PASSWORD) {
    alert("Wrong password");
    return;
  }
  tokens = Array(TOTAL).fill(false);
  save();
  loadTokens();
}

/* SAVE */
function save() {
  localStorage.setItem("tokens", JSON.stringify(tokens));
}

/* DARK MODE */
function toggleDark() {
  document.body.classList.toggle("dark");
}

/* SWIPE TO FLIP */
let startX = 0;

card.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

card.addEventListener("touchend", e => {
  if (Math.abs(e.changedTouches[0].clientX - startX) > 50) {
    card.classList.toggle("flipped");
  }
});
