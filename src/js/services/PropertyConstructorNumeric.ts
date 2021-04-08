import { AudioProperties } from '@/shared/models/p5Sketch';

export default class NumericProperty {

  public attrType = "numeric";
  public displayLabel: string;
  public category: string;

  public resetValue: number;
  public defaultValue: number;
  public currentValue: number;
  public targetValue = null;

  public min: number;
  public max: number;

  public defaultMin: number;
  public defaultMax: number;

  public triggerSource = null;
  public lockOn = false;
  public easingValue: number;
  public noteHeldEasing = 0.1;
  public easingMax = 0;
  public easingMin = 0;

  public audio: AudioProperties = {
    responsiveType: 'add',
    responsiveOptions: [ 'add', 'subtract' ],
    gain: 0.5,
    fall: 1, // not sure what this will do yet
  };

  constructor (displayLabel: string, propCategory: string, defaultValue: number, minValue: number, maxValue: number, easingValue: number) {
    this.displayLabel = displayLabel;
    this.category = propCategory;

    this.resetValue = defaultValue;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;

    //  this value that can be set/edited by the user
    const padding = 0;
    this.min = minValue + padding;
    this.max = maxValue - padding;

    //  this is the range within which the user can edit the min and max values
    this.defaultMin = minValue;
    this.defaultMax = maxValue;

    this.easingValue = easingValue;
  }
}

