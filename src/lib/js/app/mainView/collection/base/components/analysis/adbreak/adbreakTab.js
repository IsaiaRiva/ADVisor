// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AnalysisTypes from '../../../../../../shared/analysis/analysisTypes.js';
import Localization from '../../../../../../shared/localization.js';
import Spinner from '../../../../../../shared/spinner.js';
import BaseAnalysisTab from '../base/baseAnalysisTab.js';
import Graph from './graph.js';

const {
  AdBreak,
} = AnalysisTypes;

const {
  Messages: {
    AdBreakTab: TITLE,
    AdBreakTabDesc: MSG_DESC,
    AdBreakGraphTitle: MSG_GRAPH_TITLE,
    AdBreakListTitle: MSG_LIST_TITLE,
    NoData: MSG_NO_DATA,
    AdBreakDetailTitle: MSG_BREAK_DETAIL_TITLE,
    AdBreakDetailDesc: MSG_BREAK_DETAIL_DESC,
  },
  Alerts: {
    NoAdBreakDetected: ERR_NO_ADBREAK,
  },
} = Localization;

const MAX_ADBREAKS = 30;

export default class AdBreakTab extends BaseAnalysisTab {
  constructor(previewComponent, data) {
    super(TITLE, previewComponent);
    this.$data = data;
    Spinner.useSpinner();
  }

  get data() {
    return this.$data;
  }

  async createContent() {
    const container = $('<div/>')
      .addClass('col-11 my-4 vh-50');

    container.ready(async () => {
      try {
        Spinner.loading();

        let datapoints = await this.download(this.data.key);
        if (datapoints) {
          datapoints = await datapoints.Body.transformToString()
            .then((res) =>
              JSON.parse(res));
        }

        // parse datapoints
        datapoints = await this.parseDatapoints(datapoints);

        const desc = this.createDescription();
        container.append(desc);

        const graphView = this.createGraphView(datapoints);
        container.append(graphView);

        const listView = this.createListView(datapoints);
        container.append(listView);
      } catch (e) {
        console.error(e);
      } finally {
        Spinner.loading(false);
      }
    });

    return container;
  }

  createDescription() {
    const section = $('<section/>')
      .addClass('col-10 mx-auto');

    const desc = $('<p/>')
      .addClass('lead-s')
      .append(MSG_DESC);
    section.append(desc);

    return section;
  }

  createGraphView(datapoints) {
    const section = $('<section/>')
      .addClass('col-10 mx-auto');

    const details = $('<details/>')
      .attr('open', '');
    section.append(details);

    const summary = $('<summary/>')
      .addClass('my-4');
    details.append(summary);

    const title = $('<span/>')
      .addClass('lead ml-2')
      .html(MSG_GRAPH_TITLE);
    summary.append(title);

    section.ready(async () => {
      try {
        if (datapoints === undefined) {
          const desc = $('<p/>')
            .addClass('lead-s text-muted')
            .append(ERR_NO_ADBREAK);
          details.append(desc);
        } else {
          // build graph
          const graph = await this.buildGraph(datapoints);
          details.append(graph.graphContainer);
        }
      } catch (e) {
        console.error(e);
      } finally {
        Spinner.loading(false);
      }
    });

    return section;
  }

  createListView(datapoints) {
    const section = $('<section/>')
      .addClass('col-10 mx-auto');

    const details = $('<details/>');
    section.append(details);

    const summary = $('<summary/>')
      .addClass('my-4');
    details.append(summary);

    const title = $('<span/>')
      .addClass('lead ml-2')
      .html(MSG_LIST_TITLE);
    summary.append(title);

    section.ready(async () => {
      try {
        if (datapoints === undefined) {
          const desc = $('<p/>')
            .addClass('lead-s text-muted')
            .append(ERR_NO_ADBREAK);
          details.append(desc);
        } else {
          // build the list
          const list = await this.buildList(datapoints);
          details.append(list);
        }
      } catch (e) {
        console.error(e);
      } finally {
        Spinner.loading(false);
      }
    });

    return section;
  }

  async parseDatapoints(data) {
    const proxyBucket = this.media.getProxyBucket();
    let pauseBreaks = data[AdBreak];

    let prefix = data.framePrefix;
    if (prefix[prefix.length - 1] === '/') {
      prefix = prefix.slice(0, prefix.length - 1);
    }

    if (!Array.isArray(pauseBreaks) || pauseBreaks.length === 0) {
      return undefined;
    }

    pauseBreaks.sort((a, b) =>
      b.weight - a.weight);

    console.log(pauseBreaks.map((x) => x.weight));

    pauseBreaks = pauseBreaks.slice(0, MAX_ADBREAKS);

    pauseBreaks.sort((a, b) =>
      a.timestamp - b.timestamp);

    const promises = pauseBreaks.map((item, idx) => {
      const _item = item;

      _item.breakNo = idx;

      const key = `${prefix}/${item.key}`;
      return this.media.getNamedImageUrl(proxyBucket, key)
        .then((res) => {
          _item.url = res.url;
          return res;
        });
    });

    await Promise.all(promises);

    return pauseBreaks;
  }

