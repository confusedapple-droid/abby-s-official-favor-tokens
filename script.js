const SECRET_UNLOCK = "Abby Siervo";
const RESET_PASSWORD = "apple";
const TOTAL = 6;

const grid = document.getElementById("tokenGrid");

function unlock() {
  if (unlockInput.value === SECRET_UNLOCK) {
    lockScreen.classList.add("hidden");
    card.classList.remove("hidden");
    loadTokens();
  }
}

function loadTokens() {
  grid.innerHTML = "";
  for (let i = 0; i < TOTAL; i++) {
    const t = document.createElement("div");
    t.className = "token";
    t.innerText = "TAP";
    t.onclick = () => redeem(i);
    grid.appendChild(t);

    db.collection("tokens").doc(String(i))
      .onSnapshot(doc => {
        if (doc.exists && doc.data().redeemed) {
          t.classList.add("redeemed");
          t.innerText = "REDEEMED";
        }
      });
  }
}

function redeem(i) {
  db.collection("tokens").doc(String(i)).set({ redeemed: true });
}

function resetTokens() {
  if (resetInput.value !== RESET_PASSWORD) return alert("Wrong password");
  for (let i = 0; i < TOTAL; i++) {
    db.collection("tokens").doc(String(i)).set({ redeemed: false });
  }
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

/* SWIPE TO FLIP */
let startX = 0;
card.addEventListener("touchstart", e => startX = e.touches[0].clientX);
card.addEventListener("touchend", e => {
  if (Math.abs(e.changedTouches[0].clientX - startX) > 50) {
    card.classList.toggle("flipped");
  }
});
