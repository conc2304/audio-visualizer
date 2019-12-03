import RegisteredSketches from '@/js/services/SketchRegistration';

/**
 * Updates the parameter properties for indicated sketch elements.
 * Can either reset or randomize the parameters.
 *
 * @param {Array} indicesToUpdate
 * @param {String} operation
 * @return {Void}
 */
const BulkUpdateService = (indicesToUpdate, operation) => {
  const globalReset = operation === 'reset' && indicesToUpdate.length === RegisteredSketches.length;

  if (!['reset', 'randomize'].includes(operation)) {
    throw new Error('Invalid argument received for operation type');
  }

  if (!Array.isArray(indicesToUpdate)) {
    throw new Error('Invalid argument. Expected Array and received ' + typeof idicesToUpdate);
  }

  for (let index in RegisteredSketches) {
    if (!indicesToUpdate.includes(index)) {
      continue;
    }

    if (!RegisteredSketches.hasOwnProperty(index)) {
      continue;
    }

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

      if (operation === 'randomize') {
        setRandomValue(index, prop);
      } else if (operation === 'reset') {
        if (globalReset === true) {
          RegisteredSketches[index][prop].lockOn = false;
        }
        setDefaultValue(index, prop);
      }
    }
  }

  return;
};

/**
 * Returns a random integer between the min and max values.
 * @param {*} min
 * @param {*} max
 * @return {Number}
 */
let getRandomInt = (min, max) => {
  'use strict';
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};

/**
 * Sets the target property for a sketch element to a random value
 * @param {Number} index
 * @param {String} prop
 * @return {Void}
 */
let setRandomValue = (index, prop) => {
  let rVal;
  if (RegisteredSketches[index][prop].attrType === 'numeric') {
    let min = parseFloat(RegisteredSketches[index][prop].min);
    let max = parseFloat(RegisteredSketches[index][prop].max);

    rVal = Math.random() * (max - min + min).toFixed(4);
  } else if (RegisteredSketches[index][prop].attrType === 'variable') {
    const optLength = RegisteredSketches[index][prop].options.length;
    const optIndex = getRandomInt(0, optLength - 1);

    rVal = RegisteredSketches[index][prop].options[optIndex];

    if (typeof rVal === 'undefined') {
      throw new Error('rVal was set to undifined');
    }
  }

  RegisteredSketches[index][prop].currentValue = rVal;
  RegisteredSketches[index][prop].targetValue = rVal;
};

/**
 * Rest thhe value of the indicated sketch property to its' default settings
 *
 * @param {Number} index
 * @param {String} prop
 * @return {Void}
 */
let setDefaultValue = (index, prop) => {
  if (RegisteredSketches[index][prop].attrType === 'numeric') {
    RegisteredSketches[index][prop].min = RegisteredSketches[index][prop].defaultMin;
    RegisteredSketches[index][prop].max = RegisteredSketches[index][prop].defaultMax;
  }

  RegisteredSketches[index][prop].currentValue = RegisteredSketches[index][prop].defaultValue;
  RegisteredSketches[index][prop].targetValue = RegisteredSketches[index][prop].defaultValue;
};

export default BulkUpdateService;
