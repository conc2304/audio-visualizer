<<<<<<< HEAD
const Utils = {};
=======
import RegisteredSketches from '@/js/services/SketchRegistration';
import registeredSketches from './SketchRegistration';

>>>>>>> 30fac8a1084ca42a462a87566f2acf6034518b0a

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

<<<<<<< HEAD
Utils.formatTime = (time = 0) => {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60);
  const formattedTime = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
};

Utils.formatAudioFilename = file => {
  let currentSound = {};

  if (!file.size || !file.name) {
    return {
      title: 'Song Name',
      artist: 'Artist',
    };
  }

  if (file.name) {
    const filename = file.name.substring(0, file.name.lastIndexOf('.'));

    currentSound.artist = filename.lastIndexOf('-')
      ? filename.substring(0, filename.lastIndexOf('-')).trim()
      : null;

    currentSound.title = filename.indexOf('-')
      ? filename.substring(filename.indexOf('-') + 1).trim()
      : filename;
  }

  return currentSound;
};
=======
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
>>>>>>> 30fac8a1084ca42a462a87566f2acf6034518b0a

export default Utils;
