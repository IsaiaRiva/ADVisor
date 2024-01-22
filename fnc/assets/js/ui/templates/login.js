const TP_login = {
    render: (random) => {
        const html = `<div id="app-f80c6fae">
            <div id="signin-${random}">
                <div class="modal fade show" id="signin-modal-${random}" tabindex="-1" role="dialog" aria-modal="true" style="display: block;">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title lead">Media2Cloud Demo Portal <span style="font-size:0.85rem">by AWS Solutions Team</span></h5>
                            </div>
                            <div class="modal-body">
                                <div class="carousel slide" data-ride="false" data-interval="false" id="signin-carousel-${random}">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active" id="slide-signin-${random}">
                                            <form class="form-signin text-center needs-validation" novalidate="novalidate" data-type="login">
                                                <img class="mb-4" src="/images/m2c-full-black.png" alt="media2cloud logo" width="240">
                                                <div class="text-left">
                                                    <label class="sr-only" for="signin-username-${random}">Username</label>
                                                    <input class="form-control" type="text" id="signin-username-${random}" pattern="[a-zA-Z0-9._%+-]{1,128}" placeholder="Username" required="required" autofocus="autofocus">
                                                    <div class="invalid-feedback">Invalid username</div>
                                                </div>
                                                <div class="text-left">
                                                    <label class="sr-only" for="signin-password-${random}">Password</label>
                                                    <input class="form-control" type="password" id="signin-password-${random}" pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required="required">
                                                    <div class="invalid-feedback">Invalid password</div>
                                                </div>
                                                <div class="mt-4">
                                                    <button class="btn btn-primary btn-block" type="submit">Sign in</button>
                                                </div>
                                                <button class="btn btn-sm btn-link mt-2" type="button">Forgot password?</button>
                                            </form>
                                        </div>
                                        <div class="carousel-item" id="slide-new-password-${random}">
                                            <div>
                                                <p class="text-muted">Password must be at least <abbr title="eight characters">eight</abbr> characters long and contain <abbr title="one uppercase character">one</abbr> uppercase, <abbr title="one lowercase character">one</abbr> lowercase, <abbr title="one numeric character">one</abbr> number, and <abbr title="one special character">one</abbr> special character.</p>
                                                <form class="form-signin text-center needs-validation" novalidate="novalidate">
                                                    <div class="text-left">
                                                        <label class="sr-only" for="signin-password-01-${random}">New Password</label>
                                                        <input class="form-control" type="password" id="signin-password-01-${random}" pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required="required">
                                                        <div class="invalid-feedback">Invalid password</div>
                                                    </div>
                                                    <div class="text-left">
                                                        <label class="sr-only" for="signin-password-02-${random}">Confirm Password</label>
                                                        <input class="form-control" type="password" id="signin-password-02-${random}" pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required="required">
                                                        <div class="invalid-feedback">Invalid password</div>
                                                    </div>
                                                    <div class="mt-4"><button class="btn btn-primary btn-block" type="submit">Confirm</button></div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="carousel-item" id="slide-send-code-${random}">
                                            <div>
                                                <p class="text-muted">Please enter the username and press <strong>Send code</strong>. You should receive a 6-digits code in mail in a few minutes. You will need the code to reset the Password.</p>
                                                <form class="form-signin text-center needs-validation" novalidate="novalidate">
                                                    <div class="text-left">
                                                        <label class="sr-only" for="reset-form-username-${random}">Username</label>
                                                        <input class="form-control" type="text" id="reset-form-username-${random}" pattern="[a-zA-Z0-9._%+-]{1,128}" placeholder="Username" value="" required="required" autofocus="autofocus">
                                                        <div class="invalid-feedback">Invalid username</div>
                                                    </div>
                                                    <div class="mt-4">
                                                        <button class="btn btn-primary btn-block" type="submit">Send code</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="carousel-item" id="slide-reset-password-${random}">
                                            <div>
                                                <p class="text-muted">Please enter the verification code that has sent to your email address and your new Password.</p>
                                                <form class="form-signin text-center needs-validation" novalidate="novalidate">
                                                    <div class="text-left mb-2">
                                                        <label for="reset-form-confirmation-code-${random}">Verification Code</label>
                                                        <input class="form-control" type="text" id="reset-form-confirmation-code-${random}" pattern="[0-9]{6}" placeholder="Verification Code" required="required" autofocus="autofocus">
                                                        <div class="invalid-feedback">Invalid code</div>
                                                    </div>
                                                    <div class="text-left">
                                                        <label class="sr-only" for="reset-form-reset-password-${random}">New Password</label>
                                                        <input class="form-control" type="password" id="reset-form-reset-password-${random}" pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required="required">
                                                        <div class="invalid-feedback">Invalid password</div>
                                                    </div>
                                                    <div class="mt-4">
                                                        <button class="btn btn-primary btn-block" type="submit">Reset Password</button>
                                                    </div>
                                                </form> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <p class="font-weight-light text-muted mb-0">copyright © 2024</p>
                            </div>
                        </div>
                        <div id="signin-spinner-${random}" class="collapse spinner-grow text-secondary loading-4">
                            <span class="lead-sm sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        return html;
    }
}

export default TP_login