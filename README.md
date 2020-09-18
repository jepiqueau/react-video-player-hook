# React Hook for capacitor-video-player

A React Hook to help Capacitor developpers to use `capacitor-video-player` plugin in React or Ionic/React applications

This is an alpha version and includes only `initPlayer` method 

## Getting Started in your Ionic/React App

```bash
npm install --save capacitor-video-player
npm install --save-dev react-video-player-hook
```

## Applications demonstrating the use of the plugin and the react hook

 ### Ionic/React

  - [react-video-player-app-starter](https://github.com/jepiqueau/react-video-player-app-starter)

 ### React
  
  - [react-videoplayer-hook-app](https://github.com/jepiqueau/react-videoplayer-hook-app)


## Usage
Import the hook from its own path:

```js
 import { useVideoPlayer } from 'react-video-player-hook'
```

Then use the hook from that namespace in your app:

```js
import React from 'react'
import { Capacitor } from '@capacitor/core';
import { useState, useEffect, useRef } from 'react';
import { useVideoPlayer } from 'react-video-player-hook';


const VideoPlayer = () => {
    const [url, setUrl] = useState( undefined );
    const platform = Capacitor.getPlatform();

    const {pVideoPlayer, initPlayer, isPlaying, pause, play, getDuration, setVolume,
        getVolume, setMuted, getMuted, setCurrentTime, getCurrentTime, stopAllPlayers} = useVideoPlayer();
    
    let apiTimer1 = useRef();
    let apiTimer2 = useRef();
    let apiCount = useRef(-1);
    const [first, setFirst] = useState(true);

    const exitClear = () => {
        console.log("%%%% in cleanup Timers %%%%")
        clearTimeout(apiTimer1);
        clearTimeout(apiTimer2);
        setFirst(false);
    }
    useEffect(  () => {
        if ( platform === "ios" || platform === "android" ) {
            // test url from public/assets
            setUrl( 'public/assets/video/video.mp4' )
        } else {
            // test url from http:
            setUrl( 'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_normal.mp4' )
        }
    }, [platform, url] )
    

    useEffect( () => {
        let playListener = null;
        let pauseListener = null;
        let readyListener = null;
        let exitListener = null;
        let endedListener = null;
        if(first && pVideoPlayer && url ) {
            // test mode "embedded" for video player on Web platform
            const playerWeb = async () => {
                let res;
                res = await initPlayer( "embedded", url, "fullscreen-video", 'div', 1280, 720);
                if ( res.result.result && res.result.value ) {
                    res = await play( "fullscreen-video" );
                }
            }
            // test mode "fullscreen" for video player on native platform
            const playerNative = async () => {
                try {
                    await initPlayer("fullscreen", url, "fullscreen-video");
                } catch ( error ) {
                    console.log( error );
                }
            }
            console.log("pVideoPlayer " + pVideoPlayer)
            console.log("url " + url)
            playListener = pVideoPlayer.addListener( 'jeepCapVideoPlayerPlay', async( e ) => { 
                console.log( "Event jeepCapVideoPlayerPlay playerId " + 
                e.fromPlayerId + " time " + e.currentTime);
                const mIsPlaying = await isPlaying(e.fromPlayerId);
                console.log("==> mIsPlaying " + JSON.stringify(mIsPlaying));
                apiCount.current += 1;
                if(apiCount.current === 0) {
                    const volume = await getVolume(e.fromPlayerId);
                    if(volume.result) {
                        console.log("==> volume " + volume.value);
                    } else {
                        console.log("==> volume " + volume.message);
                    }
                    apiTimer1.current = setTimeout(async () => {
                        const duration = await getDuration(e.fromPlayerId);
                        console.log("==> duration " + JSON.stringify(duration));
                        if(duration.result) {
                            console.log("==> duration " + duration.value);
                        } else {
                            console.log("==> duration " + duration.message);
                        }
                            const volume = await setVolume(e.fromPlayerId,0.2);
                        console.log("====> Volume ",volume.value);
                        const currentTime = await getCurrentTime(e.fromPlayerId);
                        if(currentTime.result) {
                            console.log('==> currentTime ' + currentTime.value);
                            const seektime = currentTime.value + 0.4 * duration.value; 
                            console.log("seektime" + seektime)
                            const sCurrentTime = await setCurrentTime(e.fromPlayerId,seektime);
                            console.log("==> setCurrentTime " + sCurrentTime.value);
                        }
                        const mPause = await pause(e.fromPlayerId);
                        console.log('==> mPause ', mPause);
                    }, 10000);
                } 
            }, false );
            pauseListener = pVideoPlayer.addListener( 'jeepCapVideoPlayerPause', async ( e ) => { 
                console.log( "Event jeepCapVideoPlayerPause playerId " + 
                e.fromPlayerId + " time " + e.currentTime);
                if(apiCount.current === 0) {
                    const mIsPlaying = await isPlaying(e.fromPlayerId);
                    console.log("==> in Pause mIsPlaying " + mIsPlaying.value);
                    const volume = await getVolume(e.fromPlayerId);
                    if(volume.result) {
                        console.log("==> volume " + volume.value);
                    }                
                    const currentTime = await getCurrentTime(e.fromPlayerId);
                    if(currentTime.result) {
                        console.log('==> currentTime ' + currentTime.value);
                    }
                    let muted = await getMuted(e.fromPlayerId);
                    console.log("==> muted before setMuted " + muted.value);
                    muted = await setMuted(e.fromPlayerId,!muted.value);
                    console.log("==> setMuted " + muted.value);
                    muted = await getMuted(e.fromPlayerId);
                    console.log("==> muted after setMuted " + muted.value);
                    apiTimer2.current = setTimeout(async () => {
                        const duration = await getDuration(e.fromPlayerId);
                        const rCurrentTime = await setCurrentTime(e.fromPlayerId,duration.value - 4);
                        console.log('====> setCurrentTime ', rCurrentTime.value);
                        await play(e.fromPlayerId);
                    }, 4000);
                }
            }, false );
            readyListener = pVideoPlayer.addListener( 'jeepCapVideoPlayerReady', ( e ) => { 
                console.log( "Event jeepCapVideoPlayerReady  playerId " + 
                e.fromPlayerId + " time " + e.currentTime); 
            }, false );
            exitListener = pVideoPlayer.addListener( 'jeepCapVideoPlayerExit', ( e ) => { 
                console.log( "Event jeepCapVideoPlayerExit  playerId " + 
                e.fromPlayerId + " time " + e.currentTime);
                exitClear();
            }, false );
            endedListener = pVideoPlayer.addListener( 'jeepCapVideoPlayerEnded', ( e ) => {
                console.log( "Event jeepCapVideoPlayerEnded  playerId " + 
                e.fromPlayerId + " time " + e.currentTime); 
                exitClear();
            }, false );
            if ( platform === "ios" || platform === "android" )
                playerNative();
            else
                playerWeb(); 
        
        }

        return () => {
            console.log("$$$$$$$$ in cleanup listeners $$$$$$$$")
            // Clean up the listeners
            if(playListener != null) playListener.remove();
            if(pauseListener != null) pauseListener.remove();
            if(readyListener != null) readyListener.remove();
            if(exitListener != null) exitListener.remove();
            if(endedListener != null) endedListener.remove();
        };
        
    }, [pVideoPlayer, initPlayer, play, isPlaying, pause, getDuration,
        getVolume, setVolume, getCurrentTime, setCurrentTime, 
        getMuted, setMuted, platform, url, first] )


    return (
        <div className="main-container">
            {(first) &&
                <div id="fullscreen-video" slot="fixed">
                </div>
            }
        </div>
    )
}

export default VideoPlayer
``` 



