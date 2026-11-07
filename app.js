const status = document.getElementById('status');
const installBtn = document.getElementById('install');
const updateBtn = document.getElementById('update');
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
  let registration;
  let skipInitialControllerChange = !navigator.serviceWorker.controller;
  let refreshing = false;

  const showUpdate = () => {
    updateBtn.hidden = false;
  };

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (skipInitialControllerChange) {
      skipInitialControllerChange = false;
      return;
    }
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  const checkForUpdates = () => {
    if (!registration || !navigator.onLine) return;
    registration.update().catch((error) => {
      console.error('Impossible de vérifier les mises à jour.', error);
    });
  };

  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
    .then((serviceWorkerRegistration) => {
      registration = serviceWorkerRegistration;

      if (registration.waiting) showUpdate();

      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdate();
          }
        });
      });

      checkForUpdates();
      window.addEventListener('online', checkForUpdates);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdates();
      });
      window.setInterval(checkForUpdates, 60 * 60 * 1000);
    })
    .catch((error) => {
      console.error('Impossible d’enregistrer le service worker.', error);
    });

  updateBtn.addEventListener('click', () => {
    if (!registration?.waiting) {
      checkForUpdates();
      return;
    }
    updateBtn.disabled = true;
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  });
}
