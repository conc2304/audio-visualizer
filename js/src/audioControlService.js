let uploadLoading = false;
let uploadedAudio;
let autoPlayOn = false;
let peakCount = 0;


const freqBands5 = {
  low: {
    optGroup: 'Low',
    ranges: [
      [1, 140],
    ]
  },
  midLow: {
    optGroup: 'Mid - Low',
    ranges: [
      [140, 400],
    ]
  },
  mid: {
    optGroup: 'Mid',
    ranges: [
      [400, 2600],
    ]
  },
  midHigh: {
    optGroup: 'Mid - High',
    ranges: [
      [2600, 5200],
    ]
  },
  high: {
    optGroup: 'High',
    ranges: [
      [5200, 14000],  // fft analysis breaks at 23,000k hz
    ]
  },
};

const freqBands10 = {
  low: {
    optGroup: 'Low',
    ranges: [
      [32, 64],
    ]
  },
  midLow: {
    optGroup: 'Mid - Low',
    ranges: [
      [64, 125],
      [125, 250],
    ]
  },
  mid: {
    optGroup: 'Mid',
    ranges: [
      [250, 500],
      [500, 1000],
      [1000, 2000],
    ]
  },
  midHigh: {
    optGroup: 'Mid - High',
    ranges: [
      [2000, 4000],
      [4000, 8000],
    ]
  },
  high: {
    optGroup: 'High',
    ranges: [
      [8000, 16000],
      [16000, 22000],  // fft analysis breaks at 23,000k hz
    ]
  },
};

const freqBands31 = {
  low: {
    optGroup: 'Low',
    ranges: [
      [20, 25],
      [25, 31.5],
      [31.5, 40],
      [40, 50],
      [50, 63],
    ]
  },
  midLow: {
    optGroup: 'Mid - Low',
    ranges: [
      [63, 80],
      [80, 100],
      [100, 125],
      [125, 160],
      [160, 200],
      [200, 250],
    ]
  },
  mid: {
    optGroup: 'Mid',
    ranges: [
      [250, 315],
      [315, 400],
      [400, 500],
      [500, 630],
      [630, 800],
      [800, 1000],
      [1000, 1250],
      [1250, 1600],
      [1600, 2000],
    ]
  },
  midHigh: {
    optGroup: 'Mid - High',
    ranges: [
      [2000, 2500],
      [2500, 3100],
      [3100, 4000],
      [4000, 5000],
      [5000, 6300],
      [6300, 8000],
    ]
  },
  high: {
    optGroup: 'High',
    ranges: [
      [8000, 10000],
      [10000, 12500],
      [12500, 16000],
      [16000, 20000],  // fft analysis breaks at 23,000k hz
    ]
  },
};


let freqBands = freqBands5;
let backgroundStrobe = false;

/**
 * On file upload trigger callback to play new file.
 * @param file
 */
let uploaded = (file) => {
  uploadLoading = true;
  setup(file.data);

  buttonPlay.html("pause");
  let track =  {
    title: file.name,
    permalink_url: ''
  }
  currentIndex = 0;
  tracks.unshift(track);
};



/**
 * Callback from when uploaded get called.
 * Stop the current audio and then upload new audio
 */
let uploadedAudioPlay = () => {

  uploadLoading = false;

  if (audio.isPlaying()) {
    console.log('is playing');
    audio.stop();
  }
  audio.stop();
  audio = uploadedAudio;
  audio.play();
  audio.loop();
};



/**
 * Stop and play the audio file
 * and change the display of the pause/play button
 */
let toggleAudio = () => {
  if (audio.isPlaying()) {
    audio.pause();
    $("#play-audio").html('&#9658;');
  } else {
    // audio.play();
    audio.loop();
    $("#play-audio").html('&#10074; &#10074;');
  }
};
// end reference



/**
 * Given each eq band, assign the energy levels for each band to that group
 * to be applied to elements that respond to each of those frequencies
 * @param fft
 * @param freqBands - a hardcoded set of frequency bands that we have prebuilt as an eq band
 * @returns {Array}
 */
