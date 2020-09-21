<p align="center"><br><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="128" height="128" /></p>

<h3 align="center">React Hook for capacitor-video-player</h3>
<p align="center"><strong><code>react-video-player-hook</code></strong></p>
<p align="center">A React Hook to help Capacitor developpers to use</p>
<p align="center"><strong><code>capacitor-video-player/code></strong></p>
<p align="center">plugin in React or Ionic/React applications
  Native databases could be encrypted with SQLCipher
</p>

<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2020?style=flat-square" />
  <a href="https://www.npmjs.com/package/react-video-player-hook"><img src="https://img.shields.io/npm/l/react-video-player-hook?style=flat-square" /></a>
<br>
  <a href="https://www.npmjs.com/package/react-video-player-hook"><img src="https://img.shields.io/npm/dw/react-video-player-hook?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/react-video-player-hook"><img src="https://img.shields.io/npm/v/react-video-player-hook?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all%20contributors-1-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>


## Maintainers

| Maintainer        | GitHub                                    | Social |
| ----------------- | ----------------------------------------- | ------ |
| Quéau Jean Pierre | [jepiqueau](https://github.com/jepiqueau) |        |


## Installation

```bash
npm install --save capacitor-video-player
npm install --save-dev react-video-player-hook
```

## Applications demonstrating the use of the plugin and the react hook

 ### Ionic/React

  - [react-video-player-app-starter](https://github.com/jepiqueau/react-video-player-app-starter)

 ### React
  
  - [react-videoplayer-hook-app](https://github.com/jepiqueau/react-videoplayer-hook-app)


## Supported methods

| Name                               | Android | iOS | Electron | Web |
| :--------------------------------- | :------ | :-- | :------- | :-- |
| initPlayer (mode fullscreen)       | ✅      | ✅  | ✅       | ✅  |
| initPlayer (mode embedded)         | ❌      | ❌  | ✅       | ✅  |
| initPlayer (url internal)          | ✅      | ✅  | ❌       | ❌  |
| initPlayer (url application/files) | ✅      | ✅  | ❌       | ❌  |
| isPlaying                          | ✅      | ✅  | ✅       | ✅  |
| play                               | ✅      | ✅  | ✅       | ✅  |
| pause                              | ✅      | ✅  | ✅       | ✅  |
| getCurrentTime                     | ✅      | ✅  | ✅       | ✅  |
| setCurrentTime                     | ✅      | ✅  | ✅       | ✅  |
| getDuration                        | ✅      | ✅  | ✅       | ✅  |
| getMuted                           | ✅      | ✅  | ✅       | ✅  |
| setMuted                           | ✅      | ✅  | ✅       | ✅  |
| getVolume                          | ✅      | ✅  | ✅       | ✅  |
| setVolume                          | ✅      | ✅  | ✅       | ✅  |
| stopAllPlayers                     | ✅      | ✅  | ✅       | ✅  |

## Supported listeners

| Name     | Android | iOS | Electron | Web |
| :------- | :------ | :-- | :------- | :-- |
| onReady  | ✅      | ✅  | ✅       | ✅  |
| onPlay   | ✅      | ✅  | ✅       | ✅  |
| onPause  | ✅      | ✅  | ✅       | ✅  |
| jonEnded | ✅      | ✅  | ✅       | ✅  |
| onExit   | ✅      | ✅  | ✅       | ✅  |


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
import { ExitStatus } from 'typescript';


const VideoPlayer = () => {
    const [url, setUrl] = useState( undefined );
    const platform = Capacitor.getPlatform();

    let apiTimer1 = useRef();
    let apiTimer2 = useRef();
    let apiCount = useRef(-1);
    const exit = useRef(false)

    const onPlay = async (fromPlayerId,currentTime) => {
        if(!exit.current) {
            const mIsPlaying = await isPlaying(fromPlayerId);
            console.log("==> mIsPlaying " + JSON.stringify(mIsPlaying));
            apiCount.current += 1;
            if(apiCount.current === 0) {
                const volume = await getVolume(fromPlayerId);
                if(volume.result) {
                    console.log("==> volume " + volume.value);
                } else {
                    console.log("==> volume " + volume.message);
                }
                apiTimer1.current = setTimeout(async () => {
                    const duration = await getDuration(fromPlayerId);
                    console.log("==> duration " + 
                                JSON.stringify(duration));
                    if(duration.result) {
                        console.log("==> duration " + duration.value);
                    } else {
                        console.log("==> duration " + duration.message);
                    }
                    const volume = await setVolume(fromPlayerId,0.2);
                    console.log("====> Volume ",volume.value);
                    const currentTime = await getCurrentTime(
                                        fromPlayerId);
                    if(currentTime.result) {
                        console.log('==> currentTime ' + 
                                currentTime.value);
                        const seektime = currentTime.value + 
                                0.4 * duration.value; 
                        console.log("seektime" + seektime)
                        const sCurrentTime = await setCurrentTime(
                                                fromPlayerId,seektime);
                        console.log("==> setCurrentTime " + 
                                sCurrentTime.value);
                    }
                    const mPause = await pause(fromPlayerId);
                    console.log('==> mPause ', mPause);
                }, 10000);
            } 
        }
    };
    const onPause = async (fromPlayerId,currentTime) => {
            if(!exit.current) {
            if(apiCount.current === 0) {
                apiCount.current += 1;
                const mIsPlaying = await isPlaying(fromPlayerId);
                console.log("==> in Pause mIsPlaying " +
                        mIsPlaying.value);
                const volume = await getVolume(fromPlayerId);
                if(volume.result) {
                    console.log("==> volume " + volume.value);
                }                
                const currentTime = await getCurrentTime(fromPlayerId);
                if(currentTime.result) {
                    console.log('==> currentTime ' + currentTime.value);
                }
                let muted = await getMuted(fromPlayerId);
                console.log("==> muted before setMuted " + muted.value);
                muted = await setMuted(fromPlayerId,!muted.value);
                console.log("==> setMuted " + muted.value);
                muted = await getMuted(fromPlayerId);
                console.log("==> muted after setMuted " + muted.value);
                apiTimer2.current = setTimeout(async () => {
                    const duration = await getDuration(fromPlayerId);
                    const rCurrentTime = await setCurrentTime(
                                        fromPlayerId,duration.value - 4);
                    console.log('====> setCurrentTime ',
                            rCurrentTime.value);
                    await play(fromPlayerId);
                }, 4000);
            }
        }
    };
    const onReady = (fromPlayerId,currentTime) => {
        console.log("in OnReady playerId " + fromPlayerId +
                " currentTime " + currentTime);
    };
    const onEnded = (fromPlayerId,currentTime) => {
        console.log("in OnEnded playerId " + fromPlayerId +
                " currentTime " + currentTime);
        exitClear();
    };
    const onExit = (dismiss) => {
        console.log("in OnExit dismiss " + dismiss);
        exitClear();
    };
    const exitClear = () => {
        if(!ExitStatus.current) {
            console.log("%%%% in cleanup Timers %%%%")
            window.clearTimeout(apiTimer1.current);
            window.clearTimeout(apiTimer2.current);
            apiTimer1.current = 0;
            apiTimer2.current = 0;
            console.log("apiTimer1.current " + apiTimer1.current)
            console.log("apiTimer2.current " + apiTimer2.current)
            exit.current = true;
            console.log("exit.current " + exit.current)
            setUrl("");
            console.log("url " + url)
        }
    };
    const {initPlayer, isPlaying, pause, play, getDuration, setVolume,
        getVolume, setMuted, getMuted, setCurrentTime, getCurrentTime,
        stopAllPlayers} = useVideoPlayer({
            onReady,
            onPlay,
            onPause,
            onEnded,
            onExit
    });

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
        console.log("%%%%% starting useEffect exit " + exit.current + " %%%%%")

        if( url && !exit.current ) {
            // test mode "embedded" for video player on Web platform
            const playerWeb = async () => {
                await initPlayer( "embedded", url,
                "fullscreen-video",'div', 1280, 720);

                if ( res.result.result && res.result.value ) {
                    res = await play( "fullscreen-video" );
                }
/*                // test mode "fullscreen" for video player on Web platform
                await initPlayer( "fullscreen", url,
                                   "fullscreen-video",'div');
*/
            }
            // test mode "fullscreen" for video player 
            // on native platforms
            const playerNative = async () => {
                try {
                    await initPlayer("fullscreen", url,
                                     "fullscreen-video");

                } catch ( error ) {
                    console.log( error );
                }
            }
            if ( platform === "ios" || platform === "android" )
                playerNative();
            else
                playerWeb(); 
        
        }
        
    }, [initPlayer, play, isPlaying, pause, getDuration,
        getVolume, setVolume, getCurrentTime, setCurrentTime, 
        getMuted, setMuted, stopAllPlayers,
        platform, url, exit] );

    return (
        <div className="main-container">
            {(!exit.current) &&
                <div id="fullscreen-video" slot="fixed">
                </div>
            }
        </div>
    )
}

export default VideoPlayer
``` 

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jepiqueau"><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="100px;" alt=""/><br>
    <sub><b>Jean Pierre Quéau</b></sub></a><br />
    <a href="https://github.com/jepiqueau/react-video-player-hook/commits?author=jepiqueau" title="Code">💻</a>
    </td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!



