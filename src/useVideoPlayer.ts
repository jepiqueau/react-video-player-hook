//Inspired from https://github.com/capacitor-community/react-hooks/blob/master/src/storage/

import { useCallback } from 'react';
import { Capacitor, Plugins } from '@capacitor/core';
import { AvailableResult, notAvailable } from './util/models';
import { isFeatureAvailable, featureNotAvailableError } from './util/feature-check';
import * as CVPPlugin from 'capacitor-video-player';


interface VideoPlayerResult extends AvailableResult {
    initPlayer: (mode:string,url:string,playerId:string,componentTag:string) => Promise<{result?: boolean, message?: string}>;
}
export const availableFeatures = {
    useVideoPlayer: isFeatureAvailable('CapacitorVideoPlayer', 'useVideoPlayer')
}

export function useVideoPlayer(): VideoPlayerResult {
    const { CapacitorVideoPlayer } = Plugins;
    const platform = Capacitor.getPlatform();
    const mVideoPlayer = platform === "ios" || platform === "android" ? CapacitorVideoPlayer
        : CVPPlugin.CapacitorVideoPlayer;
    const availableFeaturesN = {
        useVideoPlayer: isFeatureAvailable('CapacitorVideoPlayer', 'useVideoPlayer')
    }
    if (!availableFeatures.useVideoPlayer) {
        return {
            initPlayer: featureNotAvailableError,
            ...notAvailable
        };
    }
    /**
     * Init the player
     * @param mode string
     * @param url string
     * @param playerId string
     * @param componentTag string
     */
    const initPlayer = useCallback(async (mode:string,url:string,playerId:string,componentTag:string) => { 
         
        const r = await mVideoPlayer.initPlayer({mode:mode,url:url,playerId:playerId,componentTag:componentTag});
        if(r) {
            if( typeof r.result != 'undefined') {
                return r;
            }
        }
        return {result: false, method: "initPlayer", value: false};
    }, []);

    return { initPlayer, isAvailable: true };
}
