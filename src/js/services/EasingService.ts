// to do make shared object functions into an object

// TODO these constants need to go back to MidiControlService.js or be imported
// TODO MidiControlService.js needs to be injected in files  (but also a few others)
const Note_Pressed = 159;
const Note_Held = 175;
const Note_Off = 143;
const Knob_Active = 176;
const Drum_Pad_Hit = 153;

export default function easeInto(this) {
  let property;
  let easeBy = 0.7;

  // if the message came from the drum pad
  // then ease into the target value,
  // once we have hit the target value
  // ease back into the reset value

  const { dynamicProps } = this;

  for (property in dynamicProps) {
    const currentProperty = dynamicProps[ property ];
    const { targetValue, currentValue, resetValue } = currentProperty;

    if (
      targetValue === null ||
      targetValue === currentValue ||
      dynamicProps[ property ].options
    ) {
      continue;
    }

    const triggerIsDrumPad =
      dynamicProps[ property ].hasOwnProperty('triggerSource') &&
      dynamicProps[ property ].triggerSource === Drum_Pad_Hit;

    switch (this.dynamicProps[ property ].triggerSource) {
      case Drum_Pad_Hit:
        easeBy = 0.001;
        break;
      case Note_Held:
        easeBy = this.dynamicProps[ property ]?.noteHeldEasing ?? 0.6;
        break;
      default:
        easeBy = this.dynamicProps[ property ]?.easingValue ?? 0.7;
        break;
    }

    // if the message came from the drum pad
    // then ease into the target value,
    // once we have hit the target value
    // if (triggerIsDrumPad && targetValue === currentValue) {
    //   this.dynamicProps[ property ].targetValue = resetValue;
    //   targetValue = resetValue;
    //   this.dynamicProps[ property ].triggerSource = null; // once we have reached the peak unset the trigger source
    // }

    // since we will near but never reach the target value with easing
    if (targetValue && currentValue !== targetValue) {
      const difference = targetValue - currentValue;
      const valueAdded = difference * easeBy;
      let newValue;

      if (triggerIsDrumPad) {
        if (valueAdded < targetValue / 100) {
          // if value added is less than 1% of of target value, then call it done
          newValue = targetValue;
        } else {
          newValue = currentValue + valueAdded;
        }
      } else {
        newValue = currentValue + valueAdded;
      }

      this.dynamicProps[ property ].currentValue = newValue;
    }
  }
}

// export default easeInto;
