import DASHBOARD from './dashboard-model';
import LOGIN from '../login/login-model';

const {
	SVG: { MAIN_LOGO_NAV },
} = DASHBOARD;
const {
	SIGN_OUT,
	SVG: { LOGOUT },
} = LOGIN;

const tabs = [
	{
		label: 'adv',
		link: '',
	},
	{
		label: 'training',
		link: '',
	},
	{
		label: 'adautotag',
		link: '',
	},
	{
		label: 'processing',
		link: '',
	},
	{
		label: 'settings',
		link: '',
	},
	{
		label: 'user management',
		link: '',
	},
];

const TP_menu = {
    render: (random) => {
        const html = `
            <nav class="fnc-nav d-flex" id="main-tabs-${random}">
                <div id="${MAIN_LOGO_NAV.id}" class="fnc-nav-logo"></div>
                <ul class="fnc-nav-list d-flex">
                    ${tabs.map(({label}, i) => {
                        return  `<li class="${i}-${label} fnc-nav-list-item uppercase bold">
                            <a class="fnc-nav-list-link">${label}</a>
                        </li>`
                    }).join('')}
                </ul>
                <button class="d-flex-vc fnc-btn-nav logout-btn capitalize">
                    <div id="${LOGOUT.id}" class="logout-svg-wrapper"></div>
                    ${SIGN_OUT}
                </button>
            </nav>`;
        return html;
    }
}

export default TP_menu;