import LOGIN from './login-model';
import { capitalizeFirstLetter } from '../../../shared/utility/text-transform';
import { toggleVisibility } from '../../../shared/utility/visibility';
const {
	SVG: { MAIN_LOGO, HIDE_PWD, SHOW_PWD},
	SIGN_IN,
	USER,
	PWD,
	FORGOT_PWD,
  	CSS: { WRAPPER_CLASS },
} = LOGIN;

const TP_login = {
	render: random => {
		const html = `
            <div id="signin-${random}" class="${WRAPPER_CLASS} full-page grid-center">
                <div class="login-container">
                    <div id="${MAIN_LOGO.id}" class="login-logo-wrapper"></div>
                    <form 
                        class="form-signin text-center needs-validation" 
                        novalidate="novalidate" 
                        data-type="login">

                        <div class="input-separator">
                            <label class="hide-elm" for="signin-username-${random}">${USER}</label>
                            <input 
                                class="fnc-input-def" 
                                type="text" 
                                id="signin-username-${random}" 
                                pattern="[a-zA-Z0-9.%_+-@]{5,25}"
                                title="Invalid input"
                                placeholder=${capitalizeFirstLetter(USER)}
                                required 
                                name="signin-username-${random}"
                                autofocus>
                        </div>

                        <div class="login-pwd-input-wrapper">
                            <label class="hide-elm" for="signin-password-${random}">${PWD}</label>
                            <input 
                                class="fnc-input-def" 
                                type="password" 
                                id="signin-password-${random}" 
                                pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                                placeholder=${capitalizeFirstLetter(PWD)} 
                                name="signin-password-${random}"
                                required>
                            <div id="${SHOW_PWD.id}" class="show-pwd-icon-wrapper"></div>
                            <div id="${HIDE_PWD.id}" class="hide-pwd-icon-wrapper"></div>
                        </div>

                        <div class="login-bottom-wrapper d-flex-sb">
                            <button class="fnc-btn-naked" type="button">${capitalizeFirstLetter(FORGOT_PWD)}</button>
                            <button class="fnc-btn-def uppercase" type="submit">${SIGN_IN}</button>
                        </div>
                    </form>

                </div>
                <!-- ADD COMMENTED HERE -->
            </div>`;

		return html;
	},
    hide: random => {
        toggleVisibility(`#signin-${random}`)
    }
};

export default TP_login;

// <div class="carousel-item" id="slide-new-password-${random}">
//     <div>
//         <p class="text-muted">Password must be at least <abbr title="eight characters">eight</abbr> characters long and contain <abbr title="one uppercase character">one</abbr> uppercase, <abbr title="one lowercase character">one</abbr> lowercase, <abbr title="one numeric character">one</abbr> number, and <abbr title="one special character">one</abbr> special character.</p>
//         <form class="form-signin text-center needs-validation" novalidate="novalidate">
//             <div class="text-left">
//                 <label class="sr-only" for="signin-password-01-${random}">New Password</label>
//                 <input class="form-control" type="password" id="signin-password-01-${random}" pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required="required">
//                 <div class="invalid-feedback">Invalid password</div>
//             </div>
//             <div class="text-left">
//                 <label class="sr-only" for="signin-password-02-${random}">Confirm Password</label>
//                 <input class="form-control" type="password" id="signin-password-02-${random}" pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required="required">
//                 <div class="invalid-feedback">Invalid password</div>
//             </div>
//             <div class="mt-4"><button class="btn btn-primary btn-block" type="submit">Confirm</button></div>
//         </form>
//     </div>
// </div>

// <div class="carousel-item" id="slide-send-code-${random}">
//     <div>
//         <p class="text-muted">Please enter the username and press <strong>Send code</strong>. You should receive a 6-digits code in mail in a few minutes. You will need the code to reset the Password.</p>
//         <form class="form-signin text-center needs-validation" novalidate="novalidate">
//             <div class="text-left">
//                 <label class="sr-only" for="reset-form-username-${random}">Username</label>
//                 <input class="form-control" type="text" id="reset-form-username-${random}" pattern="[a-zA-Z0-9._%+-]{1,128}" placeholder="Username" value="" required="required" autofocus="autofocus">
//                 <div class="invalid-feedback">Invalid username</div>
//             </div>
//             <div class="mt-4">
//                 <button class="btn btn-primary btn-block" type="submit">Send code</button>
//             </div>
//         </form>
//     </div>
// </div>

// <div class="carousel-item" id="slide-reset-password-${random}">
//     <div>
//         <p class="text-muted">Please enter the verification code that has sent to your email address and your new Password.</p>
//         <form class="form-signin text-center needs-validation" novalidate="novalidate">
//             <div class="text-left mb-2">
//                 <label for="reset-form-confirmation-code-${random}">Verification Code</label>
//                 <input class="form-control" type="text" id="reset-form-confirmation-code-${random}" pattern="[0-9]{6}" placeholder="Verification Code" required="required" autofocus="autofocus">
//                 <div class="invalid-feedback">Invalid code</div>
//             </div>
//             <div class="text-left">
//                 <label class="sr-only" for="reset-form-reset-password-${random}">New Password</label>
//                 <input class="form-control" type="password" id="reset-form-reset-password-${random}" pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required="required">
//                 <div class="invalid-feedback">Invalid password</div>
//             </div>
//             <div class="mt-4">
//                 <button class="btn btn-primary btn-block" type="submit">Reset Password</button>
//             </div>
//         </form>
//     </div>
// </div>
