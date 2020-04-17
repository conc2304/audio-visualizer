import RegisteredSketches from '@/js/services/SketchRegistration';

const Utils = {};
/**
 * Returns a random integer between the min and max values.
 * @param {*} min
 * @param {*} max
 * @return {Number}
 */
Utils.getRandomInt = (min, max) => {
  'use strict';
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};

Utils.formatAudioFilename = file => {

  // local server file
  if (file.path) {
    return file;
  }

  // uploaded remote file
  if (!file || !file.size || !file.name) {
    return false;
  }

  let currentSound = {};
  if (file.name) {
    const filename = file.name.substring(0, file.name.lastIndexOf('.'));

    currentSound.artist = filename.lastIndexOf('-')
      ? Utils.ucFirst(filename.substring(0, filename.lastIndexOf('-')).trim())
      : null;

    currentSound.title = filename.indexOf('-')
      ? Utils.ucFirst(filename.substring(filename.indexOf('-') + 1).trim())
      : filename;
  }

  return currentSound;
};

Utils.formatTime = time => {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60);
  const formattedTime = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);

  return formattedTime;
};

/**
 *
 */
Utils.sketchPropertyIterator = (registeredSketches, fn) => {
  for (let index in RegisteredSketches) {
    for (let prop in RegisteredSketches[index]) {
      if (
        !RegisteredSketches[index].hasOwnProperty(prop) ||
        !RegisteredSketches[index][prop].hasOwnProperty('defaultValue') ||
        !RegisteredSketches[index][prop].hasOwnProperty('currentValue')
      ) {
        continue;
      }

      if (RegisteredSketches[index][prop].lockOn === true && !globalReset) {
        continue;
      }

      RegisteredSketches[index][prop] = fn(RegisteredSketches[index][prop]);

    }
  }
}

Utils.ucFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Utils.guidGenerator = () => {
  const S4 = () => {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

Object.size = obj => {
  let size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
};

export default Utils;
