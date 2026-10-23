const status = document.getElementById('status');
const installBtn = document.getElementById('install');
let deferredPrompt;

status.textContent = navigator.onLine ? 'En ligne' : 'Hors ligne';
window.addEventListener('online', () => (status.textContent = 'En ligne'));
window.addEventListener('offline', () => (status.textContent = 'Hors ligne'));

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener('click', async () => {
  installBtn.hidden = true;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
