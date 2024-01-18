import PassphraseApp from './passphraseApp.js';
import MediasetApp from './mediasetApp.js';

const ID_DEMOAPP = '#demo-app';

$(document).ready(async () => {
  const passphraseApp = new PassphraseApp(ID_DEMOAPP);
  passphraseApp.on('passphrase:view:hidden', (credentials) => {
    setTimeout(async () => {
      const app = new MediasetApp(ID_DEMOAPP);
      console.log('MediasetApp loaded');

      $(window).on('unload', async () => {
        console.log('MediasetApp unloading...');
        await app.hide();
      });

      await app.show();
    }, 10);
  });

  await passphraseApp.show();
});
