//Inspired from https://github.com/capacitor-community/react-hooks/blob/master/src/storage/
import { useCallback, useEffect, useState } from 'react';
import { Capacitor, Plugins } from '@capacitor/core';
import { AvailableResult, notAvailable } from './util/models';
import { isFeatureAvailable, featureNotAvailableError } from './util/feature-check';
import * as CVPPlugin from 'capacitor-video-player';

interface VideoPlayerOuput  {
    result?: boolean;
    method?: string;
    value?: any;
    message?: string;
}

interface VideoPlayerResult extends AvailableResult {
    pVideoPlayer: any;
    initPlayer: (mode:string,url:string,playerId:string,componenTag: string,/*divContainerElement:any,*/width?:number,height?:number) => Promise<VideoPlayerOuput>;
    isPlaying: (playerId: string) => Promise<VideoPlayerOuput>;
    pause: (playerId: string) => Promise<VideoPlayerOuput>;
    play: (playerId: string) => Promise<VideoPlayerOuput>;
    getDuration: (playerId: string) => Promise<VideoPlayerOuput>;
    setVolume: (playerId: string, volume: number) => Promise<VideoPlayerOuput>;
    getVolume: (playerId: string) => Promise<VideoPlayerOuput>;
    setMuted: (playerId: string, muted: boolean) => Promise<VideoPlayerOuput>;
    getMuted: (playerId: string) => Promise<VideoPlayerOuput>;
    setCurrentTime: (playerId: string, seektime: number) => Promise<VideoPlayerOuput>;
    getCurrentTime: (playerId: string) => Promise<VideoPlayerOuput>;
    stopAllPlayers: () => Promise<VideoPlayerOuput>;

}
export const availableFeatures = {
    useVideoPlayer: isFeatureAvailable('CapacitorVideoPlayer', 'useVideoPlayer')
}

export function useVideoPlayer(): VideoPlayerResult {
    const { CapacitorVideoPlayer } = Plugins;
    const platform = Capacitor.getPlatform();
    const pVideoPlayer = platform === "ios" || platform === "android" ? CapacitorVideoPlayer
        : CVPPlugin.CapacitorVideoPlayer;
    const availableFeaturesN = {
        useVideoPlayer: isFeatureAvailable('CapacitorVideoPlayer', 'useVideoPlayer')
    }
    if (!availableFeatures.useVideoPlayer) {
        return {
            pVideoPlayer: null,
            initPlayer: featureNotAvailableError,
            isPlaying: featureNotAvailableError,
            play: featureNotAvailableError,
            pause: featureNotAvailableError,
            getDuration: featureNotAvailableError, 
            setVolume: featureNotAvailableError, 
            getVolume: featureNotAvailableError, 
            setMuted: featureNotAvailableError, 
            getMuted: featureNotAvailableError, 
            setCurrentTime: featureNotAvailableError, 
            getCurrentTime: featureNotAvailableError, 
            stopAllPlayers: featureNotAvailableError, 
            ...notAvailable
        };
    }
    /**
     * Method initPlayer
     * Init the player
     * @param mode string
     * @param url string
     * @param playerId string
     * @param divContainerElement any
     * @param width number
     * @param height number
     */
    
    const initPlayer = useCallback(async (mode: string, url: string, playerId: string, componentTag: string,
                                          /*divContainerElement: any,*/ width?:number, height?:number) => { 
        
        let r;
        if(width && height) {
            r = await pVideoPlayer.initPlayer({mode: mode, url: url, playerId: playerId, /*divContainerElement: divContainerElement,*/
                componentTag: componentTag, width: width, height: height});
        } else {
            r = await pVideoPlayer.initPlayer({mode: mode, url: url, playerId: playerId, /*divContainerElement: divContainerElement*/componentTag: componentTag});
        }
        if(r) {
            if( typeof r.result != 'undefined') {
                return r;
            }
        }
        return {result: false, method: "initPlayer", message: "initPlayer failed"};
    }, []);
    /**
     * Method isPlaying 
     * @param playerId string
     */
    const isPlaying = useCallback(async (playerId: string) => {
        const r = await pVideoPlayer.isPlaying({ playerId:playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "isPlaying", message: "isPlaying failed" };

    }, []);
    /**
     * Method pause 
     * pause the videoplayer 
     * @param playerId string
     */
    const pause = useCallback(async (playerId: string) => {
        const r = await pVideoPlayer.pause({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "pause", message: "pause failed" };

    }, []);
    /**
     * Method play 
     * play the videoplayer 
     * @param playerId string
     */
    const play = useCallback(async (playerId: string) => {
        const r = await pVideoPlayer.play({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "play", message: "play failed" };

    }, []);
    /**
     * Method getDuration 
     * get the video duration
     * @param playerId string
     */
    const getDuration = useCallback(async (playerId: string) => {
        const r = await pVideoPlayer.getDuration({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "getDuration", message: "getDuration failed" };

    }, []);
    /**
     * Method setVolume 
     * set the video volume
     * @param playerId string
     * @param volume number
     */
    const setVolume = useCallback(async (playerId: string, volume: number) => {
        const r = await pVideoPlayer.setVolume({ playerId: playerId, volume: volume });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "setVolume", message: "setVolume failed" };

    }, []);
    /**
     * Method getVolume 
     * get the video volume
     * @param playerId string
     */
    const getVolume = useCallback(async (playerId: string) => {
        const r = await pVideoPlayer.getVolume({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "getVolume", message: "getVolume failed" };

    }, []);
    /**
     * Method setMuted 
     * set the video muted parameter
     * @param playerId string
     * @param muted boolean
     */
    const setMuted = useCallback(async (playerId: string, muted: boolean) => {
        const r = await pVideoPlayer.setMuted({ playerId: playerId, muted: muted });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "setMuted", message: "setMuted failed" };

    }, []);
    /**
     * Method getMuted 
     * get the video muted parameter
     * @param playerId string
     */
    const getMuted = useCallback(async (playerId: string) => {
        const r = await pVideoPlayer.getMuted({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "getMuted", message: "getMuted failed" };

    }, []);
    /**
     * Method setCurrentTime 
     * set the video current time
     * @param playerId string
     * @param seektime number
     */
    const setCurrentTime = useCallback(async (playerId: string, seektime: number) => {
        const r = await pVideoPlayer.setCurrentTime({ playerId: playerId, seektime: seektime });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "setCurrentTime", message: "setCurrentTime failed" };

    }, []);
    /**
     * Method getCurrentTime 
     * get the video current time
     * @param playerId string
     */
    const getCurrentTime = useCallback(async (playerId: string) => {
        const r = await pVideoPlayer.getCurrentTime({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "getCurrentTime", message: "getCurrentTime failed" };

    }, []);
    /**
     * Method stopAllPlayers
     * stop all players
     */
    const stopAllPlayers = useCallback(async () => {
        const r = await pVideoPlayer.stopAllPlayers();
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "stopAllPlayers", message: "stopAllPlayers failed" };

    }, []);

    return { pVideoPlayer, initPlayer, isPlaying, play, pause, getDuration,
          setVolume, getVolume, setMuted, getMuted, setCurrentTime, 
          getCurrentTime, stopAllPlayers, isAvailable: true };
}
