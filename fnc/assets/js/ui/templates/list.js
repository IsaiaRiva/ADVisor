const TP_list = {
    container: {
        render: (random) => {
            const html = `<div id="media-${random}"></div>`;
            return html;
        }
    },
    item: {
        render: (media, url) => {
            const html = `
            <div class="col-3 media-completed" data-uuid="${media.uuid}" data-status="${media.overallstatus}">
                <img class="w-100" alt="${media.basename}"
                src="${url}"
                style="aspect-ratio: 16 / 9; object-fit: cover;">
                <div class="card-img-overlay category p-2">
                    <div class="row no-gutters h-100">
                        <div class="col-6 p-0 m-0">
                            <h5 class="lead-s m-0 text-white text-contain">
                                ${media.basename}
                            </h5>
                        </div>
                        <div class="col-6 p-0 m-0">
                            <div class="p-0 m-0 d-flex justify-content-end">
                                <span class="lead-xs px-2 text-white text-right bg-dark">${media.readableDuration}</span>
                            </div>
                        </div>
                        <div class="col-12 p-0 align-self-end d-flex">
                            <div class="col-6 p-0 m-0 mt-auto">
                                <button class="btn btn-sm btn-outline-danger lead-sm media-action"
                                    data-toggle="tooltip" data-placement="bottom" title=""
                                    data-original-title="Remove media from collection">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </div>
                            <div class="col-6 p-0 m-0 ml-auto text-right">
                                <button class="btn btn-link media-action">
                                    <i class="far fa-play-circle icon-4"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            return html;
        }
    }
}

export default TP_list