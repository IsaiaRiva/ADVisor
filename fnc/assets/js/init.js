const init = {
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

document.addEventListener('DOMContentLoaded', init.video.preload);