  async buildGraph(datapoints) {
    const graph = new Graph(this.previewComponent, datapoints);

    return graph;
  }

  async buildList(datapoints) {
    const container = $('<div/>')
      .addClass('col-12 p-0 m-0')
      .css('aspect-ratio', '7/2');

    if ((datapoints || []).length === 0) {
      const noData = $('<p/>')
        .addClass('lead-s text-muted')
        .append(MSG_NO_DATA);

      container.append(noData);
      return container;
    }

    // frame list
    const frameListContainer = $('<div/>')
      .addClass('no-gutters d-flex overflow-auto');
    container.append(frameListContainer);

    // ad break information
    const adbreakInfoContainer = $('<div/>')
      .addClass('row no-gutters mt-4');
    container.append(adbreakInfoContainer);

    const imageContainers = datapoints.map((item) => {
      const imageContainer = $('<div/>')
        .addClass('thumbnail opacity10 d-inline-flex m-3')
        .addClass('image-container')
        .css('aspect-ratio', '16/9')
        .data('item', item);

      const image = $('<img/>')
        .addClass('w-100')
        .attr('src', item.url);
      imageContainer.append(image);

      const overlay = $('<div/>')
        .addClass('overlay-top-left');
      imageContainer.append(overlay);

      let text = `#${item.breakNo}`;
      text = $('<span/>')
        .addClass('badge badge-dark border-radius-none')
        .addClass('lead-sm b-200')
        .append(text);
      overlay.append(text);

      // event handlings
      imageContainer.on('click', async (event) => {
        event.preventDefault();
        this.previewComponent.seek(item.timestamp / 1000);

        adbreakInfoContainer.children().remove();

        // ad break description
        const adbreakDescView = $('<div/>')
          .addClass('col-6 m-0 p-0')
          .addClass('lead-s')
          .addClass('overflow-auto')
          .css('height', '32rem');
        adbreakInfoContainer.append(adbreakDescView);

        const title = $('<p/>')
          .addClass('b-400')
          .append(MSG_BREAK_DETAIL_TITLE);
        adbreakDescView.append(title);

        let breakType = 'before';
        if (item.breakType === 'SCENE_END') {
          breakType = 'after';
        }

        const descText = MSG_BREAK_DETAIL_DESC
          .replace('{{BREAK_NO}}', item.breakNo)
          .replace('{{SMPTE_TIMESTAMP}}', item.smpteTimestamp)
          .replace('{{BREAK_TYPE}}', breakType)
          .replace('{{SCENE_NO}}', item.scene.sceneNo)
          .replace('{{MOMENTARY}}', item.momentary.toFixed(2))
          .replace('{{PAUSE_DURATION}}', (item.pause.pauseDuration / 1000).toFixed(2))
          .replace('{{CONTEXTUAL_DISTANCE}}', item.contextual.distance.toFixed(3));
        const desc = $('<p/>')
          .addClass('b-300 mr-4')
          .append(descText);
        adbreakDescView.append(desc);
        // contextual before
        const contextualBefore = $('<p/>')
          .addClass('b-300 mr-4')
          .append('Contextual categories before the ad break:');
        adbreakDescView.append(contextualBefore);
        if (item.contextual.before.length === 0) {
          const none = $('<p/>')
            .append('None');
          adbreakDescView.append(none);
        } else {
          const ul = $('<ul/>')
            .addClass('lead-s b-300');
          adbreakDescView.append(ul);
          item.contextual.before.forEach((category) => {
            const li = $('<li/>')
              .append(category);
            ul.append(li);
          });
        }

        // contextual before
        const contextualAfter = $('<p/>')
          .addClass('b-300 mr-4')
          .append('Contextual categories after the ad break:');
        adbreakDescView.append(contextualAfter);
        if (item.contextual.after.length === 0) {
          const none = $('<p/>')
            .append('None');
          adbreakDescView.append(none);
        } else {
          const ul = $('<ul/>')
            .addClass('lead-s b-300');
          adbreakDescView.append(ul);
          item.contextual.after.forEach((category) => {
            const li = $('<li/>')
              .append(category);
            ul.append(li);
          });
        }

        // json view
        const adbreakJsonView = $('<div/>')
          .addClass('col-6 m-0 p-0 bg-dark')
          .addClass('overflow-auto')
          .css('height', '32rem');
        adbreakInfoContainer.append(adbreakJsonView);

        const jsonData = $('<pre/>')
          .addClass('lead-xs text-white p-2')
          .append(JSON.stringify(item, null, 2));
        adbreakJsonView.append(jsonData);
      });

      return imageContainer;
    });
    frameListContainer.append(imageContainers);

    return container;
  }
}
