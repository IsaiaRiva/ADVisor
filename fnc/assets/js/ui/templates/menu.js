const TP_menu = {
    render: (random) => {
        const html = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="https://aws.amazon.com/solutions/media2cloud/" target="_blank" data-toggle="tooltip" data-placement="bottom" title="" style="font-size: 1rem;" data-original-title="Visit AWS Solutions page">
                    <img class="d-inline-block align-top" src="/images/m2c-short-white.png" height="48" alt="AWS Media2Cloud Solution">
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse"
        data-target="#main-tabs-${random}" aria-controls="main-tabs-${random}" aria-expanded="false"
        aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="main-tabs-${random}">
                    <div class="navbar-nav" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active show" id="tab-2aac6c4e" href="#tabcontent-2aac6c4e"
                                role="tab" data-toggle="tab" aria-controls="tabcontent-2aac6c4e" aria-selected="true"
                                style="font-size: 1.2rem;">Collection</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-ca87466e" href="#tabcontent-ca87466e" role="tab"
                                data-toggle="tab" aria-controls="tabcontent-ca87466e" aria-selected="true"
                                style="font-size: 1.2rem;">Upload</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-78d0dd3b" href="#tabcontent-78d0dd3b" role="tab"
                                data-toggle="tab" aria-controls="tabcontent-78d0dd3b" aria-selected="true"
                                style="font-size: 1.2rem;">Processing</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-88689ac4" href="#tabcontent-88689ac4" role="tab"
                                data-toggle="tab" aria-controls="tabcontent-88689ac4" aria-selected="true"
                                style="font-size: 1.2rem;">Stats</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-fbb79774" href="#tabcontent-fbb79774" role="tab"
                                data-toggle="tab" aria-controls="tabcontent-fbb79774" aria-selected="true"
                                style="font-size: 1.2rem;">FaceCollection</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-365c753a" href="#tabcontent-365c753a" role="tab"
                                data-toggle="tab" aria-controls="tabcontent-365c753a" aria-selected="true"
                                style="font-size: 1.2rem;">Settings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-8990040a" href="#tabcontent-8990040a" role="tab"
                                data-toggle="tab" aria-controls="tabcontent-8990040a" aria-selected="true"
                                style="font-size: 1.2rem;">User Management</a>
                        </li>
                    </div>
                </div>
                <button class="btn btn-sm btn-link text-white" type="button" data-toggle="tooltip" data-placement="bottom"
                    title="" style="font-size: 1rem;" data-original-title="user, ready to logout?">
                    <i class="fas fa-user-circle" style="font-size: 2rem;"></i>
                </button>
            </nav>`;

        return html;
    }
}

export default TP_menu;