


//init plugin
const VF = VideoFrame({
    id: 'player',
    frameRate: FrameRates.PAL,
    callback : function(response) {
		console.log('callback response: ' + response);
        //console.log(VF.toTime());
        
	}
});
VF.listen('time', 1000);
VF.listen('SMPTE', 1000);

// range const
const fromSlider = document.querySelector('#from');
const toSlider = document.querySelector('#to');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');
const framePrev = document.querySelector('#framePrev');
const frameTo = document.querySelector('#frameTo');
const timeline = document.querySelector('#timeline');

const Units = {
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    frames: 'f'
}



// range
//console.log(Video.getVideoPlaybackQuality());
const getRangePosition = (value) => {
    const frames = Math.floor(Configs.range.frames.total);
    const position = Math.floor(frames * value / 100); 
    return position;
}

// range controls
const getMinutable = (array) => {
    const max = Math.floor(Math.floor(Configs.frames.array.length / 25) / 60);
    const nth = Math.floor(Configs.frames.array.length / max);
    console.log(Configs.frames.array.length / 25 / 60)
    console.log('NTH - MAX - LENGTH', nth, max, Configs.frames.array.length)
    return array.filter((entry, index) => {
        const entries = index % 7500 === 0;
        return entries;
    });
}

const getEdges = (rfArray, mrArray) => {
    if (rfArray[0] !== mrArray[0]) {
        mrArray.unshift(rfArray[0]);
    }
    
    if (rfArray[rfArray.length - 1] !== mrArray[mrArray.length - 1]) {
        mrArray.push(rfArray[rfArray.length - 1]);
    }

    return mrArray
}

const filterRangedFrames = (startRange, endRange) => {
    //Configs.frames.array //all video frames

    //all video frames at minute start
    

    console.log(Configs.frames.array)
    const minutableTotalArray = getMinutable(Configs.frames.array)
    
    console.log('minutable total', minutableTotalArray)
    //all ranged video frames
    Configs.range.frames.array = Configs.frames.array.slice(startRange, endRange);
    const minutableRangedArray = Configs.range.frames.array.filter(value => minutableTotalArray.includes(value));

    console.log('minutable ranged', minutableRangedArray)

    console.log('ranged', Configs.range.frames.array)

    const edgedArray = getEdges(Configs.range.frames.array, minutableRangedArray);

    return edgedArray
}

const getPosition = (container, frame) => {
    const width = container.offsetWidth;
    const arrayPosition = Configs.range.frames.array.indexOf(frame);

    console.log(width, arrayPosition)
    const position = width * arrayPosition / Configs.range.frames.array.length
    return position
}

