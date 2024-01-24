const inputs = {
    init: (element, object) => {

       /*  const object = {
            id: element.getAttribute('data-id'),
            class: element.getAttribute('data-class'),
            tag: element.getAttribute('data-tag'),
            type: element.getAttribute('data-type'),
            name: element.getAttribute('data-name'),
            value: element.getAttribute('data-value'),
            mode: element.getAttribute('data-mode'),
            callback: element.getAttribute('data-callback')
        }
 */

        element.innerHTML = inputs.create(object);

        // launch listeners
    },
    create: (object) => {
        /* 
            <input class="form_control_container__time__input" type="text" id="fromInput" value="0" min="0" max="100"/>
        
            <input id="from" type="range" value="0" min="0" max="100"/>
            <input id="to" type="range" value="100" min="0" max="100"/>
        */
        
        return `<input 
                    id="${object.id}" 
                    class="${object.selector}"
                    type="${object.type}" 
                    value="${object.value}"
                    min="${object.min}"
                    max="${object.max}"
                >`;
    }
}

//export default inputs;
