
jest.mock('@capacitor/core', () => {
    var mIsPluginAvailable: boolean = true;
    var platform: string = 'ios';
return {
      Plugins: {
        CapacitorVideoPlayer: {
            initPlayer: async (options: any) => {
                return {result: true};             
            }
            /* TODO other methods */
        }
      },
      Capacitor: {
    
        __init: (isPluginAvailable: boolean, _platform: string) => {
            mIsPluginAvailable = isPluginAvailable;
            platform = _platform;
        },
        isPluginAvailable: () => mIsPluginAvailable,
        getPlatform: () => platform,
      }
    }
});
jest.mock('capacitor-video-player', () => {
    return {
    }
});
import { Plugins, Capacitor } from '@capacitor/core';
import { renderHook, act } from '@testing-library/react-hooks'
import { useVideoPlayer } from './useVideoPlayer';

it('Check CapacitorVideoPlayer available for ios platform', async () => {
    const capacitorMock = (Capacitor as any);
    await act(async () => {
        capacitorMock.__init(true,'ios');
    });
    const r = renderHook(() => useVideoPlayer());

    await act(async () => {
      const result = r.result.current;
      const { isAvailable } = result;
      expect(isAvailable).toBe(true);
    });
});
it('Check CapacitorVideoPlayer available for android platform', async () => {
    const capacitorMock = (Capacitor as any);
    await act(async () => {
        capacitorMock.__init(true,'android');
    });
    const r = renderHook(() => useVideoPlayer());
  
    await act(async () => {
      const result = r.result.current;
      const { isAvailable } = result;
      expect(isAvailable).toBe(true);
    });
});
it('Check CapacitorVideoPlayer available for electron platform', async () => {
    const capacitorMock = (Capacitor as any);
    await act(async () => {
        capacitorMock.__init(true, 'electron');
    });
    const r = renderHook(() => useVideoPlayer());
  
    await act(async () => {
      const result = r.result.current;
      const { isAvailable } = result;
      expect(isAvailable).toBe(true);
    });
});
it('Check CapacitorVideoPlayer available for web platform', async () => {
    const capacitorMock = (Capacitor as any);
    await act(async () => {
        capacitorMock.__init(false, 'web');
    });
    const r = renderHook(() => useVideoPlayer());
    await act(async () => {
    });
  
    await act(async () => {
      const result = r.result.current;
      const { isAvailable } = result;
      expect(isAvailable).toBe(true);
    });
});
    
