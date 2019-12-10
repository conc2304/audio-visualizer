// to do make shared object functions into an object

// TODO these constants need to go back to MidiControlService.js or be imported
// TODO MidiControlService.js needs to be injected in files  (but also a few others)
const Note_Pressed   = 159;
const Note_Held      = 175;
const Note_Off       = 143;
const Knob_Active    = 176;
const Drum_Pad_Hit   = 153;


const easeInto = function() {
  let attribute;
  let easeBy;

  // if the message came from the drum pad
  // then ease into the target value,
  // once we have hit the target value
  // ease back into the reset value


  for (attribute in this) {
    if (!this.hasOwnProperty(attribute)) continue;
    if (!this[attribute].targetValue) continue;
    if (this[attribute].options) continue;

    const triggerIsDrumPad = (this[attribute].hasOwnProperty('triggerSource') && this[attribute].triggerSource === Drum_Pad_Hit);
    const targetValue = this[attribute].targetValue;
    const currentValue = this[attribute].currentValue;
    const resetValue = this[attribute].resetValue;

    if (this[attribute].hasOwnProperty('triggerSource')) {
      switch (this[attribute].triggerSource) {
        case Drum_Pad_Hit:
          easeBy = .001;
          break;
        case Note_Held:
          easeBy =  this[attribute].noteHeldEasing;
          break;
        default:
          easeBy = this[attribute].easingValue;
          break;
      }
    }

    // if the message came from the drum pad
    // then ease into the target value,
    // once we have hit the target value
    if (triggerIsDrumPad && targetValue === currentValue) {
      targetValue = this[attribute].targetValue = resetValue;
      this[attribute].triggerSource = null;  // once we have reached the peak unset the trigger source
    }

    // since we will near but never reach the target value with easing
    if (targetValue && (currentValue !== targetValue)) {
      const difference = targetValue - currentValue;
      const valueAdded = difference * easeBy;

      if (triggerIsDrumPad) {
        // if ( Math.floor(Math.abs(valueAdded)) === 0) {
        if (valueAdded < targetValue / 100 ) {        // if value added is less than 1% of of target value, then call it done
          this[attribute].currentValue = this[attribute].targetValue;
        } else {
          this[attribute].currentValue += valueAdded;
        }
      } else {
        this[attribute].currentValue += valueAdded;
      }
    }
  }
};



export default easeInto;
