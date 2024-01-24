const TP_editor = {
    container: {
        render: (random) => {
            const html = `
                <div id="editor-" class="row">
                    <div class="main col-8"></div>
                    <div class="side col-4"></div>
                </div>
                `;
            return html;
        }
    },
    main: {
        video: {
            player: {},
            controls: {}
        },
        tabs: {
            timeline: {},
            distribution: {}
        }
    },
    side: {
        info: {
            render: (data) => {
                const html = `
                    <div id="info-">
                        <div class="header">
                            <div class="back">
                                <button id="back" type="button"><</button>
                            </div>
                            <div class="title">${data.basename}</div>
                            <div class="nav"></div>
                        </div>
                    </div>
                    `;
                return html;
            }
        },
        manage: {
            container: {
                render: (data) => {
                    const html = `
                        <div id="manage-">
                            <h3>Cue Points Management</h3>
                            <div class="filters">
                                <ul>
                                    <li class="row">
                                        <span class="start col-4">
                                            <label>Start Adv Insertion</label>
                                            <input type="text" value="00:00:00:00">
                                        </span>
                                        <span class="end col-4">
                                            <label>End Adv Insertion</label>
                                            <input type="text" value="${data.track[0].durationString4}">
                                        </span>
                                        <span class="total col-4">
                                            <label>Media Duration</label>
                                            <input type="text" value="${data.track[0].durationString4}">
                                        </span>
                                    </li>
                                    <li class="row">
                                        <span class="breaks col-4">
                                            <label>Ad Breaks</label>
                                            <input id="breaks" type="number">
                                        </span>
                                        <span class="frequency col-4">
                                            <label>Frequency</label>
                                            <input id="frequency" type="number">
                                           <span>Minutes</span>
                                        </span>
                                        <span class="tolerance col-4">
                                            <label>Tolerance</label>
                                            <input id="tolerance" type="number">
                                           <span>Minutes</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div class="row">
                                <h4 class="col-4">Breaks</h4>
                                <h4 class="col-4">Starts</h4>
                                <h4 class="col-4">Ends</h4>
                            </div>
                            <div class="manage">
                                <ul></ul>
                            </div>
                        </div>
                        `;
                    return html;
                }
            },
            item: {
                render: (random) => {
                    const html = `
                        <li>
                            <span></span>
                            <span class="col-4"></span>
                            <span class="col-4"></span>
                            <span class="col-4"></span>
                        </li>
                        `;
                    return html;
                }
            }
        },
        list: {
            container: {
                render: (random) => {
                    const html = `
                        <div id="list-">
                            <h3>Cue Points List</h3>
                            <div class="row">
                                <span class="col-4">
                                    <label>Break</label>
                                    <input type="text">
                                </span>
                                <span class="col-4">
                                    <label>From</label>
                                    <input type="text">
                                </span>
                                <span class="col-4">
                                    <label>To</label>
                                    <input type="text">
                                </span>
                            </div>
                            <div class="row">
                                <h4 class="col-2">Suggested</h4>
                                <h4 class="col-2">Frame</h4>
                                <h4 class="col-2">Confidence</h4>
                                <h4 class="col-2">Type</h4>
                                <h4 class="col-2">Actions</h4>
                            </div>
                            <div class="list">
                                <ul></ul>
                            </div>
                        </div>
                        `;
                    return html;
                }
            },
            item: {
                render: (random) => {
                    const html = `
                        <li>
                            <span></span>
                            <span></span>
                            <span>
                                <span></span>
                                <span></span>
                            </span>
                            <span></span>
                            <span></span>
                        </li>
                        `;
                    return html;
                }
            }
        }
    }
}

export default TP_editor;