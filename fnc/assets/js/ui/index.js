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

import ApiHelper from '../../../../src/lib/js/app/shared/apiHelper.js';
import { GetS3Utils } from '../../../../src/lib/js/app/shared/s3utils.js';
import AnalysisTypes from '../../../../src/lib/js/app/shared/analysis/analysisTypes.js';
import AppUtils from '../../../../src/lib/js/app/shared/appUtils';
import {
    GetMediaManager,
    RegisterMediaEvent,
    ON_MEDIA_ADDED,
    ON_MEDIA_UPDATED,
    ON_MEDIA_ERROR,
  } from '../../../../src/lib/js/app/shared/media/mediaManager.js';
import BaseMedia from '../../../../src/lib/js/app/shared/media/baseMedia.js';
import MediaFactory from '../../../../src/lib/js/app/shared/media/mediaFactory.js';

const {
  Rekognition: {
    Celeb,
    Label,
    FaceMatch,
    Face,
    Person,
    Moderation,
    Segment,
    CustomLabel,
    Text,
  },
  Comprehend: {
    Keyphrase,
    Entity,
    Sentiment,
  },
  AdBreak,
  Shoppable,
} = AnalysisTypes;

const Ui = {
    elements: {
        list: '',
        editor: ''
    },
    render: async (container) => {
        const RANDOM_ID = AppUtils.randomHexstring();
        
        Ui.main(container, RANDOM_ID);
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

        Ui.list(container, random, filtered);
    },
    list: (container, random, medias) => {
        Ui.inject(container, TP_list.container.render(random), 'beforeend');
        const list = document.querySelector(`#media-${random}`)
        Ui.inject(list, TP_list.mediaCompleteList.render(random), 'beforeend');
        const completeList = document.querySelector(`#media-complete-${random}`)

        Store.elements.media = document.querySelector(`#media-${random}`);
        const valid = medias.map(async media => {
            const response = await Ui.analyze(media);

            if (response !== undefined) return media;
        });

        Promise.all(valid).then(validated => {
            const filtered = validated.filter(record => {
                return record !== undefined;
            });

            filtered.map(media => {
                Ui.thumbnail(media);
            });
        })
    },
    analyze: async (media) => {
        const analysisResult = await ApiHelper.getAnalysisResults(media.uuid);
        
        return analysisResult[0].rekognition.adbreak;
    },
    thumbnail: async (media) => {
        const thumb = await new BaseMedia(media.data).getThumbnail();

        Ui.inject(Store.elements.media, TP_list.item.render(media, thumb), 'beforeend');

        const button = document.querySelector(`.media-completed[data-uuid="${media.uuid}"]`);
        
        button.addEventListener('click', async () => {
            const preview = await MediaFactory.createPreviewComponent(media)
            
            Store.elements.media.style.display = 'none';

            const rekog = preview.media.getRekognitionResults();
            let types = Object.keys(rekog || {});
            
            types.forEach((type) => {
                const datas = [].concat(rekog[type]);

                datas.forEach((data) => {
                    if (type === AdBreak) {
                        Ui.download(data.key, media, preview);
                    }
                });
            });
        });
    },
    download: async (key, media, preview) => {
        let datapoints = await Ui.config(key, media)

        if (datapoints) {
            datapoints = await datapoints.Body.transformToString()
                .then((res) => JSON.parse(res));
        }
        
        datapoints = await Ui.parse(datapoints, media);

        Ui.editor.init(Store.elements.media, preview, media);
    },
    parse: async (data, media) => {
        const proxyBucket = media.getProxyBucket();
        const MAX_ADBREAKS = 30;
        let pauseBreaks = data[AdBreak];
        let prefix = data.framePrefix;
        
        if (prefix[prefix.length - 1] === '/') {
            prefix = prefix.slice(0, prefix.length - 1);
        }

        if (!Array.isArray(pauseBreaks) || pauseBreaks.length === 0) {
            return undefined;
        }

        pauseBreaks.sort((a, b) => b.weight - a.weight);

        pauseBreaks = pauseBreaks.slice(0, MAX_ADBREAKS);

        pauseBreaks.sort((a, b) => a.timestamp - b.timestamp);

        const promises = pauseBreaks.map((item, idx) => {
            const _item = item;
            const key = `${prefix}/${item.key}`;

            _item.breakNo = idx;

            return media.getNamedImageUrl(proxyBucket, key)
                .then((res) => {
                    _item.url = res.url;
                    return res;
                });
        });

        await Promise.all(promises);

        return pauseBreaks;
    
    },
    config: async (key, media) => {
        if (!key) {
            return undefined;
        }

        const s3utils = GetS3Utils();

        return s3utils.getObject(
            media.getProxyBucket(),
            key
        ).catch((event) => {
            console.error(
                'ERR:',
                'fail to download',
                key,
                event.message
            );
            return undefined;
        });
    },
    editor: {
        init: async (list, preview, media) => {
            Ui.inject(list.parentElement, TP_editor.container.render(), 'beforeend');
            Store.elements.editor = document.querySelector('#editor-');
            
            Store.elements.main = document.querySelector('#editor- .main');
            Store.elements.side = document.querySelector('#editor- .side');

            const main = Store.elements.main
            const side = Store.elements.side
            //Ui.inject(side, TP_editor.container.render(), 'beforeend');

            await main.appendChild(preview.container[0]);
            
            const editor = await preview.load();
            const info = await media.loadMediaInfo();
            
            console.log('FSLOG editor', media.getProxyBucket());

            Ui.editor.side(side, info, editor);
        },
        main: {
            video: {
                player: () => {
                    //create video
                },
                controls: {
                    //create controls
                }
            },
            tabs: {
                
            }
        },
        side: (side, info, editor) => {
            Ui.inject(side, TP_editor.side.info.render(editor.media.data), 'beforeend');

            Ui.inject(side, TP_editor.side.manage.container.render(info.media), 'beforeend');

            Ui.inject(side, TP_editor.side.list.container.render(info.media), 'beforeend');

            Infos.init(side)
            Filters.init(side);
            
        }
    }
}

export default Ui;