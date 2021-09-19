import { File } from 'p5';
import store from '@/store';


export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};

export const formatAudioFilename = (file: File) => {

  // local server file
  if ((file as any)[ 'path' ]) {
    return file;
  }

  // uploaded remote file
  if (!file || !file.size || !file.name) {
    return false;
  }

  let currentSound: { artist: string | null, title: string | null; } = {
    artist: null,
    title: null
  };

  if (file.name) {
    const filename = file.name.substring(0, file.name.lastIndexOf('.'));

    currentSound.artist = filename.lastIndexOf('-')
      ? ucFirst(filename.substring(0, filename.lastIndexOf('-')).trim())
      : null;

    currentSound.title = filename.indexOf('-')
      ? ucFirst(filename.substring(filename.indexOf('-') + 1).trim())
      : filename;
  }

  return currentSound;
};

export const formatTime = (time: number): string => {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60);
  const formattedTime = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);

  return formattedTime;
};

export const sketchPropertyIterator = (RegisteredSketches, fn: Function, globalReset: boolean) => {
  for (let index in RegisteredSketches) {
    for (let prop in RegisteredSketches[ index ]) {
      if (
        !RegisteredSketches[ index ].hasOwnProperty(prop) ||
        !RegisteredSketches[ index ][ prop ].hasOwnProperty('defaultValue') ||
        !RegisteredSketches[ index ][ prop ].hasOwnProperty('currentValue')
      ) {
        continue;
      }

      if (RegisteredSketches[ index ][ prop ].lockOn === true && !globalReset) {
        continue;
      }

      RegisteredSketches[ index ][ prop ] = fn(RegisteredSketches[ index ][ prop ]);
    }
  }
};

export const ucFirst = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const guidGenerator = (): string => {
  const S4 = (): string => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

export const degreeToRadian = (degree: number): number => {
  return degree * (Math.PI / 180);
};






