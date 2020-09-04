# React Hook for capacitor-video-player

A React Hook to help Capacitor developpers to use `capacitor-video-player` plugin in React or Ionic/React applications

This is an alpha version and includes only `initPlayer` method 

## Getting Started in your Ionic/React App

```bash
npm install --save capacitor-video-player
npm install --save-dev react-video-player-hook
```

## Applications demonstrating the use of the plugin and the react hook

 - [react-video-player-app-starter] (https://github.com/jepiqueau/react-video-player-app-starter)


## Usage
Import the hook from its own path:

```js
 import { useVideoPlayer } from 'react-video-player-hook'
```

Then use the hook from that namespace in your app:

```js
import React, { useState, useEffect} from 'react';
...
import { Plugins } from '@capacitor/core';
import * as WebVPPlugin from 'capacitor-video-player';

const { CapacitorVideoPlayer, Toast } = Plugins;

interface PlayerProps { 
  url: string;
  api: boolean;
  platform: string;
}

const VideoPlayer: React.FC<PlayerProps> = ({url, api, platform}) => {
  const vPlayer = platform === "ios" || platform === "android" 
                  ? CapacitorVideoPlayer
                  : WebVPPlugin;

  useEffect( () => {
    async function launchPlayer(): Promise<void>  {
      if(url !== null) {
        const res:any  = await vPlayer.initPlayer("fullscreen",url,"fullscreen","VideoPlayer");
        if(!res.result && (platform === "ios" || platform === "android")) {
          await Toast.show({
            text: res.message,
            duration: 'long',
            position: 'bottom'
          });        
        }
        if(!res.result) console.log("res.message",res.message);
      }
    }
    launchPlayer();
  },[vPlayer,url,platform]);
                
  return (
      <div id="fullscreen" slot="fixed">
  );
};

export default VideoPlayer;
``` 



