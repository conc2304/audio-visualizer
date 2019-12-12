
let midiAvailable = false;

/**
 * Request access to the midi controller
 */
if (navigator.requestMIDIAccess) {
  console.log('This browser supports WebMIDI!');
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  console.log('WebMIDI is not supported in this browser.');
}


/**
 * Run when requestMIDIAccess is successful
 * @param midiAccess
 */
function onMIDISuccess(midiAccess) {
  "use strict";

  console.log(midiAccess);
  for (let input of midiAccess.inputs.values()) {
    console.log(input);
    input.onmidimessage = getMIDIMessage;
    midiAvailable = true;
  }
}

/**
 * Run when requestMIDIAccess fails
 */
function onMIDIFailure() {
  console.log('Error: Could not access MIDI devices.');
}


// Function to parse the MIDI messages we receive
// For this app, we're only concerned with the actual note value,
// but we can parse for other information, as well
/**
 *
 * @param message
 */
function getMIDIMessage(message) {
  let command = message.data[0];  // command is the midi channel
  let note = message.data[1];
  let velocity = (message.data.length > 2) ? message.data[2] : message.data[1]; // a velocity value might not be included with a noteOff command
  let timeStamp = message.timeStamp;

  // console.log(`c: ${command} n: ${note} v: ${velocity} t: ${timeStamp}`);

  switch (command) {

    case Note_Held:
      noteHeld(message);
      break;
    case Note_Off:
      noteOff(message);
      break;
    case Knob_Active:
      knobActive(message);
      break;
    case Drum_Pad_Hit:
      drumHit(message);
      break;
    case Note_Pressed:
    default :
      if (velocity > 0) {
        noteOn(message);
      } else {
        noteOff(message);
      }
      break;

    // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}

