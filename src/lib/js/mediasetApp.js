import mxReadable from './app/mixins/mxReadable.js';
import {
  GetS3Utils,
} from './app/shared/s3utils.js';
import AppUtils from './app/shared/appUtils.js';
import VideoModal from './videoModal.js';

const TITLE = 'Content deep analysis (Ad placement)';

const PAUSEBREAK_JSON_FILES = [
  'Goliath_1080p_20m_qvbr9.json',
  'VIOLA COME IL MARE 2_F311391401000201.json',
  'AMICI DI MARIA 21 22 DOMENICA POMERIGGIO 16_F311329401001601.json',
  'IENE SHOW PRIM 22 LE  14_F311678901001401.json',
  'BEAUTIFUL XXXII _ 8723 BEAUTIFUL XXXII_F311500301008304.json',
  'TG5_27042023.json',
  'Murgia_UominiEDonne.json',
];

const SEGMENT_CATEGORIES = [
  'Shots',
  'TechnicalCues',
];
const SEGMENT_TYPES = [
  {
    name: 'ColorBars',
    color: '#f0ad4e',
  },
  {
    name: 'EndCredits',
    color: '#0275d8',
  },
  {
    name: 'BlackFrames',
    color: '#292b2c',
  },
  {
    name: 'OpeningCredits',
    color: '#0275d8',
  },
  {
    name: 'StudioLogo',
    color: '#dc77dc',
  },
  {
    name: 'Slate',
    color: '#72b362',
  },
  {
    name: 'Content',
    color: '#5cb85c',
  },
  {
    name: 'SHOT',
    color: '#5bc0de',
  },
];

const DRIFT_OFFSET = 0;
const DRIFT_DESC = 'Drift offset';
const DRIFT_TOOLTIP = 'Less than 0 means moves the Ad break X ms earlier; greater than 0 means delay the Ad break by X ms';
const DOT_SIZE = 40;

export default class MediasetApp extends mxReadable(class {}) {
  constructor(parentId) {
    super();
    this.$container = $('<div/>')
      .addClass('col-12 mx-auto');
    $(parentId).append(this.$container);
    this.$dataset = undefined;
    this.$graphs = [];
    this.$selected = undefined;
    this.$driftOffset = DRIFT_OFFSET;
  }

  get container() {
    return this.$container;
  }

  get graphs() {
    return this.$graphs;
  }

  get dataset() {
    return this.$dataset;
  }

  set dataset(val) {
    this.$dataset = val;
  }

  get bucket() {
    return ((this.dataset || {}).asset || {}).bucket;
  }

  get framePrefix() {
    return ((this.dataset || {}).asset || {}).framePrefix;
  }

  get videoKey() {
    return ((this.dataset || {}).asset || {}).videoKey;
  }

  get driftOffset() {
    return this.$driftOffset;
  }

  set driftOffset(val) {
    this.$driftOffset = Number(val);
  }

  async show() {
    this.container
      .ready(async () => {
        let desc = $('<h4/>')
          .addClass('mx-auto my-4 text-center')
          .append(TITLE);
        this.container.append(desc);

        desc = $('<p/>')
          .addClass('text-muted mx-auto mb-4 text-center col-8')
          .append('Analyzing content using audio and video frame properties such as loudness, color, brightness, & perceptual hash');
        this.container.append(desc);

        const controls = this.createControls();
        this.container.append(controls);
      });
    return this;
  }

  async hide() {
    return this;
  }

