import DASHBOARD from './dashboard/dashboard-model';

const { REMOVE_BTN } = DASHBOARD;


const TP_list = {
    container: {
        render: (random) => {
            const html = `<div id="media-${random}" class="full-page-content-padding"></div>`;
            return html;
        }
    },
    mediaCompleteList: {
        render: (random) => {
            const html = `<div id="media-complete-${random}" class="bottom-divider d-flex"></div>`;
            return html;
        }
    },
    item: {
        render: (media, url) => {
            const html = `
            <div class="media-container" data-uuid="${media.uuid}" data-status="${media.overallStatus}">
                <img class="media-img" alt="${media.basename}" src="${url}">
                <div class="media-detail-wrapper d-flex-dc">
                 <p class="media-detail-title capitalize">${media.basename}</p>
                 <section class="media-detail-bottom-section d-flex-sb">
                    <p class="media-detail-duration">${media.readableDuration}</p>
                    <button class="fnc-btn-nav d-flex-vc">
                        <svg width="2rem" height="2rem" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/></svg>
                        <span class="uppercase">${REMOVE_BTN}</span>
                    </button>
                 </section>
                </div>
            </div>

          `;

            return html;
        }
    }
}

export default TP_list;