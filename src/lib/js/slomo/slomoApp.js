import SolutionManifest from '/solution-manifest.js';
import mxReadable from '../app/mixins/mxReadable.js';
import {
  GetS3Utils,
} from '../app/shared/s3utils.js';
import {
  GetUserSession,
} from '../app/shared/cognito/userSession.js';

const {
  Cognito: {
    Group: {
      Admin,
    },
  },
  Proxy: {
    Bucket: PROXY_BUCKET,
  },
} = SolutionManifest;

const COPYRIGHT = 'copyright &copy; 2023';
const DEMO_TITLE = 'Super Slow Motion Video Gallery';
const DEMO_DESC = 'This Super slow motion video creation demo showcases the ability to use <code>Amazon SageMaker JumpStart</code> with open source machine learning models (<code>DAIN</code> and <code>FILM</code>) to create a visually compelling super slow motion video from a normal framerate video file. These machine learning models use techniques to identify the depth and occlusion of the image and share the depth features across all original frames. The process of interpolating frames becomes depth-aware producing high quality of slow motion video.<br><br>This demonstration focuses on how our partners and customers can easily adapt state of the art open source machine learning models and algorithms, using Amazon SageMaker JumpStart, to innovate. For further information, contact AWS Media & Entertainment team.';

const PREFIX_CONTENT = './src/lib/js/slomo';
const GENERIC_CONTENTS = `${PREFIX_CONTENT}/content.json`;
const RESTRICTED_CONTENTS = `${PREFIX_CONTENT}/restricted-content.json`;

export default class SloMoApp extends mxReadable(class {}) {
  constructor(parentId) {
    super();

    const session = GetUserSession();
    this.$canAccessRestrictedContent = (session.assignedGroup === Admin);

    this.$container = $('<div/>')
      .addClass('col-12 m-0 p-0');
    $(parentId)
      .append(this.$container);
  }

  get container() {
    return this.$container;
  }

  get canAccessRestrictedContent() {
    return this.$canAccessRestrictedContent;
  }

  async loadContentJson() {
    let promises = [];

    promises.push(fetch(GENERIC_CONTENTS)
      .then((res) =>
        res.json()));

    if (this.canAccessRestrictedContent) {
      promises.push(fetch(RESTRICTED_CONTENTS)
        .then((res) =>
          res.json()));
    }

    promises = await Promise.all(promises);
    promises = promises.flat(1);

    return promises;
  }

  async show() {
    this.container
      .ready(async () => {
        const contents = await this.loadContentJson();

        const title = this.createTitle();
        this.container.append(title);

        const slomoSection = this.createSloMoSection(contents);
        this.container.append(slomoSection);

        const copyrightContainer = $('<div/>')
          .addClass('my-4');
        this.container.append(copyrightContainer);

        const copyright = $('<p/>')
          .addClass('mt-4 text-center text-muted')
          .append(COPYRIGHT);
        copyrightContainer.append(copyright);
      });
    return this;
  }

  async hide() {
    return this;
  }

  createTitle() {
    const container = $('<div/>')
      .addClass('col-12')
      .addClass('bg-dark text-white');

    const rowContainer = $('<div/>')
      .addClass('row no-gutters');
    container.append(rowContainer);

    const titleContainer = $('<div/>')
      .addClass('col-9')
      .addClass('mx-auto py-4 text-center');
    rowContainer.append(titleContainer);

    const title = $('<h4/>')
      .append(DEMO_TITLE);
    titleContainer.append(title);

    const desc = $('<p/>')
      .addClass('my-4')
      .addClass('font-weight-light font-italic')
      .append(DEMO_DESC);
    titleContainer.append(desc);

    const specialThanks = $('<p/>')
      .addClass('mt-2')
      .addClass('font-weight-light font-italic')
      .append('~~~ SPECIAL THANKS to <code>New York Islanders</code> and <code>Supercross</code> for demo content ~~~');
    titleContainer.append(specialThanks);

    // logout
    const logoutContainer = $('<div/>')
      .addClass('ml-auto py-2 text-center');
    rowContainer.append(logoutContainer);

    const session = GetUserSession();
    const btnLogout = $('<button/>')
      .addClass('btn btn-sm btn-link text-white')
      .attr('type', 'button')
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'bottom')
      .attr('title', `${(session || {}).username}, ready to logout?`)
      .css('font-size', '1rem')
      .tooltip({
        trigger: 'hover',
      });
    logoutContainer.append(btnLogout);

