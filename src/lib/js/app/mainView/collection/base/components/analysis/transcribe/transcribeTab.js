// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import mxAlert from '../../../../../../mixins/mxAlert.js';
import Localization from '../../../../../../shared/localization.js';
import VideoPreview from '../../../../../../shared/media/preview/videoPreview.js';
import Spinner from '../../../../../../shared/spinner.js';
import BaseAnalysisTab from '../base/baseAnalysisTab.js';

const {
  Messages: {
    TranscribeTab: TITLE,
    SubtitleSwitch: MSG_SUBTITLE_SWITCH,
    ShowTranscript: MSG_SHOW_TRANSCRIPT,
  },
} = Localization;
const {
  Constants: {
    Subtitle,
  },
  Events: {
    Track: {
      Loaded: TRACK_LOADED_EVENT,
    },
  },
} = VideoPreview;

export default class TranscribeTab extends mxAlert(BaseAnalysisTab) {
  constructor(previewComponent) {
    super(TITLE, previewComponent);
    Spinner.useSpinner();
  }

  async createContent() {
    const container = $('<div/>')
      .addClass('col-11 my-4 max-h36r');

    // subtitle switch
    const subtitleSwitch = this.createSubtitleSwitch();
    container.append(subtitleSwitch);

    // Transcript
    const transcriptView = this.createTranscriptView();
    container.append(transcriptView);

    return container;
  }

  createSubtitleSwitch() {
    const formGroup = $('<div/>')
      .addClass('form-group px-0 mt-2 mb-2');

    const inputGroup = $('<div/>')
      .addClass('input-group');
    formGroup.append(inputGroup);

    const label = $('<label/>')
      .addClass('xs-switch');
    inputGroup.append(label);

    const on = this.previewComponent.trackIsEnabled(Subtitle);
    const input = $('<input/>')
      .attr('type', 'checkbox')
      .attr('data-category', 'transcribe')
      .attr('data-type', 'subtitle')
      .attr('checked', on);
    label.append(input);

    const xslider = $('<span/>')
      .addClass('xs-slider round');
    label.append(xslider);

    const subtitleDesc = $('<span/>')
      .addClass('lead ml-2')
      .html(MSG_SUBTITLE_SWITCH);
    inputGroup.append(subtitleDesc);

    // event handling
    input.on('click', async (event) => {
      const checked = input.prop('checked');
      await this.previewComponent.trackToggle(Subtitle, checked);
    });

    return formGroup;
  }

  createTranscriptView() {
    const details = $('<details/>')
      .attr('open', '');

    const summary = $('<summary/>')
      .addClass('my-4');
    details.append(summary);

    let languageCode = this.previewComponent.media.getTranscribeResults();
    languageCode = (languageCode || {}).languageCode;

    let title = MSG_SHOW_TRANSCRIPT
      .replace('{{LANGUAGECODE}}', languageCode);

    title = $('<span/>')
      .addClass('lead ml-2')
      .html(title);
    summary.append(title);

    const view = this.previewComponent.getSubtitleView();
    details.append(view);

    // event handling
    view.on(TRACK_LOADED_EVENT, (event, track) => {
      /*
      if (this.previewComponent.trackIsSub(track)) {
        input.prop('checked', true);
      }
      */
    });

    return details;
  }
}
