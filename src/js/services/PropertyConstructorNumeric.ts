export default class NumericProperty {

  constructor (
    public displayLabel: string,
    public category: string,
    public defaultValue: number,
    public defaultMin: number,
    public defaultMax: number,
    public easingValue: number = 0.7) {

    const startValue = defaultValue !== null ? defaultValue : defaultMin !== null && defaultMax !== null ? (defaultMin + defaultMax) * 0.51 : 0;

    this.resetValue = startValue;
    this.defaultValue = startValue;
    this.currentValue = startValue;

    //  this value that can be set/edited by the user
    const padding = 0;
    this.min = defaultMin + padding;
    this.max = defaultMax - padding;
  }

  public attrType = "numeric";

  public resetValue: number;
  public currentValue: number;
  public min: number;
  public max: number;

  public audio = {
    responsiveType: 'add',
    responsiveOptions: [ 'add', 'subtract' ],
    gain: 0.5,
    fall: 1, // not sure what this will do yet
  };

  public targetValue = null;
  public triggerSource = null;
  public lockOn = false;
  public noteHeldEasing = 0.1;
  public easingMax = 0;
  public easingMin = 0;
}


