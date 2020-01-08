import RegisteredSketches from '@/js/services/SketchRegistration';
import registeredSketches from './SketchRegistration';


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

export default Utils;
