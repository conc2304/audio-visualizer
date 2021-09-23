import { getRandomInt } from '@/js/services/Utils';
import P5Sketch from '../interfaces/P5Sketch.interface';

export enum ParameterOperation {
  RESET = 'RESET',
  RANDOMIZE = 'RANDOMIZE',
}

/**
 * Updates the parameter properties for indicated sketch elements.
 * Can either reset or randomize the parameters.
 *
 */
export const changeParameterValues = (RegisteredSketches: Array<P5Sketch>, indicesToUpdate: Array<string | number>, operation: ParameterOperation): Array<P5Sketch> => {
  console.log('changeParameterValues');

  console.log(operation);
  const globalReset =
    operation === ParameterOperation.RANDOMIZE &&
    indicesToUpdate.length === RegisteredSketches.length;

  if (![ ParameterOperation.RESET, ParameterOperation.RANDOMIZE ].includes(operation)) {
    throw new Error('Invalid argument received for operation type');
  }

  if (!Array.isArray(indicesToUpdate)) {
    throw new Error(
      'Invalid argument. Expected Array and received ' + typeof indicesToUpdate,
    );
  }

  let updatedSketches = [];

  for (let index in RegisteredSketches) {
    if (!indicesToUpdate.includes(index)) continue;

    let oldSketchProps = RegisteredSketches[ index ];
    let { dynamicProps } = oldSketchProps;

    console.log(100, dynamicProps);

    for (let prop in RegisteredSketches[ index ].dynamicProps) {
      let sketchPropertyAttributes = dynamicProps[ prop ];

      if (
        !sketchPropertyAttributes?.defaultValue ||
        !sketchPropertyAttributes?.currentValue
      ) continue;
      if (sketchPropertyAttributes.lockOn && !globalReset) continue;

      let propValues = { ...sketchPropertyAttributes };
      console.log(101, propValues);

      if (operation === ParameterOperation.RANDOMIZE) {
        const randomValues = getRandomValue(sketchPropertyAttributes);
        console.log(101.5, randomValues);
        propValues = { ...propValues, ...randomValues };

      } else if (operation === ParameterOperation.RESET) {
        if (globalReset) {
          propValues = { ...propValues, lockOn: false };
        }
        const defaultValues = getDefaultValue(sketchPropertyAttributes);
        propValues = { ...propValues, ...defaultValues };
      }


      console.log(102, dynamicProps);
      dynamicProps = { ...dynamicProps, [ prop ]: propValues };
      console.log(103, dynamicProps);

    } // end properties of current sketch

    updatedSketches[ index ] = { ...RegisteredSketches[ index ], dynamicProps };// incorrect

  } // end index of all sketches
  console.log(104, updatedSketches);
  return updatedSketches;
};

/**
 * Cycle to the next available option for an attribute
 */
export const getNextVariableOption = (sketch: P5Sketch, attr) => {
  if (!sketch.dynamicProps[ attr ].options) {
    return;
  }

  let numOptions = sketch.dynamicProps[ attr ].options.length;
  let index = sketch[ attr ].options.indexOf(sketch.dynamicProps[ attr ].currentValue);
  index = (index + 1) % numOptions;

  return sketch.dynamicProps[ attr ].options[ index ];
};

/**
 * Sets the target property for a sketch element to a random value

 */
export const getRandomValue = (property) => {
  let rVal;
  if (property.attrType === 'numeric') {
    const min = parseFloat(property.min);
    const max = parseFloat(property.max);

    rVal = Number((Math.random() * (max - min + min)).toFixed(4));
  } else if (property.attrType === 'variable') {
    const optLength = property.options.length;
    const optIndex = getRandomInt(0, optLength - 1);

    rVal = property.options[ optIndex ];

    if (typeof rVal === 'undefined') {
      throw new Error('rVal was set to undefined');
    }
  }
  return {
    currentValue: rVal,
    targetVal: rVal,
  };
};

/**
 * Reset the value of the indicated sketch property to their default settings
 */
const getDefaultValue = (property) => {
  let { min, defaultMin, max, defaultMax, currentValue, defaultValue, targetVal } = property;

  min = defaultMin;
  max = defaultMax;
  currentValue = defaultValue;
  targetVal = defaultValue;

  return {
    min,
    max,
    currentValue,
    targetVal
  };
};