let getEQEnergy = (fft) => {

  if (!fft) {
    return;
  }

  fft.analyze();

  if (backgroundStrobe) {
    peakDetect.update(fft);

    if (peakDetect.isDetected) {
      bgColor = 200;
      peakCount++;
      if (autoPlayOn) {
        if (peakCount%32 === 0) {
          randomizeSettings(false, 50);
          console.log('32')
        } 
        else if (peakCount%16 === 0) {
          randomizeSettings(false, 20);
          console.log('16')
        } else if (peakCount%8 == 0) {
          randomizeSettings(false, 1);
          console.log('8')
        }
      }
    } else {
      bgColor = bgColor * 0.0005;
    }
  }

  let fftAnalysis = [];
  fftAnalysis[0] = 0;  // account for the default text 'Frequency Ranges'

  let range;
  if (freqBands) {
    for (let i in freqBands) {
      if (!freqBands.hasOwnProperty(i)) {
        continue;
      }
      let band = freqBands[i];
      for (let j in  band.ranges) {
        if (!band.ranges.hasOwnProperty(j)) {
          continue;
        }

        range = band.ranges[j];
        fftAnalysis[`${range[0]} - ${range[1]} Hz`] = fft.getEnergy(range[0], range[1]); // lower and upper bound
      }
    }
  }

  return fftAnalysis;
};



let audioCtrl = {};
let elementPropToFQMap = {};
/**
 * On DOM dropdown select:
 * Map the selected frequency range to the given property and store globally
 * @param e - the event
 */
let setAudioCtrl = (e) => {
  "use strict";

  // console.log(e);

  let controlEl = $(e.target).data('ctrl_object');
  let property = $(e.target).data('prop');

  let value = e.target.selectedOptions[0].value;

  if (e.target.selectedIndex !== 0) {
    audioCtrl[value] = audioCtrl[value] || {};
    audioCtrl[value][controlEl] = audioCtrl[value][controlEl] || {};
    audioCtrl[value][controlEl][property] = audioCtrl[value][controlEl][property];

    elementPropToFQMap[controlEl] = elementPropToFQMap[controlEl] || {};
    elementPropToFQMap[controlEl][property] = value;
  } else {
    console.log('cleaning ');

    if (elementPropToFQMap[controlEl] && elementPropToFQMap[controlEl][property]) {

      let freqToClean = elementPropToFQMap[controlEl][property];
      console.log(freqToClean);

      delete audioCtrl[freqToClean][controlEl][property];
      if (Object.size(audioCtrl[freqToClean][controlEl]) === 0) {
        delete audioCtrl[freqToClean][controlEl];
      }

      if (Object.size(audioCtrl[freqToClean]) === 0) {
        delete audioCtrl[freqToClean];
      }
      delete elementPropToFQMap[controlEl][property];
    }


    if (Object.size(elementPropToFQMap[controlEl]) === 0) {
      delete elementPropToFQMap[controlEl];
    }
  }

  console.log(audioCtrl);
  console.log(elementPropToFQMap);
};



/**
 * Loop through all of the elements that have audio reactive set,
 * and apply the frequency to the element property.
 * We map the audio frequency value between the minimum and maximum for the property.
 * We then adjust the target value using the reset or target value based on responsiveness type
 * @param energyValues - an array of amplitude readings for each frequency
 * @returns {boolean}
 */
let applyAudioEnergyValues = (energyValues) => {
  "use strict";

  if (!energyValues || energyValues.size < 1) {
    return false;
  }

  let controlObject;
  let audioValue;

  let ctrlHandlers = elementPropToFQMap;
  // console.log(ctrlHandlers);
  for (let controlElementName in ctrlHandlers) {
    if (!ctrlHandlers.hasOwnProperty(controlElementName)) {
      continue;
    }

    controlObject = myp5[`get${controlElementName}`]();
    for (let ctrlProp in ctrlHandlers[controlElementName]) {
      if (!ctrlHandlers[controlElementName].hasOwnProperty(ctrlProp)) {
        continue;
      }

      let eqBand = ctrlHandlers[controlElementName][ctrlProp];
      // the value in eq band will be somewhere between 0 and 255
      // we need to scale that between the upper and lower bounds of the element
      if (energyValues[eqBand] === 0) {
        continue;
      } else {
        audioValue = myp5.map(energyValues[eqBand], 0, 255, controlObject[ctrlProp].min, controlObject[ctrlProp].max);
      }

      audioValue = audioValue * controlObject[ctrlProp].audio.gain;

      let setValue;
      let overBy;
      switch (controlObject[ctrlProp].audio.responsiveType) {
        case "infinite":
          audioValue = myp5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);
          audioValue = audioValue * 0.01;
          setValue = controlObject[ctrlProp].targetValue + audioValue;
          break;
        case "loop up":
          audioValue = myp5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);

          audioValue = audioValue * 0.01;
          // increase it by how much it went over and then loop from top again
          if (controlObject[ctrlProp].targetValue + audioValue > controlObject[ctrlProp].max) {
            overBy = controlObject[ctrlProp].targetValue + audioValue - controlObject[ctrlProp].max;
            setValue = controlObject[ctrlProp].min + overBy;
          } else {
            setValue = controlObject[ctrlProp].targetValue + audioValue;
          }
          break;
        case "loop down":
          audioValue = myp5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);

          audioValue = audioValue * 0.01;
          // decrease it by how much it went under and then loop from top again
          if (controlObject[ctrlProp].targetValue - audioValue < controlObject[ctrlProp].min) {
            overBy = controlObject[ctrlProp].targetValue - audioValue + controlObject[ctrlProp].min;
            setValue = controlObject[ctrlProp].max - overBy;
          } else {
            setValue = controlObject[ctrlProp].targetValue - audioValue;
          }
          break;
        case "subtract":
          setValue = controlObject[ctrlProp].resetValue - Number(audioValue.toFixed(3));
          break;
        case "add":
        default:
          setValue = controlObject[ctrlProp].resetValue + Number(audioValue.toFixed(3));
          break;
      }

      controlObject[ctrlProp].targetValue = setValue;
    }
  }
};



