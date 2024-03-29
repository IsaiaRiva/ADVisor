import Consts from './consts.js';

import Auth from './auth/index.js'
import Ui from './ui/index.js';

const Init = {
    auth: {
        connect: async () => {
            console.log('FSLOG selector', )
            const container = document.querySelector(Consts.selectors.main);

            await Auth.render(container);
            
	
            
                    
                    /* const mainView = new MainView();
                    mainView.appendTo(view);

                    const hashtag = document.location.hash.slice(1);
                    mainView.show(hashtag); */
                
            
        }
    },
    video: { 
        preload: async () => {
            const Video = document.querySelector('#player');

            Video.preload = 'metadata';
            const seconds = await init.video.duration(Video);
            
            Configs.frames.total = Math.floor(seconds * Configs.fps);
            Configs.frames.array = [...Array(Math.floor(Configs.frames.total)).keys()];
            Configs.range.frames.total = Configs.frames.total;
            
            tl.create();
        },
        duration: (Video) => {
            return new Promise( resolve => {
                Video.onloadedmetadata = function() {
                    console.log(Video.duration,Video.duration * 25, Video)
                    
                    resolve(Video.duration);
            
                    return Video.duration;
                  }
                }
            );
        }
    }
}

export default Init;
//document.addEventListener('DOMContentLoaded', init.video.preload);