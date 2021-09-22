import { getRandomInt } from '@/js/services/Utils';
import store from '../../store';



/**
 * Updates the parameter properties for indicated sketch elements.
 * Can either reset or randomize the parameters.
 *
 * @param {Array} indicesToUpdate
 * @param {String} operation
 * @return {Void}
 */
export const changeParameterValues = ({ RegisteredSketches = [], indicesToUpdate = [], operation }) => {
  console.log('changeParameterValues');
  // const RegisteredSketches = [ ...store.getters.RegisteredSketches ];
  const globalReset =
    operation === 'reset' &&
    indicesToUpdate.length === RegisteredSketches.length;

  if (![ 'reset', 'randomize' ].includes(operation)) {
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

    for (let prop in RegisteredSketches[ index ].dynamicProperties) {
      let sketchPropertyAttributes = oldSketchProps.dynamicProperties[ prop ];

      if (
        !sketchPropertyAttributes?.defaultValue ||
        !sketchPropertyAttributes?.currentValue
      ) continue;
      if (sketchPropertyAttributes.lockOn && !globalReset) continue;

      let propValues = { ...sketchPropertyAttributes };
      console.log(101, propValues);

      if (operation === 'randomize') {
        const randomValues = getRandomValue(sketchPropertyAttributes);

        propValues = { ...propValues, ...randomValues };

      } else if (operation === 'reset') {
        if (globalReset) {
          propValues = { ...propValues, lockOn: false };
        }
        const defaultValues = getDefaultValue(sketchPropertyAttributes);
        propValues = { ...propValues, ...defaultValues };
      }

      dynamicProps = { ...dynamicProps, [ prop ]: propValues };

    } // end properties of current sketch
    updatedSketches[ index ] = { ...RegisteredSketches[ index ], ...dynamicProps };// incorrect

  } // end index of all sketches

  return updatedSketches;
};

/**
 * Cycle to the next available option for an attribute
 * @param ctrlElement   - the instance whose attributes we are changing
 * @param attr          - the attribute we are changing in the instance
 * @returns {string}    - the string value that we are setting
 */
export const getNextVariableOption = (ctrlElement, attr) => {
  if (!ctrlElement[ attr ].options) {
    return;
  }

  let numOptions = ctrlElement[ attr ].options.length;
  let index = ctrlElement[ attr ].options.indexOf(ctrlElement[ attr ].currentValue);
  index = (index + 1) % numOptions;

  return ctrlElement[ attr ].options[ index ];
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


