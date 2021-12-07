import { KeepAwake } from '@capacitor-community/keep-awake';

export const preventSleep = async () => {
    try {
        await KeepAwake.keepAwake();
        return null
    } catch (e) {
        return e
    }
};

export const allowSleep = async () => {
    try {
      await KeepAwake.allowSleep();
      return null
    } catch (e) {
      return e
    }
};
