import RegisteredSketches from './SketchRegistration';
import { File } from 'p5';

export class Utils {

  getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
  };

  formatAudioFilename(file: File) {

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
        ? this.ucFirst(filename.substring(0, filename.lastIndexOf('-')).trim())
        : null;

      currentSound.title = filename.indexOf('-')
        ? this.ucFirst(filename.substring(filename.indexOf('-') + 1).trim())
        : filename;
    }

    return currentSound;
  };

  formatTime(time: number): string {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);
    const formattedTime = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);

    return formattedTime;
  };

  sketchPropertyIterator(fn: Function, globalReset: boolean) {
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

  ucFirst(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  guidGenerator(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  };
}




export default new Utils();
