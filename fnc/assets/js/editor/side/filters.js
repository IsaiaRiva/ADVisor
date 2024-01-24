import Store from '../store';

const Filters = {
    init: (side) => {
        /* 
        input[type="number"] {
        -webkit-appearance: textfield;
        -moz-appearance: textfield;
        appearance: textfield;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        }
        */
        
        const breaks = 'breaks';
        const frequency = 'frequency';
        const tolerance = 'tolerance';

        Filters.listener(side, [...breaks, frequency, tolerance]);
    },
    listener: (side, filters) => {
        const container = side.querySelector('.filters');

        container.addEventListener('change', (event) => {
            filters.map(filter => {
                const input = container.querySelector(`#${filter}`);

                if (event.target.id === filter) {
                    Filters.manage[filter](input);
                    Store.filters[filter] = Number(input.value);
                    console.log('FSLOG store', Store)
                    
                    Filters.lock(filter, filters);
                    console.log('FSLOG filter input', filter, Number(input.value));
                }
            });
        });
    },
    lock: (filter, filters) => {

        let locked = filters.filter(record => record === 'frequency');

        if (filter === 'frequency' ) {
            locked = filters.filter(record => record !== filter);
            console.log('FSLOG in', locked)
        }
        console.log('FSLOG out', locked)

        locked.map(lock => {
            const disable = document.querySelector(`#${lock}`);
            disable.onclick = () => console.log(disable);
            //TODO disable.disabled = true; disable by css styles, with a button added with class selector an :after or something similar
        });
    },
    manage: {
        breaks: (input) => {
            
            console.log(input)
        },
        frequency: (input) => {
            console.log(input)

        },
        tolerance: (input) => {
            console.log(input)

        }
    }

}

export default Filters;