  async buildGraphs(json) {
    await this.removeGraphs();
    if (json === undefined) {
      return;
    }

    [
      // pause breaks
      {
        title: 'Potential Ad placement slots',
        data: json,
        fn: this.makeAdGraphOptions.bind(this),
        events: [{
          name: 'click',
          query: 'series',
          fn: this.onScatterGraphDatapoint.bind(this),
        }],
      },
      /*
      // loudness LUFS
      {
        title: 'Short term / momentary loudness LUFS',
        data: json.lufs,
      },
      // loudness changes
      {
        title: 'Short term / momentary loudness changes over time',
        data: {
          shortTerm: json.shortTerm,
          momentary: json.momentary,
        },
      },
      // color changes
      {
        title: 'Color changes over time',
        data: {
          color: json.color,
          fgColor: json.fgColor,
          bgColor: json.bgColor,
        },
      },
      // intensity
      {
        title: 'Brightness / sharpness changes over time',
        data: {
          brightness: json.brightness,
          fgBrightness: json.fgBrightness,
          bgBrightness: json.bgBrightness,
          sharpness: json.sharpness,
          fgSharpness: json.fgSharpness,
          bgSharpness: json.bgSharpness,
        },
      },
      // pHash
      {
        title: 'Perceptual hash changes over time',
        data: {
          hash: json.hash,
        },
      },
      // shots
      {
        title: 'Shots and technical cues over time',
        data: {
          technicalCues: json.technicalCues,
          shots: json.shots,
        },
        fn: this.makeCustomGraphOptions.bind(this),
      },
      */
    ].forEach(async (x, idx) => {
      let bg = 'bg-light';
      if (idx % 2 === 0) {
        bg = 'bg-white';
      }
      const section = $('<section/>')
        .addClass('graph-section')
        .addClass('col-12')
        .addClass(bg)
        .addClass('my-4');
      this.container.append(section);

      const desc = $('<p/>')
        .addClass('lead text-center')
        .append(x.title);
      section.append(desc);

      const graph = await this.createGraph(x.data, x.fn, x.events);

      section.append(graph);
    });
  }

  async removeGraphs() {
    this.graphs
      .forEach((graph) =>
        graph.dispose());

    this.container
      .find('.graph-section')
      .remove();
  }

  async createGraph(dataset, fn, events = []) {
    const graphContainer = $('<div/>')
      .addClass('mx-auto')
      .css('width', '90%');

    graphContainer.ready(async () => {
      let options;
      if (typeof fn === 'function') {
        options = await fn(dataset);
      } else {
        options = this.makeGraphOptions(dataset);
      }
      /* adjust aspect ratio */
      let aspectRatio = '2 / 1';
      if (options.singleAxis !== undefined) {
        aspectRatio = '4 / 1';
      }
      graphContainer
        .css('aspect-ratio', aspectRatio);

      const graph = echarts.init(graphContainer[0]);
      graph.setOption(options);
      /* register event handlings */
      events.forEach((x) => {
        graph.on(x.name, x.query, (event) =>
          x.fn(graph, event));
      });
      /* store graph */
      this.graphs.push(graph);
    });
    return graphContainer;
  }

