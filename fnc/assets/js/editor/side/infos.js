import Store from '../store';

const Infos = {
    init: (side) => {
        const back = side.querySelector('#back');

            back.addEventListener('click', event => {
                Store.elements.media.style.display = 'flex';
                Store.elements.editor.remove();
            });
    },
    listener: () => {

    },
    back: () => {

    },
    navigation: () => {

    }
}

export default Infos;