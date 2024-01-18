import SloMoApp from './slomoApp.js';
import {
  SignInFlow,
  ON_SIGNIN_VIEW_HIDDEN,
} from '../app/signInFlow.js';

const ID_DEMOAPP = '#demo-app';
const TITLE = 'Super slow motion video creation on AWS';

$(document).ready(async () => {
  // container
  const appContainer = $('<div/>');
  $(ID_DEMOAPP).append(appContainer);

  // create logo
  const logo = $('<i/>')
    .addClass('far fa-paper-plane')
    .addClass('text-secondary mt-2 mb-4')
    .css('font-size', '5rem');

  // attach signin flow
  const signIn = new SignInFlow(TITLE, logo);
  signIn.appendTo(appContainer);

  // event handlings
  signIn.view.on(ON_SIGNIN_VIEW_HIDDEN, () => {
    setTimeout(async () => {
      const app = new SloMoApp(ID_DEMOAPP, TITLE);
      console.log('SloMoApp loaded');

      $(window).on('unload', async () => {
        console.log('SloMoApp unloading...');
        await app.hide();
      });

      await app.show();
    }, 10);
  });

  await signIn.show();

  // const passphraseApp = new PassphraseApp(ID_DEMOAPP, TITLE);
  // passphraseApp.on('passphrase:view:hidden', (credentials) => {
  //   setTimeout(async () => {
  //     const app = new SloMoApp(ID_DEMOAPP, TITLE);
  //     console.log('SloMoApp loaded');

  //     $(window).on('unload', async () => {
  //       console.log('SloMoApp unloading...');
  //       await app.hide();
  //     });

  //     await app.show();
  //   }, 10);
  // });

  // await passphraseApp.show();
});
