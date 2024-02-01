const TP_editor = {
    container: {
        render: (random) => {
            const html = `
                <div id="editor-" class="row">
                    <div class="main col-7"></div>
                    <div class="side col-5"></div>
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
                        <div class="header d-flex-sb bottom-divider v-center">
                            <div class="back">
                                <button id="back" type="button">
                                    <svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                        <style>.cls-1{fill:#231f20;}</style>
                                        </defs>
                                        <g data-name="arrow left" id="arrow_left">
                                        <path class="cls-1" d="M22,29.73a1,1,0,0,1-.71-.29L9.93,18.12a3,3,0,0,1,0-4.24L21.24,2.56A1,1,0,1,1,22.66,4L11.34,15.29a1,1,0,0,0,0,1.42L22.66,28a1,1,0,0,1,0,1.42A1,1,0,0,1,22,29.73Z"/>
                                        </g>
                                    </svg>
                                </button>
                            </div>
                            <h3 class="title">${data.basename}</h3>
                            <div class="nav d-flex-vc">

                                <svg fill="#000000" class="d-arrow-left" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                    viewBox="0 0 192.701 192.701" xml:space="preserve">
                                    <g>
                                        <g id="Double_Chevron_Left">
                                            <path d="M29.641,96.345l74.54-75.61c4.704-4.74,4.704-12.439,0-17.179c-4.704-4.74-12.319-4.74-17.011,0l-82.997,84.2
                                                c-4.511,4.559-4.535,12.608,0,17.191l83.009,84.2c4.692,4.74,12.319,4.74,17.011,0c4.704-4.74,4.704-12.439,0-17.179
                                                L29.641,96.345z"/>
                                            <path d="M113.853,96.345l74.54-75.61c4.704-4.74,4.704-12.439,0-17.179c-4.704-4.74-12.319-4.74-17.011,0l-82.997,84.2
                                                c-4.511,4.559-4.535,12.608,0,17.191l82.997,84.2c4.704,4.74,12.319,4.74,17.011,0c4.704-4.74,4.704-12.439,0-17.179
                                                L113.853,96.345z"/>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                    </g>
                                </svg>

                                <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                viewBox="0 0 192.689 192.689" xml:space="preserve">
                                    <g>
                                        <g id="Double_Chevron_Right">
                                            <path d="M188.527,87.755l-83.009-84.2c-4.692-4.74-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l74.54,75.61
                                                l-74.54,75.61c-4.704,4.74-4.704,12.439,0,17.179c4.704,4.74,12.319,4.74,17.011,0l82.997-84.2
                                                C193.05,100.375,193.062,92.327,188.527,87.755z"/>
                                            <path d="M104.315,87.755l-82.997-84.2c-4.704-4.74-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l74.528,75.61
                                                l-74.54,75.61c-4.704,4.74-4.704,12.439,0,17.179s12.319,4.74,17.011,0l82.997-84.2C108.838,100.375,108.85,92.327,104.315,87.755
                                                z"/>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                        <g>
                                        </g>
                                    </g>
                                </svg>

                            </div>
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
                        <div id="manage-" class="">
                            <h3 class="title uppercase bottom-divider">Cue Points Management</h3>
                            <div class="filters bottom-divider">
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
                                            <span class="lowercase">Minutes</span>
                                        </span>
                                        <div class="tolerance col-4">
                                            <label>Tolerance</label>
                                            <input id="tolerance" type="number">
                                           <span class="lowercase">Minutes</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="rank bottom-divider">
                                <h4>i</h4>
                                <h4>Breaks</h4>
                                <h4>Starts</h4>
                                <h4>Ends</h4>
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
                            <h3 class="bottom-divider uppercase title">Cue Points List</h3>
                            <div class="bottom-divider d-flex space-between body">
                                <span class="d-flex-vc">
                                    <label>Break</label>
                                    <input type="text">
                                </span>
                                <span class="d-flex-vc">
                                    <label>From</label>
                                    <input type="text">
                                </span>
                                <span class="d-flex-vc">
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