  makeGraphOptions(dataset) {
    const keys = Object.keys(dataset);
    const legend = {
      type: 'scroll',
      orient: 'horizontal',
      data: keys
        .map((x) => ({
          name: x,
        })),
    };
    const grid = {
      containLabel: true,
      show: true,
    };
    const xAxis = {
      /*
      type: 'value',
      data: dataset[keys[0]]
        .map((x, idx) =>
          idx),
      */
    };
    const yAxis = {
      type: 'value',
      /*
      scale: true,
      axisLabel: {
        formatter: '{value}',
      },
      splitLine: {
        show: true,
      },
      min: 0,
      interval: 0.1,
      */
    };
    const tooltip = {
      show: true,
      trigger: 'item',
      formatter: ((x) => {
        if (x.componentType === 'markArea') {
          return x.name;
        }
        return `<span style="color:${x.color}">${x.seriesName}</span> ${x.value[1].toFixed(2)} at ${x.value[0]}s`;
      }),
    };

    const total = dataset[keys[0]].length;
    const percent = Math.round((300 / total) * 100);
    const dataZoom = [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: percent,
        minValueSpan: 1,
      },
    ];
    const markArea = {
      data: [
        [
          {
            name: 'Between 0.6 and 0.8',
            yAxis: 0.6,
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.2)',
            },
          },
          {
            yAxis: 0.8,
          },
        ],
        [
          {
            name: 'Above 0.8',
            yAxis: 0.8,
            itemStyle: {
              color: 'rgba(220, 53, 69, 0.2)',
            },
          },
          {
            yAxis: 1,
          },
        ],
        [
          {
            name: 'Quiet (below -50)',
            yAxis: -50,
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.2)',
            },
          },
          {
            yAxis: -60,
          },
        ],
        [
          {
            name: 'Silence (below -60)',
            yAxis: -60,
            itemStyle: {
              color: 'rgba(220, 53, 69, 0.2)',
            },
          },
          {
            yAxis: -400,
          },
        ],
      ],
    };

    const series = keys
      .map((x) => ({
        name: x,
        type: 'line',
        large: true,
        largeThreshold: 5000,
        markArea,
        data: dataset[x]
          .map((d, idx) => ([
            idx,
            d,
          ])),
      }));

    return {
      legend,
      grid,
      xAxis,
      yAxis,
      tooltip,
      dataZoom,
      series,
    };
  }

  makeCustomGraphOptions(dataset) {
    let maxTime = 0;
    const data = [
      'shots',
      'technicalCues',
    ].map((cat, catIdx) =>
      dataset[cat]
        .map((x) => {
          const typeItem = SEGMENT_TYPES
            .find((x0) =>
              x0.name === x.type);
          if (x.endTime > maxTime) {
            maxTime = x.endTime;
          }
          return {
            name: typeItem.name,
            value: [
              catIdx,
              x.startTime,
              x.endTime,
              x.duration,
            ],
            itemStyle: {
              normal: {
                color: typeItem.color,
              },
            },
          };
        }))
      .flat(1);

    const xAxis = {
      min: 0,
      scale: true,
      axisLabel: {
        // rotate: 45,
        formatter: (x) =>
          `${MediasetApp.readableDuration(Math.max(0, x - 0))}`,
      },
    };
    const yAxis = {
      data: SEGMENT_CATEGORIES,
    };
    const grid = {
      height: 300,
    };
    const tooltip = {
      formatter: (params) =>
        `${params.marker}${params.name}: ${MediasetApp.readableDuration(params.value[1])} / ${MediasetApp.readableDuration(params.value[2])} (${(params.value[3] / 1000).toFixed(2)}s)`,
    };
    const percent = 40;
    const dataZoom = [
      {
        type: 'slider',
        filterMode: 'weakFilter',
        showDataShadow: false,
        top: 400,
        labelFormatter: '',
        start: 0,
        end: percent,
        minValueSpan: 1,
        zoomLock: false,
      },
      {
        type: 'inside',
        filterMode: 'weakFilter',
        zoomLock: true,
      },
    ];
    const renderItem = (params, api) => {
      const categoryIdx = api.value(0);
      const start = api.coord([
        api.value(1),
        categoryIdx,
      ]);
      const end = api.coord([
        api.value(2),
        categoryIdx,
      ]);
      const height = api.size([0, 1])[1] * 0.4;
      const rectShape = echarts.graphic.clipRectByRect(
        {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height,
        },
        {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height,
        }
      );
      return (
        rectShape && {
          type: 'rect',
          transition: [
            'shape',
          ],
          shape: rectShape,
          style: api.style(),
        }
      );
    };

    const series = [
      {
        type: 'custom',
        renderItem,
        itemStyle: {
          opacity: 0.8,
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data,
      },
    ];

    return {
      xAxis,
      yAxis,
      grid,
      tooltip,
      dataZoom,
      series,
    };
  }

  makeAdGraphOptions(dataset) {
    const singleAxis = {
      type: 'value',
      min: 0,
      bottom: '30%',
      scale: true,
      height: '80%',
      axisLabel: {
        // rotate: 45,
        formatter: (datapoint) =>
          `${MediasetApp.readableDuration(Math.max(0, datapoint - 0))}`,
      },
    };
    const percent = 30;
    const dataZoom = [
      {
        type: 'slider',
        show: true,
        singleAxisIndex: 0,
        start: 0,
        end: percent,
        minValueSpan: 1,
        bottom: '10%',
        labelFormatter: (datapoint) =>
          `${MediasetApp.readableDuration(Math.max(0, datapoint - 0))}`,
      },
    ];
    const tooltip = {
      position: 'top',
      formatter: (datapoint) => {
        /* show image thumbnail */
        const data = datapoint.value[3];
        const container = $('<div/>')
          .addClass('graph-tooltip')
          .css('width', '16rem');

        const img = $('<img/>')
          .attr('crossorigin', 'anonymous')
          .attr('src', data.url);
        container.append(img);

        const table = $('<table/>');
        container.append(table);

        const tbody = $('<tbody/>');
        table.append(tbody);

        let rows = [];
        rows.push({
          name: 'Weight',
          val: data.weight.toFixed(2),
        });
        rows.push({
          name: 'Break type',
          val: data.breakType,
        });
        rows.push({
          name: 'Loudness (moment.)',
          val: (data.loudness && data.loudness.momentary)
            ? `${data.loudness.momentary.toFixed(2)} LUFS`
            : '--',
        });
        rows.push({
          name: '&#916; Color (min/max)',
          val: (data.distances.color)
            ? `${data.distances.color.min.toFixed(2)} / ${data.distances.color.max.toFixed(2)}`
            : '--',
        });
        rows.push({
          name: '&#916; FGcolor (min/max)',
          val: (data.distances.fgColor)
            ? `${data.distances.fgColor.min.toFixed(2)} / ${data.distances.fgColor.max.toFixed(2)}`
            : '--',
        });
        rows.push({
          name: '&#916; BGcolor (min/max)',
          val: (data.distances.bgColor)
            ? `${data.distances.bgColor.min.toFixed(2)} / ${data.distances.bgColor.max.toFixed(2)}`
            : '--',
        });
        rows.push({
          name: '&#916; P-hash (min/max)',
          val: (data.distances.hash)
            ? `${(1 - data.distances.hash.min).toFixed(2)} / ${(1 - data.distances.hash.max).toFixed(2)}`
            : '--',
        });
        rows = rows.map((row) =>
          $('<tr/>')
            .addClass('lead-xxs')
            .append($('<td/>')
              .append(row.name))
            .append($('<td/>')
              .addClass('px-2')
              .append(row.val)));
        tbody.append(rows);

        return container.prop('outerHTML');
      },
    };

    let datapoints = dataset.pauseBreaks
      .map((pauseBreak) =>
        pauseBreak.shots)
      .flat(1)
      .filter((shot) =>
        shot !== undefined);

    datapoints
      .sort((a, b) =>
        b.weight - a.weight);

    if (datapoints.length > 30) {
      datapoints = datapoints.slice(0, 30);
    }

    const data = datapoints
      .map((datapoint) => ([
        datapoint.breakTimestamp,
        datapoint.weight * DOT_SIZE,
        this.randomRGB(0.7),
        datapoint,
      ]));

    const series = [];
    series.push({
      type: 'scatter',
      singleAxisIndex: 0,
      coordinateSystem: 'singleAxis',
      data,
      symbolSize: (datapoint) =>
        datapoint[1] * 4,
      itemStyle: {
        color: (datapoint) =>
          datapoint.value[2],
      },
    });

    return {
      dataZoom,
      singleAxis,
      tooltip,
      series,
    };
  }

  onScatterGraphDatapoint(graph, event) {
    console.log('event', event);
    const data = event.data[3];

    this.showPreview({
      bucket: this.bucket,
      videoKey: this.videoKey,
      imageKey: data.frameKey,
      breakOffset: this.driftOffset,
      data,
    });
  }

  getFrameKey(data) {
    let frameKey = Math.round(data.breakTimestamp / 1000);
    frameKey = String(frameKey).padStart(7, '0');
    frameKey = `frame.${frameKey}.jpg`;
    frameKey = `${this.framePrefix}${frameKey}`;
    return frameKey;
  }

  randomRGB(opacity = 1) {
    const r = Math.floor(Math.random() * 255)
      .toString(16)
      .toUpperCase()
      .padStart(2, '0');
    const g = Math.floor(Math.random() * 255)
      .toString(16)
      .toUpperCase()
      .padStart(2, '0');
    const b = Math.floor(Math.random() * 255)
      .toString(16)
      .toUpperCase()
      .padStart(2, '0');
    const o = Math.round(Math.min(opacity, 1) * 255)
      .toString(16)
      .toUpperCase()
      .padStart(2, '0');

    return `#${r}${g}${b}${o}`;
  }

  buildAdPlacementList(dataset) {
    this.container.find('section.adplacement-list')
      .remove();

    const section = $('<section/>')
      .addClass('adplacement-list')
      .addClass('col-12')
      .addClass('bg-light')
      .addClass('my-2');
    this.container.append(section);

    const desc = $('<p/>')
      .addClass('lead text-center')
      .append('Selected Ad placement opportunities');
    section.append(desc);

    const breaks = dataset.speechBreaks;
    const ads = dataset.ads;

    for (let i = 0; i < breaks.length; i += 1) {
      const breakShotStart = breaks[i].withShots[0];
      const breakShotEnd = breaks[i].withShots[breaks[i].withShots.length - 1];
      [
        'fgColor',
        'bgColor',
        'fgBrightness',
        'bgBrightness',
        'fgSharpness',
        'bgSharpness',
      ].forEach((type) => {
        const indexes = Object.keys(ads[type]);
        for (let j = 0; j < indexes.length; j += 1) {
          const shotIdx = Number(indexes[j]);
          if (shotIdx > breakShotEnd) {
            break;
          }
          if (shotIdx < breakShotStart) {
            continue;
          }
          if (shotIdx >= breakShotStart && shotIdx <= breakShotEnd) {
            breaks[i].events = breaks[i].events || [];
            breaks[i].events.push({
              type,
              index: shotIdx,
            });
          }
        }
      });
    }

    let opps = breaks
      .filter((x) =>
        x.events && x.events.length > 0);

    opps = opps.sort((a, b) =>
      b.duration - a.duration);

    const listContainer = $('<div/>')
      .addClass('row no-gutters mt-4');
    section.append(listContainer);

    const items = opps
      .map((x) =>
        this.createVideoListItem(
          x,
          this.bucket,
          this.videoKey,
          this.framePrefix
        ));
    listContainer.append(items);
  }

  createControls() {
    const container = $('<div/>')
      .addClass('row no-gutters')
      .addClass('col-12');

    const formContainer = $('<div/>')
      .addClass('form-inline col-9 mx-auto');
    container.append(formContainer);

    const selectOption = this.createSelectOption();
    formContainer.append(selectOption);

    const driftSlider = this.createDriftSlider();
    formContainer.append(driftSlider);

    return container;
  }

  createSelectOption() {
    const container = $('<div/>')
      .addClass('form-group')
      .addClass('col-6');

    const select = $('<select/>')
      .addClass('custom-select')
      .addClass('col-12')
      .append($('<option/>')
        .attr('selected', 'selected')
        .attr('value', 'undefined')
        .append('Choose content to analyze...'));
    container.append(select);

    const options = PAUSEBREAK_JSON_FILES
      .map((x) =>
        $('<option/>')
          .attr('value', x)
          .append(x));
    select.append(options);

    select.on('change', async () => {
      const val = select.val();
      if (val === 'undefined') {
        this.dataset = undefined;
        await this.removeGraphs();
      } else {
        const dataFile = `./src/lib/js/${val}`;
        let data = await fetch(dataFile);
        data = await data.text();
        data = JSON.parse(data);

        // presign frame url
        const s3utils = GetS3Utils();
        const bucket = data.asset.bucket;
        const framePrefix = data.asset.framePrefix;
        await Promise.all(data.pauseBreaks
          .map((pauseBreak) =>
            pauseBreak.shots)
          .flat(1)
          .map((shot) => {
            let frameKey = Math.round(shot.breakTimestamp / 1000);
            frameKey = String(frameKey).padStart(7, '0');
            frameKey = `frame.${frameKey}.jpg`;
            frameKey = `${framePrefix}${frameKey}`;
            shot.frameKey = frameKey; // eslint-disable-line
            return s3utils.signUrl(bucket, frameKey)
              .then((res) => {
                shot.url = res; // eslint-disable-line
                return res;
              });
          }));

        this.dataset = data;

        await this.buildGraphs(this.dataset);
      }
    });

    return container;
  }

  createDriftSlider() {
    const container = $('<div/>')
      .addClass('form-group')
      .addClass('col-6');

    const id = AppUtils.randomHexstring();
    const slideId = `slider-${id}`;
    const label = $('<label/>')
      .addClass('col-3')
      .css('justify-content', 'right')
      .attr('for', slideId)
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'bottom')
      .attr('title', DRIFT_TOOLTIP)
      .html(DRIFT_DESC);
    label.tooltip({
      trigger: 'hover',
    });
    container.append(label);

    const range = $('<input/>')
      .addClass('custom-range align-middle col-6')
      .attr('type', 'range')
      .attr('min', -2000)
      .attr('max', 2000)
      .attr('value', this.driftOffset)
      .attr('step', 50)
      .attr('id', slideId);
    container.append(range);

    const input = $('<input/>')
      .addClass('col-2 text-center text-muted ml-2 p-0')
      .attr('type', 'text')
      .attr('disabled', 'disabled')
      .val(`${this.driftOffset}ms`);
    container.append(input);

    range.on('input', async () => {
      this.driftOffset = range.val();
      input.val(`${this.driftOffset}ms`);
    });

    return container;
  }

  createVideoListItem(
    item,
    bucket,
    key,
    frameCapturePrefix
  ) {
    const itemContainer = $('<div/>')
      .addClass('col-2 p-0 m-0');

    const table = $('<table/>')
      .addClass('table table-sm lead-xxs text-center no-border');
    itemContainer.append(table);

    const tbody = $('<tbody/>');
    table.append(tbody);

    let frame = Math.round(item.startTime / 1000);
    frame = String(frame).padStart(7, '0');
    frame = `frame.${frame}.jpg`;
    frame = `${frameCapturePrefix}/${frame}`;
    const thumbnail = this.makeItemThumbnail(bucket, frame);
    tbody.append(thumbnail);

    const caption = this.makeItemCaption(item);
    tbody.append(caption);

    itemContainer.on('click', async () => {
      console.log('item', item);
      this.showPreview({
        bucket,
        videoKey: key,
        imageKey: frame,
        breakOffset: this.driftOffset,
        data: item,
      });
    });
    return itemContainer;
  }

  makeItemThumbnail(bucket, key) {
    const tr = $('<tr/>');
    const td = $('<td/>');
    tr.append(td);

    const container = $('<div/>')
      .addClass('image-container');
    td.append(container);

    const overlay = $('<div/>')
      .addClass('overlay')
      .addClass('collapse');
    container.append(overlay);

    const icon = $('<i/>')
      .addClass('far fa-image lead-xxl text-white');
    overlay.append(icon);

    const img = $('<img/>')
      .addClass('w-100')
      .attr('crossorigin', 'anonymous')
      .css('background-color', '#aaa');
    img.ready(async () => {
      const s3utils = GetS3Utils();
      const signed = await s3utils.signUrl(bucket, key);
      img.src = signed;
    });
    container.append(img);

    const preview = $('<div/>')
      .addClass('preview');
    container.append(preview);

    const play = $('<i/>')
      .addClass('far fa-play-circle center lead-xxl text-white');
    preview.append(play);

    return tr;
  }

  makeItemCaption(item) {
    const tr = $('<tr/>');
    const td = $('<td/>')
      .addClass('lead-s');
    tr.append(td);

    const title = `Shots: ${item.withShots.join(',')} Events: ${item.events.length}`;
    const text = [
      `${MediasetApp.readableDuration(item.startTime)} / ${MediasetApp.readableDuration(item.endTime)}`,
      `(${Math.round(item.duration / 1000)}s)`,
    ].join('<br>');
    const desc = $('<span/>')
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'bottom')
      .attr('title', title)
      .html(text)
      .tooltip({
        trigger: 'hover',
      });
    td.append(desc);

    return tr;
  }

  showPreview(item) {
    setTimeout(async () => {
      const videoModal = new VideoModal(this.container, item);
      videoModal.on('video:modal:hidden', async (event) =>
        videoModal.destroy());

      await videoModal.show();

      this.container
        .find('div.graph-tooltip')
        .parent()
        .css('visibility', 'hidden')
        .css('opacity', 0);
    }, 10);
  }
}
