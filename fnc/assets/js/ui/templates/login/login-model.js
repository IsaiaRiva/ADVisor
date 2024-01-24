import  C  from '../../../shared/models/general';

const LOGIN = {
	SIGN_IN: 'sign in',
	USER: 'username',
	PWD: 'password',
	FORGOT_PWD: 'forgot password ?',
  SVG: {
    MAIN_LOGO: {
      path: `${C.SVG.BASE_PATH}ADVisor-logo.svg`,
      id: 'login-svg'
    },
    SHOW_PWD: {
      path: `${C.ICON.BASE_PATH}show-eye.svg`,
      id: 'show-pwd-icon'
    },
    HIDE_PWD: {
      path: `${C.ICON.BASE_PATH}hide-eye.svg`,
      id: 'hide-pwd-icon'
    },
  },
  CSS: {
    WRAPPER_CLASS: 'login-page'
  }
};

export default Object.freeze(LOGIN)
