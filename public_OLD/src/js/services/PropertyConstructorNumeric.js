class NumericProperty {
  /**
   *
   * @param {String} displayLabel
   * @param {String} propCategory
   * @param {Number} defaultValue
   * @param {Number} minValue
   * @param {Number} maxValue
   * @param {Number} easingValue
   */
  constructor(displayLabel, propCategory, defaultValue, minValue, maxValue, easingValue) {
    this.attrType = 'numeric';
    this.displayLabel = displayLabel;
    this.category = propCategory;

    this.resetValue = defaultValue;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;
    // this.currentValue = (minValue + maxValue) * 0.51;
    this.targetValue = null;

    //  this value that can be set/edited by the user
    const padding = 0;
    this.min = minValue + padding;
    this.max = maxValue - padding;

    //  this is the range within which the user can edit the min and max values
    this.defaultMin = minValue;
    this.defaultMax = maxValue;

    this.audio = {
      responsiveType: 'add',
      responsiveOptions: ['add', 'subtract'],
      gain: 0.5,
      fall: 1, // not sure what this will do yet
    };

    this.triggerSource = null;
    this.lockOn = false;
    this.easingValue = easingValue;
    this.noteHeldEasing = 0.1;
    this.easingMax = 0;
    this.easingMin = 0;
  }
}

export default NumericProperty;
