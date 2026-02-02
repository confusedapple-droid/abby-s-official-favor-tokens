/***** CONFIG *****/
const RESET_PASSWORD = 'apple';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXX",
  appId: "XXX"
};

/***** INIT *****/
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const tokensRef = db.ref('tokens');

/***** ELEMENTS *****/
const flipCard = document.getElementById('flipCard');
const rulesBtn = document.getElementById('rulesBtn');
const rulesCard = document.getElementById('rulesCard');
const resetBtn = document.getElementById('resetBtn');
const resetInput = document.getElementById('resetInput');
const resetStatus = document.getElementById('resetStatus');
const tokens = document.querySelectorAll('.token');

/***** FLIP LOGIC *****/
rulesBtn.onclick = () => {
  flipCard.classList.add('flipped');
};

rulesCard.onclick = (e) => {
  if (e.target === rulesCard) {
    flipCard.classList.remove('flipped');
  }
};

/***** SYNC TOKENS *****/
tokensRef.on('value', snap => {
  const data = snap.val() || {};
  tokens.forEach(t => {
    t.classList.toggle('redeemed', data[t.dataset.id]);
  });
});

/***** REDEEM FUNCTION *****/
function redeemToken(id) {
  tokensRef.child(id).transaction(v => v ? true : true);
}

/***** TAP TO REDEEM *****/
tokens.forEach(token => {
  token.onclick = () => redeemToken(token.dataset.id);
});

/***** DRAW / SWIPE TO REDEEM *****/
let startX = null;
let startY = null;

tokens.forEach(token => {
  token.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  });

  token.addEventListener('touchend', e => {
    if (!startX || !startY) return;
    const t = e.changedTouches[0];
    const dx = Math.abs(t.clientX - startX);
    const dy = Math.abs(t.clientY - startY);
    if (dx + dy > 40) redeemToken(token.dataset.id);
    startX = startY = null;
  });
});

/***** RESET *****/
resetBtn.onclick = () => {
  if (resetInput.value !== RESET_PASSWORD) {
    resetStatus.textContent = 'Wrong password';
    return;
  }
  tokensRef.set({1:false,2:false,3:false,4:false,5:false,6:false});
  resetStatus.textContent = 'Tokens reset';
  resetInput.value = '';
};
