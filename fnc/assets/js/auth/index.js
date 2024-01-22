import { FN_cached_user, FN_user } from './functions.js';
import TP_login from '../ui/templates/login.js';
import Ui from '../ui/index.js';

import Localization from '../../../../src/lib/js/app/shared/localization.js';
import AppUtils from '../../../../src/lib/js/app/shared/appUtils.js';
import AuthenticationFlow from '../../../../src/lib/js/app/shared/cognito/authenticationFlow.js';
import {
    UserSession,
    GetUserSession,
    LoadUserSessionFromCache,
    OPT_USERNAME,
} from '../../../../src/lib/js/app/shared/cognito/userSession.js';
import {
    GetIotSubscriber,
} from '../../../../src/lib/js/app/shared/iotSubscriber.js';
import {
    GetSettingStore,
} from '../../../../src/lib/js/app/shared/localCache/settingStore.js';

const {
    ChallengeNameType,
} = window.AWSv3;

const SOLUTION_ICON = '../../../../images/m2c-full-black.png';

const {
    Copyright: COPYRIGHT,
    RegularExpressions: {
        Username: REGEX_USERNAME,
    },
    Messages: {
        Title: MSG_TITLE,
        PwdRequirement: MSG_PASSWORD_REQ,
        ResetSendCode: MSG_RESET_SEND_CODE,
        ResetPwd: MSG_RESET_PASSWORD,
    },
    Alerts: {
        Oops: OOPS,
        MismatchPwds: MSG_MISMATCH_PASSWORDS,
        PwdConformance: MSG_PASSWORD_NOT_CONFORM,
        SignInProblem: MSG_SIGNIN_PROBLEM,
        UsernameConformance: MSG_USERNAME_NOT_CONFORM,
    },
} = Localization;

const RANDOM_ID = AppUtils.randomHexstring();
const ID_SPINNER = `signin-spinner-${RANDOM_ID}`;
const ID_CONTAINER = `signin-${RANDOM_ID}`;
const ID_MODAL = `signin-modal-${RANDOM_ID}`;
const ID_CAROUSEL = `signin-carousel-${RANDOM_ID}`;
const ID_PASSWORD = `signin-password-${RANDOM_ID}`;
const ID_PASSWORD_01 = `signin-password-01-${RANDOM_ID}`;
const ID_PASSWORD_02 = `signin-password-02-${RANDOM_ID}`;
const SLIDEID_SIGNIN = `slide-signin-${RANDOM_ID}`;
const SLIDEID_NEW_PASSWORD = `slide-new-password-${RANDOM_ID}`;
const SLIDEID_SEND_CODE = `slide-send-code-${RANDOM_ID}`;
const SLIDEID_RESET_PASSWORD = `slide-reset-password-${RANDOM_ID}`;

const ON_SIGNIN_VIEW_HIDDEN = 'signin:view:hidden';

const _tmpFlowData = {};

const Auth = {
    render: async (container) => {
        await Auth.hide(container);

        let username;
        try {
            const userSession = await FN_cached_user(LoadUserSessionFromCache);

            username = (userSession || {}).username;

            if (username !== undefined) {
                console.log('FSLOG username defined')

                //return container.dispatchEvent(ON_SIGNIN_VIEW_HIDDEN);

                //return container.dispatchEvent(ON_SIGNIN_VIEW_HIDDEN);

                
            }
        } catch (e) {
            /* do nothing */
        } finally {
            if (username === undefined) {
                const store = GetSettingStore();
                username = await store.getItem(OPT_USERNAME);
            }
        }

        Auth.inject(container);
        Auth.forms(container);
    },
    hide: async (container) => {
        container.innerHTML = 'Content deleted';

    },
    inject: (container) => {
        container.innerHTML = TP_login.render(RANDOM_ID);
    },
    forms: (container) => {
        const forms = [...container.querySelector('form')];
        forms.map(form => {
            const type = form.dataset.type;
            switch (type) {
                case 'login':
                    console.log('login');
                    Auth.check.login(form, container)
                    break;

                default:
                    console.log(`Wrong ${type}.`);
            }

        });
    },
    check: {
        login: (form, container) => {

            console.log('FSLOG', form)
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                console.log('FSLOG 2', form[0])
                try {
                    //this.loading();

                    if (form[0].checkValidity() === false) {
                        event.stopPropagation();
                        //this.shake();

                        throw MSG_PASSWORD_NOT_CONFORM;
                    }

                    /* const [
                        inputUsername,
                        inputPassword,
                    ] = [
                        inputId,
                        passwordId,
                    ].map((id) =>
                        form.find(`#${id}`)); */

                    const flow = new AuthenticationFlow();
                    const response = await flow.authenticateUser(
                        form[0].value,
                        form[1].value
                    );

                    if (response instanceof UserSession) {
                        await FN_user(GetUserSession, GetIotSubscriber);

                        form[0].value = ''
                        form[1].value = ''

                        setTimeout(() => {
                            const modal = document.querySelector(`div#${ID_MODAL}`);

                            modal.style.display = 'none';
                            
                            Ui.render(container);
                        }, 10);

                        return true;
                    }

                    /* if (response.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
                        _tmpFlowData.username = inputUsername.val();
                        _tmpFlowData.challengeResponse = response;

                        this.slideTo(SLIDEID_NEW_PASSWORD);
                        return true;
                    } */

                    console.log(
                        'ERR:',
                        'authenticateUser:',
                        response
                    );

                    throw new Error(`fail to authenticate user, ${(response.$metadata || {}).httpStatusCode}`);
                } catch (e) {
                    let message = e;

                    if (e instanceof Error) {
                        message = [
                            MSG_SIGNIN_PROBLEM,
                            `<br><pre class="text-danger small">(error: ${e.message})</pre>`,
                        ].join('');
                    }

                    await Auth.check.message(
                        'danger',
                        OOPS,
                        message
                    );

                    return false;
                } finally {
                    //this.loading(false);
                    
                }
            });
        },
        message: async (type, header, description, duration = 5 * 1000) => {
            return new Promise((resolve) => {
                const color = `alert-${type}`;
          
             
               
                console.log('FSERROR',type, header, description)
                
              });
        }
    }
}

export default Auth;