const tl = {
    create: () => {
        const scalable = timeline.querySelector('.scalable');
        scalable.innerHTML = '';


        const startRange = getRangePosition(Configs.range.from);
        console.log('CREATE - START RANGE:', startRange, Configs.range.from)
        const endRange = getRangePosition(Configs.range.to);
        console.log('CREATE - END RANGE:', endRange, Configs.range.to)

        const rangeLength = endRange - startRange;

        //console.log('MAX FILTERS', maxFilter, framesArray)
        //
        //console.log('toSMPTE', VF.toSMPTE(range), range)
        
        let unit = 'minutes';
        const filtered = filterRangedFrames(startRange, endRange);

        

        /* for (i = 0; i < framesArray.length; i = i + filterDelta) {
            console.log('toSMPTE', VF.toSMPTE(framesArray[i]))
            //const html = `<li><span></span><span>${Units[unit]}</span></li>`;
        } */
        
        //console.log('CREATE - FRAMES ARRAY:', framesArray)
        
        
        filtered.map(frame => {
            
            console.log('toSMPTE', VF.toSMPTE(frame), filtered.length)

            const html = `<li style="position:absolute;left:${getPosition(scalable, frame)}px;display:flex;justify-content:center">
                    <span>${frame / 25 / 60}</span>
                    <span>m</span>
                </li>`;
            scalable.innerHTML = scalable.innerHTML + html;

        });

        //console.log('s, m , h', _ss, _mm, _hh, range, seconds, minutes, hours);
        //const html = `<li><span></span><span></span></li>`;
    },

    controlFromInput: (fromSlider, fromInput, toInput, controlSlider) => {
        const [from, to] = tl.getParsed(fromInput, toInput);
        tl.fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
        if (from > to) {
            fromSlider.value = to;
            fromInput.value = to;
        } else {
            fromSlider.value = from;
        }
        tl.rangeUpdate();
    },
        
    controlToInput: (toSlider, fromInput, toInput, controlSlider) => {
        const [from, to] = tl.getParsed(fromInput, toInput);
        tl.fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
        tl.setToggleAccessible(toInput);
        if (from <= to) {
            toSlider.value = to;
            toInput.value = to;
        } else {
            toInput.value = from;
        }
        tl.rangeUpdate();
    },
    
    controlFromSlider: (fromSlider, toSlider, fromInput) => {
      const [from, to] = tl.getParsed(fromSlider, toSlider);
      tl.fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
      if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
      } else {
        fromInput.value = from;
      }
      tl.rangeUpdate();
    },
    
    controlToSlider: (fromSlider, toSlider, toInput) => {
      const [from, to] = tl.getParsed(fromSlider, toSlider);
      tl.fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
      tl.setToggleAccessible(toSlider);
      if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
      } else {
        toInput.value = from;
        toSlider.value = from;
      }
      tl.rangeUpdate();
    },
    
    getParsed: (currentFrom, currentTo) => {
      const from = parseInt(currentFrom.value, 10);
      const to = parseInt(currentTo.value, 10);
      return [from, to];
    },
    
    fillSlider: (from, to, sliderColor, rangeColor, controlSlider) => {
        const rangeDistance = to.max-to.min;
        const fromPosition = from.value - to.min;
        const toPosition = to.value - to.min;
        controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
          ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
          ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
          ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
          ${sliderColor} 100%)`;
    },
    
    setToggleAccessible: (currentTarget) => {
      const toSlider = document.querySelector('#to');
      if (Number(currentTarget.value) <= 0 ) {
        toSlider.style.zIndex = 2;
      } else {
        toSlider.style.zIndex = 0;
      }
    },

    rangeUpdate: () => {
        Configs.range.from = Number(fromInput.value);
        Configs.range.to = Number(toInput.value);
        Configs.range.delta = toInput.value - fromInput.value;
        console.log('RANGE CONFIG UPDATE:', Configs.range.from, Configs.range.to, Configs.range.delta)

        tl.create()
    }
}


    tl.fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    tl.setToggleAccessible(toSlider);
    
    fromSlider.oninput = () => tl.controlFromSlider(fromSlider, toSlider, fromInput);
    toSlider.oninput = () => tl.controlToSlider(fromSlider, toSlider, toInput);
    fromInput.oninput = () => tl.controlFromInput(fromSlider, fromInput, toInput, toSlider);
    toInput.oninput = () => tl.controlToInput(toSlider, fromInput, toInput, toSlider);

    

    //button controls
    //let holding;

    framePrev.onmousedown = () => {
        //holding = true;
        VF.seekBackward(1);
        /* if (now === 1) {
            VF.seekBackward(1);
        } else {
            VF.seekTo(
                {'frame': now - 1}
            );
        } */
        //getVideoTotalTime
        /* var setIntervalId = setInterval(() => {
            let now = VF.get();
            console.log('holding', now, now + 1)
            if (!holding) {
                clearInterval(setIntervalId);
                
            }
          
            VF.seekTo(
                {'frame': now - 1}
            );
        }, 100); */ 
    }

    frameTo.onmousedown = () => {
        //holding = true;

        VF.seekForward(1);
        /* VF.seekTo(
            {'frame': now + 1}
        ); */
        /* var setIntervalId = setInterval(() => {
            let now = VF.get();
            console.log('holding', now, now + 1)
            if (!holding) {
                clearInterval(setIntervalId);
                
            }
          
            VF.seekTo(
                {'frame': now + 1}
            );
        }, 100);  */
    }

    /* framePrev.onmouseup  = () => {
        holding = false;
    }

    frameTo.onmouseup  = () => {
        holding = false;
    } */
    
