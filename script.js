const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('status');

resetBtn.addEventListener('click', () => {
  statusText.textContent = '✨ Tokens have been reset successfully!';
});
