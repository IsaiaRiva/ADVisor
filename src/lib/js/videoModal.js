// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import AppUtils from './app/shared/appUtils.js';
import {
  GetS3Utils,
} from './app/shared/s3utils.js';

const MEDIA_TYPE = 'video/mp4';
const ADS = [
  './images/countdown5s_25fps.mp4',
  // './images/countdown_25fps.mp4',
  // './images/oceans_25fps.mp4',
];

export default class VideoModal {
  constructor(parent, item) {
    this.$parent = parent;
    this.$item = item;
    this.$vjs = undefined;
    this.$id = AppUtils.randomHexstring();
    this.$modal = $('<div/>')
      .addClass('modal fade')
      .attr('tabindex', -1)
      .attr('role', 'dialog')
      .attr('aria-labelledby', 'VideoModal')
      .attr('aria-hidden', true);
  }

  get parent() {
    return this.$parent;
  }

  get item() {
    return this.$item;
  }

  get vjs() {
    return this.$vjs;
  }

  set vjs(val) {
    this.$vjs = val;
  }

  get id() {
    return this.$id;
  }

  get breakOffset() {
    return this.item.breakOffset;
  }

  async show() {
    const modal = $('<div/>')
      .addClass('modal fade videomodal')
      .attr('tabindex', -1)
      .attr('role', 'dialog')
      .attr('aria-labelledby', 'VideoModal')
      .attr('aria-hidden', true);
    this.parent.append(modal);

    const dialog = $('<div/>')
      .addClass('modal-dialog modal-lg')
      .attr('role', 'document');
    modal.append(dialog);

    const content = $('<div/>')
      .addClass('modal-content')
      .css('border-radius', 0);
    dialog.append(content);

    const row = $('<div/>')
      .addClass('row no-gutters');
    content.append(row);

    const container = $('<div/>')
      .addClass('col-12 m-0 p-0');
    row.append(container);

    const id = `vjs-${this.id}`;
    const videoContainer = this.createVideoContainer(id);
    container.append(videoContainer);
    this.vjs = this.loadVideoJs(id);

    modal.on('hidden.bs.modal', async (event) => {
      this.parent.trigger('video:modal:hidden');
    });

    return modal.modal('show');
  }

  async destroy() {
    if (this.vjs) {
      this.vjs.dispose();
      this.vjs = undefined;
    }
    this.parent
      .find('div.videomodal')
      .remove();
  }

  createVideoContainer(id) {
    const container = $('<div/>')
      .addClass('video-container');

    const item = this.item;

    const video = $('<video/>')
      .addClass('video-js vjs-fluid w-100')
      .attr('id', id)
      .attr('controls', 'controls')
      .attr('preload', 'metadata')
      .attr('crossorigin', 'anonymous');
    video.ready(async () => {
      const s3utils = GetS3Utils();
      const poster = await s3utils.signUrl(item.bucket, item.imageKey);
      video.attr('poster', poster);
    });
    container.append(video);

    return container;
  }

  loadVideoJs(id) {
    /* create videoJS player */
    const vjs = videojs(id, {
      textTrackDisplay: {
        allowMultipleShowingTracks: true,
      },
      aspectRatio: '16:9',
      autoplay: true,
    });

    vjs.ready(async () => {
      const item = this.item;
      const s3utils = GetS3Utils();
      const signed = await s3utils.signUrl(item.bucket, item.videoKey);
      vjs.src({
        type: MEDIA_TYPE,
        src: signed,
      });

      const data = item.data;
      const breakAt = data.breakTimestamp;

      /* create Ad break VTT track to signal */
      console.log('breakOffset', this.breakOffset, 'breakAt', breakAt);
      const cue = this.createAdBreakCue(
        Math.max((breakAt + this.breakOffset), 0)
      );
      const remoteTrack = vjs.addRemoteTextTrack({
        kind: 'metadata',
        language: 'en',
        label: 'ad',
      }, false);

      remoteTrack.track.addCue(cue);
      remoteTrack.track.mode = 'hidden';

      const bindFn = this.onCueChange.bind(
        this,
        vjs,
        remoteTrack.track
      );
      remoteTrack.track.addEventListener(
        'cuechange',
        bindFn
      );

      let startTime = Math.round((breakAt - 10000) / 1000);
      startTime = Math.max(0, startTime);
      vjs.currentTime(startTime);
      vjs.volume(0.5);

      /* ads plugins */
      vjs.ads();
      vjs.on('contentchanged', () => {
        console.log('contentchanged');
        vjs.trigger('adsready');
      });
      vjs.on('readyforpreroll', () => {
        console.log('readyforpreroll');
        vjs.ads.startLinearAdMode();
        vjs.src(ADS[0]);

        vjs.one('adplaying', () => {
          console.log('adplaying');
          vjs.trigger('ads-ad-started');
        });

        vjs.one('adended', () => {
          vjs.ads.endLinearAdMode();
        });
      });
    });

    vjs.load();
    return vjs;
  }

  createAdBreakCue(breakAt) {
    return new window.vttjs.VTTCue(
      breakAt / 1000,
      (breakAt + 500) / 1000,
      'Ad'
    );
  }

  onCueChange(vjs, track, event) {
    vjs.trigger('adsready');

    console.log(
      'onCueChange:',
      vjs.currentTime()
    );
    if (track.activeCues && track.activeCues.length > 0) {
      const activeCue = track.activeCues[track.activeCues.length - 1];
      console.log(
        'activeCue:',
        activeCue,
        'at',
        activeCue.startTime
      );
    }
  }

  on(event, fn) {
    return this.parent.on(event, fn);
  }

  off(event) {
    return this.parent.off(event);
  }
}
