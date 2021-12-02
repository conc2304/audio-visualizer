class VariableProperty {
  constructor(
    public displayLabel: string,
    public category: string,
    public defaultValue: string,
    public options: Array<string>,
  ) {
    this.resetValue = defaultValue;
    this.currentValue = defaultValue;
  }
  public attrType = 'variable';
  public lockOn = false;

  public targetValue: string = null;
  public resetValue: string;
  public currentValue: string;
}

export default VariableProperty;
