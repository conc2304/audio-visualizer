// import RegisteredSketches from '@/js/services/SketchRegistration';

import * as RegisteredSketches from "../services/SketchRegistration"


export default new class Utils {

  public getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
  };


  public formatAudioFilename(file: File): { artist: string, title: string } | File {
    let currentSound = {
      artist: '',
      title: '',
    };

    // local server file
    if (file.hasOwnProperty('path')) {
      return file;
    }

    // uploaded remote file
    if (!file || !file.size || !file.name) {
      return currentSound;
    }

    if (file.name) {
      const filename = file.name.substring(0, file.name.lastIndexOf('.'));

      currentSound.artist = filename.lastIndexOf('-')
        ? this.ucFirst(filename.substring(0, filename.lastIndexOf('-')).trim())
        : '';

      currentSound.title = filename.indexOf('-')
        ? this.ucFirst(filename.substring(filename.indexOf('-') + 1).trim())
        : filename;
    }

    return currentSound;
  }


  public formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);
    const formattedTime = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);

    return formattedTime;
  };


  public sketchPropertyIterator = (registeredSketches: Array<any>, fn: Function) => {
    for (let index in RegisteredSketches) {
      for (let prop in RegisteredSketches[index]) {
        if (
          !RegisteredSketches[index].hasOwnProperty(prop) ||
          !RegisteredSketches[index][prop].hasOwnProperty('defaultValue') ||
          !RegisteredSketches[index][prop].hasOwnProperty('currentValue')
        ) {
          continue;
        }

        if (RegisteredSketches[index][prop].lockOn) {
          continue;
        }

        RegisteredSketches[index][prop] = fn(RegisteredSketches[index][prop]);

      }
    }
  }

  public ucFirst = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public guidGenerator = () => {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }
}


// Object.size = obj => {
//   let size = 0,
//     key;
//   for (key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       size++;
//     }
//   }
//   return size;
// };

