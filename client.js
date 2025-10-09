// Registrer SW
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered');
    } catch (e) {
      console.error('SW registration failed', e);
    }
  });
}

// Håndter install prompt (Chromium)
let deferredPrompt;
const installBtn = document.getElementById('pwa-install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // for å vise prompt når du vil
  deferredPrompt = e;
  // Vis egen knapp / UI
  if (installBtn) installBtn.style.display = 'inline-block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log('PWA install choice:', choice);
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
}
