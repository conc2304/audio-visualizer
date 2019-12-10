class VariableProperty {
  constructor(displayLabel, propCategory, defaultValue, options) {
    this.attrType = 'variable';
    this.displayLabel = displayLabel;
    this.category = propCategory;

    this.resetValue = defaultValue;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;
    this.targetValue = null;
    this.options = options;
    this.lockOn = false;
  }
}

export default VariableProperty;
