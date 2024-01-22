import TP_container from "./templates/container";
import TP_menu from "./templates/menu";
import TP_list from "./templates/list.js";

import AppUtils from "../../../../src/lib/js/app/shared/appUtils";
import {
    GetMediaManager,
    RegisterMediaEvent,
    ON_MEDIA_ADDED,
    ON_MEDIA_UPDATED,
    ON_MEDIA_ERROR,
  } from '../../../../src/lib/js/app/shared/media/mediaManager.js';
import BaseMedia from "../../../../src/lib/js/app/shared/media/baseMedia.js";
import MediaFactory from "../../../../src/lib/js/app/shared/media/mediaFactory.js";
import SnapshotComponent from "../../../../src/lib/js/app/mainView/collection/base/components/snapshotComponent.js";

const Ui = {
    render: async (container) => {
        const RANDOM_ID = AppUtils.randomHexstring();
        
        Ui.main(container, RANDOM_ID);
        
        
        
        //Ui.inject(main)
    },
    inject: (container, template, position) => {
        //positions: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
        container.insertAdjacentHTML(position, template);

    },
    main: (container, random) => {
        Ui.inject(container, TP_container.render(random), 'beforeend');

        const main = document.querySelector(`#main-${random}`);
        
        Ui.menu(main, random);

    
    },
    menu: (container, random) => {
        Ui.inject(container, TP_menu.render(random), 'beforeend');

        Ui.content(container, random);

    },
    content: async (container, random) => {
        const type = 'video';
        const media = GetMediaManager();
        const medias = await media.scanRecordsByCategory(type);
        
        const filtered = medias.filter((x) => x.overallStatus === 'COMPLETED');
        Ui.build(container, random, filtered)

    },
    build: (container, random, medias) => {
        Ui.inject(container, TP_list.container.render(random), 'beforeend');

        const list = document.querySelector(`#media-${random}`)

        medias.map(media => {
            console.log('FSLOG media', media)
            Ui.thumbnail(list, media);
            //const url = new BaseMedia(media.data).getThumbnail();

             
        
        ///let wait = url.;
        
        });
    },
    thumbnail: async (list, media) => {
        const thumb = await new BaseMedia(media.data).getThumbnail();

        Ui.inject(list, TP_list.item.render(media, thumb), 'beforeend');
        console.log('FSLOG build', media.uuid)

        const button = document.querySelector(`.media-completed[data-uuid="${media.uuid}"]`);
        button.addEventListener('click', async () => {
            const editor = await MediaFactory.createPreviewComponent(media)
            
            const snap = new SnapshotComponent(editor);

            console.log('FSLOG editor', editor)
        })

    }
}

export default Ui;