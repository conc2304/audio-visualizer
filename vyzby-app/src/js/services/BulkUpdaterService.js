import RegisteredSketches from '@/js/services/SketchRegistration';
let BulkUpdaterService = {};

/**
 *
 * @param {Array} indices
 */
let resetParameters = indices => {
  let ctrlElementsArray = [];
  for (let i in indices) {
    ctrlElementsArray.push(RegisteredSketches[i]);
  }

  // randomizeAudioResponsiveOption(false, true);
  // randomizeAudioFrequency(false, true);

  let globalReset = true;
  for (let index in ctrlElementsArray) {
    if (!ctrlElementsArray.hasOwnProperty(index)) {
      continue;
    }

    let ctrlElem = ctrlElementsArray[index];

    for (let prop in ctrlElem) {
      if (
        !ctrlElem.hasOwnProperty(prop) ||
        !ctrlElem[prop].defaultValue ||
        !ctrlElem[prop].currentValue
      ) {
        continue;
      }

      if (ctrlElem[prop].lockOn === true) {
        continue;
      }

      if (ctrlElem[prop].attrType === 'numeric') {
        RegisteredSketches[index][prop].currentValue = RegisteredSketches[index][prop].defaultValue;
        RegisteredSketches[index][prop].targetValue = RegisteredSketches[index][prop].defaultValue;
        RegisteredSketches[index][prop].min = RegisteredSketches[index][prop].defaultMin;
        RegisteredSketches[index][prop].max = RegisteredSketches[index][prop].defaultMax;
      } else if (ctrlElem[prop].attrType === 'variable') {
        RegisteredSketches[index][prop].currentValue = RegisteredSketches[index][prop].defaultValue;
      }

      if (globalReset === true) {
        RegisteredSketches[index][prop].lockOn = false;
      }
    }
  }

  return;
};

let randomizeParameters = (indices) => {
  let ctrlElementsArray = [];
  for (let i in indices) {
    ctrlElementsArray.push(RegisteredSketches[i]);
  }

  let rVal;
  let valueRange;
  let optLength;
  let optIndex;

  for (let index in ctrlElementsArray) {
    if (!ctrlElementsArray.hasOwnProperty(index)) {
      continue;
    }

    const ctrlElem = ctrlElementsArray[index];

    for (let prop in ctrlElem) {
      if (
        !ctrlElem.hasOwnProperty(prop) ||
        !ctrlElem[prop].defaultValue ||
        !ctrlElem[prop].currentValue
      ) {
        continue;
      }

      if (ctrlElem[prop].lockOn === true) {
        continue;
      }

      if (ctrlElem[prop].attrType === 'numeric') {
        rVal =
          Math.random() *
          (
            parseFloat(ctrlElem[prop].max) -
            parseFloat(ctrlElem[prop].min) +
            parseFloat(ctrlElem[prop].min)
          ).toFixed(4);
      } else if (ctrlElem[prop].attrType === 'variable') {
        optLength = ctrlElem[prop].options.length;
        optIndex = getRandomInt(0, optLength - 1);
        rVal = ctrlElem[prop].options[optIndex];

        if (typeof rVal === 'undefined') {
          console.log('stop');
        }
      }

      RegisteredSketches[index][prop].currentValue = rVal;
      RegisteredSketches[index][prop].targetValue = rVal;
    }
  }

  return
};

let getRandomInt = (min, max) => {
  'use strict';
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};

BulkUpdaterService.resetParameters = resetParameters;
BulkUpdaterService.randomizeParameters = randomizeParameters;

export default BulkUpdaterService;