    const icon = $('<i/>')
      .addClass('fas fa-user-circle')
      .css('font-size', '2rem');
    btnLogout.append(icon);

    // event handlings
    btnLogout.on('click', async () => {
      await session.signOut();
      return window.location.reload();
    });

    return container;
  }

  createSloMoSection(contents) {
    const bg = [
      'bg-white',
      'bg-light',
    ];

    const sections = contents
      .map((item, idx) => {
        const bgcolor = bg[idx % 2];
        const section = $('<section/>')
          .addClass(bgcolor);

        const details = $('<details/>')
          .addClass('col-10 mx-auto');
        section.append(details);

        const summary = $('<summary/>')
          .addClass('my-4')
          .text(item.title);
        details.append(summary);

        const clipContainer = $('<div/>')
          .addClass('row no-gutters');
        details.append(clipContainer);

        const nClips = item.clips.length;
        let colSize = 12 / nClips;
        colSize = Math.round(Math.min(6, colSize));

        const elements = [];

        const clipItems = item.clips
          .map((clip) => {
            const itemContainer = $('<div/>')
              .addClass(`col-${colSize} m-0 p-0 pl-1`);

            const caption = $('<p/>')
              .addClass('lead-m text-center mb-1')
              .append(clip.caption);
            itemContainer.append(caption);

            const video = $('<video/>')
              .addClass('m-0 p-0')
              .addClass('w-100')
              .css('aspect-ratio', '16 / 9')
              .attr('controls', 'controls')
              .attr('crossorigin', 'anonymous')
              .attr('preload', 'metadata');
            itemContainer.append(video);

            elements.push({
              el: video,
              playbackRate: clip.playbackRate,
            });

            video.ready(async () => {
              const bucket = PROXY_BUCKET;
              const key = clip.key;

              const s3utils = GetS3Utils();

              const src = await s3utils.signUrl(bucket, key);
              video.attr('src', src);

              video[0].muted = true;
            });
            return itemContainer;
          });

        clipContainer.append(clipItems);

        // form group
        const formGroup = $('<form/>')
          .addClass('form-inline')
          .addClass('m-0 p-0 mx-auto mt-2 mb-4');
        clipContainer.append(formGroup);

        const btnPlayOriginal = $('<button/>')
          .addClass('btn btn-outline-dark')
          .addClass('mr-1')
          .attr('type', 'button')
          .append('Play video in normal speed (L)');
        formGroup.append(btnPlayOriginal);

        const btnPlayBoth = $('<button/>')
          .addClass('btn btn-success')
          .append('Play both videos in slow motion (L & R)');
        formGroup.append(btnPlayBoth);

        // event handling
        formGroup.submit((event) => {
          event.preventDefault();
        });

        btnPlayOriginal.on('click', () => {
          const _video = elements[0].el[0];
          if (_video.paused) {
            _video.currentTime = 0;
            _video.playbackRate = 1.0;
            _video.play();
          }
          btnPlayOriginal.blur();
          return false;
        });

        btnPlayBoth.on('click', () => {
          elements.forEach((x) => {
            const _video = x.el[0];
            _video.currentTime = 0;
            if (x.playbackRate !== undefined) {
              _video.playbackRate = x.playbackRate;
            }
            _video.play();
          });
          btnPlayBoth.blur();
          return false;
        });

        return section;
      });

    return sections;
  }
}
