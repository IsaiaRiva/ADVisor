import TP_container from "./templates/container";
import TP_menu from "./templates/dashboard/menu.js";
import TP_list from "./templates/list.js";
import LOGIN from './templates/login/login-model';
import DASHBOARD from './templates/dashboard/dashboard-model.js'
import { injectSvg } from '../shared/utility/create-svg.js';
const {
	SVG: { MAIN_LOGO, LOGOUT },
} = LOGIN;
const { SVG: { MAIN_LOGO_NAV } } = DASHBOARD;

import AppUtils from "../../../../src/lib/js/app/shared/appUtils";
import {
    GetMediaManager,
    RegisterMediaEvent,
    ON_MEDIA_ADDED,
    ON_MEDIA_UPDATED,
    ON_MEDIA_ERROR,
  } from '../../../../src/lib/js/app/shared/media/mediaManager.js';
import BaseMedia from "../../../../src/lib/js/app/shared/media/baseMedia.js";

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
    main: async (container, random) => {
        Ui.inject(container, TP_container.render(random), 'beforeend');

        const main = document.querySelector(`#main-${random}`);
        
        await Ui.menu(main, random);
        injectSvg(MAIN_LOGO.path, MAIN_LOGO_NAV.id);
        injectSvg(LOGOUT.path, LOGOUT.id);
    
    },
    menu: async (container, random) => {
        Ui.inject(container, TP_menu.render(random), 'beforeend');

        await Ui.content(container, random);

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
        Ui.inject(list, TP_list.mediaCompleteList.render(random), 'beforeend');
        const completeList = document.querySelector(`#media-complete-${random}`)


       medias.map(media => {
            console.log('FSLOG media', media)
            Ui.thumbnail(completeList, media);
            //const url = new BaseMedia(media.data).getThumbnail();

             
        
        ///let wait = url.;
        
        });
    },
    thumbnail: async (list, media) => {
        const thumb = await new BaseMedia(media.data).getThumbnail();

        Ui.inject(list, TP_list.item.render(media, thumb), 'beforeend');
        console.log('FSLOG build', thumb)

    }
}

export default Ui;