/**
 * From radio input change the value of the responsive type for that contorl element
 * @param radioElem
 */
let setAudioResponsiveType = (radioElem) => {
  "use strict";

  // console.log($(radioElem).parent().find('input:radio:checked').val());
  // console.log(radioElem);

  let value = $(radioElem).val();
  let controlElementName = $(radioElem).data('ctrl_object');
  let prop = $(radioElem).data('prop');

  let controlObject = myp5[`get${controlElementName}`]();
  if (controlObject[prop].lockOn === false) {
    controlObject[prop].audio.responsiveType = value;
  }
};


/**
 * Randomize both the frequency and the responsive method for each of the elements
 * with audio responsive elements
 */
let randomizeAudioCtrls = (ctrlObjectName) => {
  "use strict";
  randomizeAudioFrequency(ctrlObjectName);
  randomizeAudioResponsiveOption(ctrlObjectName);
};



/**
 * Iterate through each of the input radios and randomize their
 * value based on the number of inputs by radio group name
 */
let randomizeAudioResponsiveOption = (ctrlObjectName, reset) => {

  let radioNamesArr = [];
  let selector;

  console.log(ctrlObjectName);

  if (!ctrlObjectName || typeof(ctrlObjectName) === 'undefined') {
    selector = 'input.audio-responsive-selector';
  } else {
    selector = `#${ctrlObjectName}-wrapper input.audio-responsive-selector`;
  }

  console.log(selector)

  $(selector).each(function () {
    if (!radioNamesArr.includes(this.name)) {
      radioNamesArr.push(this.name);
    }
  });

  for (let radioGroup in radioNamesArr) {
    if (!radioNamesArr.hasOwnProperty(radioGroup)) {
      continue;
    }

    let groupName = radioNamesArr[radioGroup];
    if (!ctrlObjectName || typeof(ctrlObjectName) === 'undefined') {
      selector = `input.audio-responsive-selector[name*=${groupName}]`;
    } else {
      selector = `#${ctrlObjectName}-wrapper input.audio-responsive-selector[name*=${groupName}]`;
    }

    let $radioGroup = $(selector);
    let radioLength = $radioGroup.length;
    let rVal;

    if (!radioLength) {
      continue;
    }

    if (reset === true) {
      rVal = 0;
    } else {
      rVal = getRandomInt(1, radioLength) - 1;
    }

    if (typeof($radioGroup) === 'undefined' || typeof($radioGroup[rVal]) === 'undefined' ) {
      continue;
    }

    rVal = $radioGroup[rVal].value;

    $radioGroup.each(function () {
      $(this).val([rVal]);
    });
  }
};



/**
 * Go through each of the frequency dropdowns and
 * randomize each value
 */
let randomizeAudioFrequency = (ctrlObjectName, reset) => {
  "use strict";

  let randomOption;
  let optionsLength;
  let rVal;
  let selector;

  if (!ctrlObjectName) {
    selector = 'select.freq-selector';
  } else {
    selector = `#${ctrlObjectName}-wrapper select.freq-selector`;
  }

  $(selector).each(function(){

    optionsLength = this.options.length;

    if (reset === true) {
      randomOption = 0;
    } else {
      randomOption = getRandomInt(0, optionsLength);
    }

    if (typeof this.options[randomOption] === 'undefined') {
      return true;
    }

    rVal = this.options[randomOption].value;

    $(this)
      .val(rVal)
      .trigger('change');
  });
};