import RegisteredSketches from '@/js/services/SketchRegistration';
import BulkUpdateService from '@/js/services/BulkUpdaterService';

const KeyboardControlsService = {
  keyboardCtrl: {},
  ctrlElemPropToKeyMap: {},
};

/**
 *   For each of the properties associated with that key
 *   set the targetValue to the value associated to that key press
 *   on release set it back to the reset value
 * @param key
 * @param pressed
 */
KeyboardControlsService.playPianoKey = (key, pressed) => {
  const KCS = KeyboardControlsService;

  const ctrlHandlers = KCS.keyboardCtrl[key];
  let controlObject;

  for (let controlElementName in ctrlHandlers) {
    if (!ctrlHandlers.hasOwnProperty(controlElementName)) {
      continue;
    }

    for (let ctrlProp in ctrlHandlers[controlElementName]) {
      controlObject = RegisteredSketches[controlElementName];
      if (
        !ctrlHandlers[controlElementName].hasOwnProperty(ctrlProp) ||
        !RegisteredSketches[controlElementName] ||
        typeof RegisteredSketches[controlElementName] === 'undefined' ||
        typeof controlObject[ctrlProp] === 'undefined'
      ) {
        continue;
      }

      if (controlObject[ctrlProp].attrType === 'numeric') {
        if (pressed) {
          controlObject[ctrlProp].targetValue = controlObject[ctrlProp].currentValue = Number(
            ctrlHandlers[controlElementName][ctrlProp],
          );
        } else {
          controlObject[ctrlProp].targetValue = controlObject[ctrlProp].currentValue = Number(
            controlObject[ctrlProp].resetValue,
          );
        }
      }

      if (controlObject[ctrlProp].attrType === 'variable') {
        if (pressed) {
          controlObject[ctrlProp].currentValue = BulkUpdateService.getNextVariableOption(
            controlObject,
            ctrlProp,
          );
        } else {
          controlObject[ctrlProp].targetValue = controlObject[ctrlProp].currentValue = Number(
            controlObject[ctrlProp].resetValue,
          );
        }
      }
    }
  }
};

/**
 * During the draw cycle, loop through every keyboard key that we
 * have assigned a value to and if the key is down, then animate it
 * @returns {boolean}
 */
KeyboardControlsService.playKeyboardKeys = p5 => {
  let KCS = KeyboardControlsService;

  if (!KCS.keyboardCtrl) {
    return;
  }

  // key is the charcode for the key
  for (let key in KCS.keyboardCtrl) {
    if (!KCS.keyboardCtrl.hasOwnProperty(key)) {
      continue;
    }

    if (p5.keyIsDown(key)) {
      // then play the key
      KeyboardControlsService.playPianoKey(key, true);
    }
  }
};

/**
 * When the user enters a key into the input
 * save it to a key to controller map
 */
KeyboardControlsService.setKeyboardControl = (
  keyboardKey,
  value,
  property,
  sketchIndexSelected,
) => {
  let KCS = KeyboardControlsService;

  let ctrlObjectName = sketchIndexSelected;
  let charCode = keyboardKey.toUpperCase().charCodeAt(0);
  let propValue = value;

  if (!Number.isNaN(charCode) && ctrlObjectName !== null && property && propValue) {
    // only update the keyboard control if we have a key to control it with
    KCS.keyboardCtrl[charCode] = KCS.keyboardCtrl[charCode] || {};
    KCS.keyboardCtrl[charCode][ctrlObjectName] = KCS.keyboardCtrl[charCode][ctrlObjectName] || {};
    KCS.keyboardCtrl[charCode][ctrlObjectName][property] = Number(propValue);

    KCS.ctrlElemPropToKeyMap[ctrlObjectName] = KCS.ctrlElemPropToKeyMap[ctrlObjectName] || {};
    KCS.ctrlElemPropToKeyMap[ctrlObjectName][property] = charCode;
  } else {
    if (
      KCS.ctrlElemPropToKeyMap[ctrlObjectName] &&
      KCS.ctrlElemPropToKeyMap[ctrlObjectName][property]
    ) {
      let keyToClean = KCS.ctrlElemPropToKeyMap[ctrlObjectName][property];

      delete KCS.keyboardCtrl[keyToClean][ctrlObjectName][property];
      if (Object.size(KCS.keyboardCtrl[keyToClean][ctrlObjectName]) === 0) {
        delete KCS.keyboardCtrl[keyToClean][ctrlObjectName];
      }

      if (Object.size(KCS.keyboardCtrl[keyToClean]) === 0) {
        delete KCS.keyboardCtrl[keyToClean];
      }
      delete KCS.ctrlElemPropToKeyMap[ctrlObjectName][property];
    }

    if (Object.size(KCS.ctrlElemPropToKeyMap[ctrlObjectName]) === 0) {
      delete KCS.ctrlElemPropToKeyMap[ctrlObjectName];
    }
  }
};

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

export default KeyboardControlsService;
