import AppUtils from './app/shared/appUtils.js';
import {
  GetUserSession,
} from './app/shared/cognito/userSession.js';

const TITLE = 'Content deep analysis (Ad placement)';
const COPYRIGHT = 'copyright &copy; 2023';
const REGION = 'eu-west-1';
const RANDOM_KEY = 'U2FsdGVkX19+1yx9Vsji8ew9hruVE6l4sNJzF6zYAE1cJUk9eEOczYInLV8WWSWHSw4uVhtwlwhI7UNEH2L2HAM78hlCeAmGlqsL8AfHbSl9f+45ZG4L0szK4gFgxgUkqSsGMbbLqTkFb2ZZgerzGS7AdeShYj96F5ZSh/LO83g=';

export default class PassphraseApp {
  constructor(parentId, title = TITLE) {
    const id = AppUtils.randomHexstring();
    this.$view = $('<div/>')
      .attr('id', `view-${id}`);
    $(parentId).append(this.$view);

    this.$passphraseId = `passphrase-${id}`;
    this.$dialog = undefined;
    this.$parentId = parentId;
    this.$title = title;
  }

  get view() {
    return this.$view;
  }

  get dialog() {
    return this.$dialog;
  }

  set dialog(val) {
    this.$dialog = val;
  }

  get passphraseId() {
    return this.$passphraseId;
  }

  get parentId() {
    return this.$parentId;
  }

  get title() {
    return this.$title;
  }

  async show() {
    await this.hide();

    this.dialog = $('<div/>')
      .addClass('modal fade')
      .attr('tabindex', -1)
      .attr('role', 'dialog');
    this.view.append(this.dialog);

    const modal = $('<div/>')
      .addClass('modal-dialog')
      .attr('role', 'document');
    this.dialog.append(modal);

    const content = $('<div/>')
      .addClass('modal-content');
    modal.append(content);

    const header = $('<div/>')
      .addClass('modal-header');
    content.append(header);

    const logo = $('<img/>')
      .addClass('mr-2')
      .attr('src', AppUtils.Logo);

    const title = $('<h5/>')
      .addClass('modal-title lead')
      .append(logo)
      .append(this.title);
    header.append(title);

    const body = $('<div/>')
      .addClass('modal-body');
    content.append(body);

    const form = this.createForm();
    body.append(form);

    const footer = $('<div/>')
      .addClass('modal-footer');
    content.append(footer);

    const copyright = this.createCopyright();
    footer.append(copyright);

    this.dialog.on('hidden.bs.modal', () =>
      this.view.trigger('passphrase:view:hidden'));

    return this.dialog.modal({
      backdrop: 'static',
      keyboard: false,
      show: true,
    });
  }

  async hide() {
    this.view.children()
      .remove();
    this.dialog = undefined;
  }

  createForm() {
    const form = $('<form/>')
      .addClass('form-signin text-center needs-validation')
      .attr('novalidate', 'novalidate')
      .append(this.createLogo())
      .append(this.createPassphraseInput())
      .append(this.createSubmitButton());

    form.submit(async (event) => {
      let passphrase;
      try {
        event.preventDefault();

        if (form[0].checkValidity() === false) {
          throw new Error('validation failed');
        }

        passphrase = form.find(`#${this.passphraseId}`);
        let decrypted = CryptoJS.AES.decrypt(RANDOM_KEY, passphrase.val()).toString(CryptoJS.enc.Utf8);
        passphrase.val('');
        if (!decrypted) {
          throw new Error('invalid passphrase');
        }

        decrypted = JSON.parse(decrypted);
        const session = GetUserSession();
        session.credentials = {
          AccessKeyId: decrypted.accessKeyId,
          SecretKey: decrypted.secretAccessKey,
        };
        return this.dialog.modal('hide');
      } catch (e) {
        event.stopPropagation();
        this.shake();
        return false;
      }
    });
    return form;
  }

  createLogo() {
    return $('<i/>')
      .addClass('far fa-paper-plane')
      .addClass('text-secondary mt-2 mb-4')
      .css('font-size', '5rem');
  }

  createPassphraseInput() {
    const container = $('<div/>')
      .addClass('text-left');

    const label = $('<label/>')
      .addClass('sr-only')
      .attr('for', this.passphraseId)
      .html('Passphrase');
    container.append(label);

    const input = $('<input/>')
      .addClass('form-control')
      .attr('type', 'password')
      .attr('id', this.passphraseId)
      .attr('pattern', '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}')
      .attr('placeholder', 'Passphrase')
      .attr('required', 'required');
    container.append(input);

    const invalid = $('<div/>')
      .addClass('invalid-feedback')
      .html('Invalid passphrase');
    container.append(invalid);

    return container;
  }

  createSubmitButton(text = 'Sign in') {
    const container = $('<div/>')
      .addClass('mt-4');

    const submit = $('<button/>')
      .addClass('btn btn-primary btn-block')
      .attr('type', 'submit')
      .html(text);
    container.append(submit);

    return container;
  }

  createCopyright() {
    return $('<p/>')
      .addClass('font-weight-light text-muted mb-0')
      .html(COPYRIGHT);
  }

  shake(delay = 200) {
    this.dialog
      .addClass('shake-sm')
      .on('webkitAnimationEnd oanimationend msAnimationEnd animationend', (e) =>
        this.dialog
          .delay(delay)
          .removeClass('shake-sm'));
  }

  appendTo(parent) {
    return parent.append(this.view);
  }

  on(event, fn) {
    return this.view.on(event, fn);
  }

  off(event) {
    return this.view.off(event);
  }
}
