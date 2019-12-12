// initialize the the menu toggle
$(() => {
  "use strict";

  $("#settings-close").click(() => {
    $("#settings-menu").fadeOut();
    $("#settings-open").fadeIn();
  });

  $("#settings-open").click(() => {
    $("#settings-menu").fadeIn();
    $("#settings-open").fadeOut();
  });

  $("#reset-settings").click(() => {
    resetSettings();
  });

  $("#randomize-settings").click(() => {
    randomizeSettings();
  });

  $("#randomize-audio-reactive").click(() => {
    randomizeAudioCtrls();
  });

  $("#set-background-strobe").click(() => {
    $("#set-background-strobe").toggleClass("inactive");
    backgroundStrobe = !backgroundStrobe;
  });


  $("#toggle-help").click(() => {
    $("#toggle-help").toggleClass("inactive");
  });


  $("#toggle-input-assigner").click(() => {
    $("#toggle-input-assigner").toggleClass("inactive");
    $(".input-assigner").toggle();
  });


  // audio controls

  // on hover mouse over/leave show/hide the value of the range slider handle
  $("#settings-menu").on('mouseover', '.noUi-handle', function() {
    $(this).parent(".noUi-origin").find('.noUi-tooltip').show();
  });
  $("#settings-menu").on('mouseleave', '.noUi-handle', function() {
    $(this).parent(".noUi-origin").find('.noUi-tooltip').hide();
  });

  // display a help box in the corner with what this element does.
  $("#settings-menu").on('mouseover', '.helper', function () {

    if ($("#toggle-help").hasClass("inactive") || !this.hasAttribute('title')) {
      return false;
    }

    let helpText = $(this).data('helper');
    if (typeof(helpText) === 'undefined' || !helpText) {
      helpText = $(this).attr('title');
    }

    let offsets = $(this).offset();

    // delay the helper a little
    setTimeout(function () {
        $("#help-text").fadeOut(function () {
          $(this).html(helpText)
            .fadeIn();
          
          $("#help-section").show()
            .css('top', `${offsets.top}px`);;
        });
      }, 200
    );
  });


  $("#settings-menu").on('click', '.lock-property', function(){
    // console.log(this);
    lockProperty(this);
  });

  $("#settings-menu").on('mouseleave', '.helper', function () {
    $("#help-section").fadeOut();
  });

});  // end document on load



/**
 * Iterate through all of the values that we want
 * to give the use control over and based on the
 * attribute type make a slider or a radio to control that property
 * @param ctrlElements
 * @returns {{}}
 */
let createDOMControls = (ctrlElements) => {
  "use strict";

  if (!ctrlElements.length) {
    return {};
  }

  // create audio control config buttons
  createAudioCtrls();

  // loop through each of the control objects and create settings controllers based on
  // the property's attribute type

  for (let ctrlElem in ctrlElements) {
    if (!ctrlElements.hasOwnProperty(ctrlElem)) {
      continue;
    }

    ctrlElem = ctrlElements[ctrlElem];
    let ctrlObjectName = ctrlElem.constructor.name;
    let wrapperID = ctrlObjectName + '-settings';
    // let wrapperElem = $(`#${wrapperID}`);
    // console.log(wrapperElem);

    // create a div for each of the different control
    let domCtrl = document.createElement('div');
    $(domCtrl).attr('id', wrapperID)
      .addClass('ctrlObject-settings')
      .appendTo($('#ctrlObject-control-panel'));

    // create a button to toggle the settings sliders visibility
    let button = document.createElement('button');
    $(button).html(ctrlObjectName)
      .attr('id', ctrlObjectName + '-toggle')
      .addClass('settings-toggle-button')
      .mousedown(function () {
        $(`#${ctrlObjectName}-wrapper`).toggleClass('hide'); // p5 makes it so incredibly dumb to get any sort of information
        $(`#${ctrlObjectName}-toggle`).toggleClass('open');
      })
      .appendTo(domCtrl);

    addMasterElementControls(ctrlElem, domCtrl);

    let ctrlElemSettingWrapper = document.createElement('div');
    $(ctrlElemSettingWrapper).attr('id', `${ctrlObjectName}-wrapper`)
      .addClass('hide settings-wrapper')
      .appendTo(domCtrl);


    for (let prop in ctrlElem) {
      if (!ctrlElem.hasOwnProperty(prop)) {
        continue;
      }
      if (ctrlElem[prop].attrType === 'numeric') {
        createNumericPropertyCtrlr(ctrlElem, prop, ctrlElemSettingWrapper);
      }
    }

    // loop through again (so that the radios come last in the group)
    // and create radio for all variable attribute types
    for (let prop in ctrlElem) {
      if (!ctrlElem.hasOwnProperty(prop)) {
        continue;
      }
      if (ctrlElem[prop].attrType === 'variable') {
        createRadioToggle(ctrlElem, prop, ctrlElemSettingWrapper);
      }
    }
  }

  setIntroDefaults();
};


/**
 * Create a bypass button, a shuffle, and a reset button
 * that will affect only the that element
 * @param ctrlElem
 * @param parent
 */
let addMasterElementControls = (ctrlElem, parent) => {
  "use strict";

  let ctrlElemName = ctrlElem.constructor.name;
  // parent should be icon wrapper
  let iconWrapper = document.createElement('div');
  console.log(ctrlElemName);
  
  $(iconWrapper).addClass('icon-wrapper')
    .appendTo(parent);


  let visStatus = (ctrlElem.bypass) ? 'visibility_off' : 'visibility';

  let icons = [
    {
      htmlIcon: visStatus,
      title: 'Visibility',
      onclick: `toggleVisibility('${ctrlElemName}', this)`,
      helper: 'Toggles whether this element is visible or not.',
    },
    {
      htmlIcon: 'waves',
      title: 'Randomize Audio Reactions',
      onclick: `randomizeAudioCtrls('${ctrlElemName}')`,
      helper: 'Randomize what frequency range an element reacts to.  Randomize how that frequency range changes the element\'s property',
    },
    {
      htmlIcon: 'shuffle',
      title: 'Randomize',
      onclick: `randomizeSettings('${ctrlElemName}')`,
      helper: 'Randomize every property in this element.  This does not affect the audio reactive controllers.',
    },
    {
      htmlIcon: 'restore',
      title: 'Reset Visuals',
      onclick: `resetSettings('${ctrlElemName}')`,
      helper: 'Randomize every property in this element to their original default state.  This does not affect the audio reactive controllers.',
    },
  ];

  for (let i in icons) {
    if (!icons.hasOwnProperty(i)) {
      continue;
    }

    
    let icon = document.createElement('i');
    $(icon).addClass('material-icons md-light helper')
      .html(icons[i].htmlIcon)
      .attr('title', icons[i].title)
      .data('helper', icons[i].helper)
      .attr('onclick', icons[i].onclick)
      .appendTo(iconWrapper);

    if (icons[i].title === 'Visibility' && visStatus === 'visibility_off') {
      $(icon).addClass('inactive');
    }
  }
};



/**
 *  Create in the DOM inputs that will control a control element in various ways.
 *  Creates a input boxes to assign keyboard keys for user to play visuals by typing.
 *  Creates an ability to lock a property so that randomizers and resetter don't affect it
 *  Creates a range slider for user to change the current properties value real time.
 *  Creates a dropdown for the user to make a property react to music frequencies
 * @param ctrlObject
 * @param prop
 * @param parentWrapper
 */
let createNumericPropertyCtrlr = (ctrlObject, prop, parentWrapper) => {
  "use strict";

  if (ctrlObject[prop].attrType === 'numeric') {


    // wrapper to hold individual range sliders
    let inputWrapper = document.createElement('div');
    $(inputWrapper).addClass('range-slider-wrapper')
      .appendTo(parentWrapper);

    let title = document.createElement('p');
    $(title).html(ctrlObject[prop].displayLabel)
      .appendTo(inputWrapper);

    createLockElement(ctrlObject, prop, title);
    if (midiAvailable) {
      createMidiAssigner(ctrlObject, prop, inputWrapper);
    }
    createPianoDomInput(ctrlObject, prop, inputWrapper);
    createDomSlider(ctrlObject, prop, inputWrapper);

    let audioWrapper = document.createElement('div');
    $(audioWrapper).addClass('audio-controllers-wrapper')
      .appendTo(inputWrapper);

    createGainDial(ctrlObject, prop, audioWrapper);

    let audioReactiveWrapper = document.createElement('div');
    $(audioReactiveWrapper).addClass('audio-reactive-wrapper')
      .appendTo(audioWrapper);

    createAudioResponsiveTypeSelector(ctrlObject, prop, audioReactiveWrapper);
    createFrequencySelector(ctrlObject, prop, audioReactiveWrapper);
  }
};



/**
 * Create a dial knob in the DOM to control the gain of the audio reactive component.
 * @param ctrlObject
 * @param prop
 * @param parentWrapper
 * @returns {boolean}
 */
let createGainDial = (ctrlObject, prop, parentWrapper) => {
  "use strict";

  if (!ctrlObject[prop].audio || !ctrlObject[prop].audio.gain) {
    return false;
  }

  let ctrlObjectName = ctrlObject.constructor.name;
  let dialWrap = document.createElement('div');
  $(dialWrap).addClass('gain-dial-wrapper')
    .appendTo(parentWrapper)
    .addClass('helper')
    .data('helper', 'Control how much of an effect the component reacts to the audio.  The higher the number the greater the boom.')
    .prop('title', 'Visual Loudness');
    ;

  let dial = document.createElement('input');
  $(dial).prop('type', 'text')
    .addClass('gain-knob')
    .val(ctrlObject[prop].audio.gain)
    .appendTo(dialWrap);

  let label = document.createElement('p');
  $(label).html('Loudness')
    .appendTo(dialWrap);

  $(dial).knob({
    'min': 0,
    'max': 2,
    'step':  0.1,
    'angleArc': 250,
    'angleOffset': -125,
    'inputColor': '#fff',
    'fgColor' : '#0e83cd',
    'bgColor' : '#095c8f',
    'height' : 50,
    'width' : 50,
    'release' : function (v) {
      ctrlObject[prop].audio.gain = v;
    }
  });
};

/**
 *
 * @param ctrlObject
 * @param prop
 * @param parent
 * @returns {boolean}
 */
let createAudioResponsiveTypeSelector = (ctrlObject, prop, parent) => {
  "use strict";

  let ctrlObjectName = ctrlObject.constructor.name;

  if (!ctrlObject[prop].audio || !ctrlObject[prop].audio.responsiveOptions) {
    return false;
  }

  let desc = {
    add : {
      label : '+',
      title : "Addative",
      helper : "Animate this property to the peak value of the selected audio frequency. Bouncy Bass!",
    },
    subtract : {
      label : '-',
      title : "Subtractive",
      helper : "Animate this property to the peak value of the selected audio frequency. Shrinky Dinky like!",
    },
    'loop up' : {
      label : '<',
      title : "Increment Loop",
      helper : "Each amplitude reading adds onto the last reading.  Once it hits the maximum it starts again from the minimum. Grow baby, Grow!",
    },
    'loop down' : {
      label : '>',
      title : "Decrement Loop",
      helper : "Each amplitude reading subtracts from the last reading.  Once it hits the minimum it starts again from the maximum. Benjamin Button mode.",
    },
    'infinite' : {
      label : '∞',
      title : "Infinite Loop",
      helper : "Each amplitude reading add with out end.",
    }
  };

  let radioWrapper = document.createElement('div');
  $(radioWrapper).addClass('audio-radio-wrapper')
    .appendTo(parent);

  let radio;
  let label;
  let labelHtml;
  let titleText;
  let helperText;
  let thisOption;

  let aOptions = ctrlObject[prop].audio.responsiveOptions;

  for (let option in aOptions) {
    if (!aOptions.hasOwnProperty(option)) {
      continue;
    }

    thisOption = aOptions[option];
    labelHtml = desc[thisOption].label;
    titleText = desc[thisOption].title;
    helperText = desc[thisOption].helper;

    let inputForId = `${ctrlObjectName}-${prop}-${aOptions[option]}-responsiveType`;
    let inputName = `${ctrlObjectName}-${prop}-responsiveType`;

    let radio = $('<input type="radio" onclick="setAudioResponsiveType(this)">');
    radio.addClass('audio-responsive-selector')
      .attr('name', inputName)
      .attr('id', inputForId)
      .data('ctrl_object', ctrlObjectName)
      .data('prop', prop)
      .appendTo(radioWrapper)
      .val(aOptions[option]);

    if (aOptions[option] === ctrlObject[prop].audio.responsiveType) {
      radio.prop('checked', true);
    }


    let label = $('<label></label>');
    label.addClass('audio-responsive-selector helper')
      .attr('for', inputForId)
      .html(labelHtml)
      .attr('title', titleText)
      .data('helper', helperText)
      .appendTo(radioWrapper);
  }
};



/**
 * Create a DOM element to control whether a property is changeable or not.
 * @param ctrlObject
 * @param prop
 * @param parentElem
 */
let createLockElement = (ctrlObject, prop, parentElem) => {
  "use strict";

  let ctrlElemName = ctrlObject.constructor.name;

  let lockIcon = document.createElement('i');
  $(lockIcon).html('lock_open')
    .addClass(`material-icons md-light ${ctrlElemName}-${prop} helper lock-property`)
    .data('helper', 'Lock this property\'s settings from being set, randomized, or reset. Only the global reset button will override a locked property.')
    .data('ctrl_object', ctrlElemName)
    .data('prop', prop)
    .attr('title', 'Settings Lock')
    .appendTo(parentElem);
};



/**
 *  Lets set the first elements with some default values
 *  to give the user something to play with
 */
let setIntroDefaults = () => {
  "use strict";


  // alphabet charcodes fo A-Z = [65 - 90]
  // number 0-1 = [49 - 57]

  $("input.keyboard-assigner").each(function () {
    // console.log(this);

    let randomCharCode;
    if (getRandomInt(0, 10) < 4 ) {
      randomCharCode = getRandomInt(49, 57);
    } else {
      randomCharCode = getRandomInt(65, 90);
    }

    let character = String.fromCharCode(randomCharCode);

    $(this)
      .val(character)
      .trigger('input');
  });


  let freqToAssign = freqBands.low.ranges[0];
  let secondFreq = freqBands.high.ranges[0];
  $($(".freq-selector")[0]).val(`${freqToAssign[0]} - ${freqToAssign[1]} Hz`).trigger("change");
  if ($('#ThreeDWave-wrapper')) {
    $($('#ThreeDWave-wrapper .freq-selector')[0]).val(`${secondFreq[0]} - ${secondFreq[1]} Hz`).trigger("change");
  }
};


let createMidiAssigner = (ctrlObject, prop, parentWrapper) => {

  let ctrlObjectName = ctrlObject.constructor.name;

  let midiAssignerWrapper = document.createElement('div');
  $(midiAssignerWrapper).addClass(`input-assigner midi-wrapper`)
    .appendTo(parentWrapper);


  // input to set which keyboard key plays that element
  let midiAssigner = document.createElement('input');
  midiAssigner.type = 'text';
  $(midiAssigner).addClass('midi-assigner helper')
    .attr('title', 'Midi Mode Bind Input')
    .attr('placeholder', 'Bind Midi Input')
    .attr('maxLength', '3')
    .data('helper', 'Program a Midi input to control this element. When the Midi input is pressed it will set the element\'s property to the the Midi input\'s velocity')
    .data('ctrl_object', ctrlObjectName)
    .data('prop', prop)
    .data('type', 'midi-set')
    .on("input", setKeyboardControl)
    .appendTo(midiAssignerWrapper);

  let icon = document.createElement('i');
  $(icon).addClass('material-icons md-light helper')
    .html('delete_forever')
    .attr('title', 'Unbind Midi')
    .data('helper', 'Removes the Midi input binding to this control element.')
    .attr('onclick', `unbindMidiCtrl('${ctrlObjectName}', '${prop}', this)`)
    .appendTo(midiAssignerWrapper);

};



/**
 *  Create buttons in the DOM to play/pause music and  also upload audio
 */
let createAudioCtrls = () => {
  "use strict";
  let audioWrapperID = "#playback-controls";  
  let labelIcon = `<i id="upload-file-icon" class="global-control material-icons md-light helper" title ="Upload a local sound file">unarchive</i>`;

  // we will hide the default file input bc its ugly and use the label
  let uploadButton = myp5.createFileInput(uploaded);
  uploadButton.parent(audioWrapperID)
    .attribute('id', 'upload-file')
    .attribute('name', 'upload-file');
  
  // instead we will see the label for it and labels have the same function as the actual input
  let label = document.createElement('label');
  $(label).html(labelIcon)
    .attr('for', 'upload-file')
    .attr('id', 'upload-file-label')
    .appendTo(audioWrapperID);


};



/**
 * Create a select drop down to assign frequency bands to visual elements
 * @param ctrlObject
 * @param prop
 * @param inputWrapper
 */
let createFrequencySelector = (ctrlObject, prop, inputWrapper) => {
  "use strict";

  if (inputWrapper.elt) {
  inputWrapper = $(inputWrapper.elt);
  }

  let ctrlObjectName = ctrlObject.constructor.name;
  let selectWrap = document.createElement('div');
  $(selectWrap).addClass('frequency-selector-wrapper');

  let rangeList = document.createElement("select");
  $(rangeList).addClass("freq-selector helper")
    .data('ctrl_object', ctrlObjectName)
    .data('prop', prop)
    .data('helper', 'Make this element property audio reactive.  Select a frequency range from the dropdown to make it react to the music\'s frequency levels.')
    .attr('title', 'Audio Reactive Settings')

  $(rangeList).on("change", setAudioCtrl);

  let option = document.createElement('option');
  $(option).html(`Select Audio Frequency &#8675`)
    .appendTo(rangeList);

  for (let i in freqBands) {
    if (!freqBands.hasOwnProperty(i)) {
      continue;
    }

    let band = freqBands[i];

    let optGroup = document.createElement('optgroup');
    $(optGroup).attr('label', band.optGroup);

    for (let j in  band.ranges) {
      if (!band.ranges.hasOwnProperty(j)) {
        continue;
      }

      let option = document.createElement('option');
      $(option).html(`${band.ranges[j][0]} - ${band.ranges[j][1]} Hz`)
        .data('lower-bound', band.ranges[j][0])
        .data('upper-bound', band.ranges[j][1])
        .appendTo(optGroup);
    }
    $(optGroup).appendTo(rangeList);
  }

  $(rangeList).appendTo(selectWrap);
  $(selectWrap).appendTo(inputWrapper);
};



/**
 *  Create an html range slider to control the visual elements
 * @param ctrlObject
 * @param prop
 * @param inputWrapper
 */
let createDomSlider = (ctrlObject, prop, inputWrapper) => {
  "use strict";

  let ctrlObjectName = ctrlObject.constructor.name;

  // todo make step a property of the elements
  // todo cont. we can make the sliders non-linear if we want  @see https://refreshless.com/nouislider/slider-values/

  // slider to control the individual property
  let rangeSlider = document.createElement('div');
  $(rangeSlider).addClass(`range-slider ${ctrlObjectName}-${prop} helper`)
    .data('ctrl_object', ctrlObjectName)
    .data('prop', prop)
    .data('helper', 'Changes the current value of this property. It also sets the reset value for key press release.  When you release a bound keystroke, the value will release to this value.')
    .attr('title', 'Set element property')
    .appendTo(inputWrapper);


  // this lets us create a custom slider with multiple handles allowing us to have slider handles for a property's min, max, and current value
  // @see https://refreshless.com/nouislider
  let customSlider = $(`.range-slider.${ctrlObjectName}-${prop}`)[0];

  noUiSlider.create(customSlider, {
    start: [ctrlObject[prop].min, ctrlObject[prop].currentValue, ctrlObject[prop].max],
    range: {
      'min': [ctrlObject[prop].defaultMin],
      'max': [ctrlObject[prop].defaultMax]
      // todo, there can be custom ranges to maximize certain sections of the slider
    },
    connect: true,
    // step : [ctrlObject[prop].step,
    tooltips: true,
  });

  customSlider.noUiSlider.on(`update.$\{ctrlObjectName}-$\{prop}`, rangeSliderUpdate);
};



/**
 * Gets called by noUiSlider on update of the custom range slider.
 * We set the min, target, and max values for each of the handles in the slider.
 * Handles : 0 = min; 1 = currentValue; 2 = max;
 * @see https://refreshless.com/nouislider/slider-read-write/
 * @param values
 * @param handle
 * @param unencoded
 * @param tap
 * @param positions
 */
let rangeSliderUpdate = function (values, handle, unencoded, tap, positions) {
  "use strict";

  // console.log(handle);
  let ctrlObjectName = $(this.target).data('ctrl_object');
  let controlObject = myp5[`get${ctrlObjectName}`]();
  let prop = $(this.target).data('prop');


  switch (handle) {
    case 0:
      controlObject[prop].min = Number(values[0]);
      break;
    case 1:
      controlObject[prop].targetValue = Number(values[1]);
      controlObject[prop].currentValue = Number(values[1]);
      controlObject[prop].resetValue = Number(values[1]);
      break;
    case 2:
      controlObject[prop].max = Number(values[2]);
      break;
  }
};



/**
 * Create in the DOM a radio input for the variable attribute properties.
 * @param ctrlObject
 * @param prop
 * @param parentWrapper
 */
let createRadioToggle = (ctrlObject, prop, parentWrapper) => {
  "use strict";

  if (ctrlObject[prop].attrType === "variable" && ctrlObject[prop].options.length) {

    let ctrlObjectName = ctrlObject.constructor.name;


    let inputWrapper = document.createElement('div');
    $(inputWrapper).addClass(`radio-input-wrapper ${ctrlObjectName}-${prop}`)
      .appendTo(parentWrapper);

    let labelWrapper = document.createElement('div');
    $(labelWrapper).addClass('title-wrapper')
      .appendTo(inputWrapper);

    let label = document.createElement('p');
    $(label).html(ctrlObject[prop].displayLabel)
      .appendTo(labelWrapper);

    if (midiAvailable) {
      createMidiAssigner(ctrlObject, prop, inputWrapper);
    }

    createPianoDomInput(ctrlObject,prop, inputWrapper);

    let innerWrapper = document.createElement('div');
    $(innerWrapper).addClass('inner-radio-wrapper')
      .appendTo(inputWrapper);

    createLockElement(ctrlObject, prop, label);

    let optionWrapper;
    let radioInput;
    let radioLabel;


    for (let o in ctrlObject[prop].options) {
      if (!ctrlObject[prop].options.hasOwnProperty(o)) {
        continue;
      }

      optionWrapper = document.createElement('div');
      $(optionWrapper).addClass("radio-option-wrapper")
        .appendTo(innerWrapper);

      radioInput = $('<input type="radio" onchange="setRadioValue(this)">');
      radioInput.addClass(`radio-input ${ctrlObjectName}-${prop}`)
        .attr('name', `${ctrlObjectName}-${prop}-radio`)
        .val(ctrlObject[prop].options[o])
        .data('ctrl_object', ctrlObjectName)
        .data('prop', prop)
        .appendTo(optionWrapper);

      if (ctrlObject[prop].options[o] === ctrlObject[prop].currentValue) {
        radioInput.prop('checked', true);
      }

      radioLabel = $('<label></label>');
      radioLabel.html(ucFirst(ctrlObject[prop].options[o]))
        .appendTo(optionWrapper);
    }
  }
};



/**
 * Triggered by an on change even on the radio element.
 * Sets the object's property value to the selected radio option.
 * @param inputElem
 */
let setRadioValue = (inputElem) => {
  "use strict";
console.log(inputElem);
  let value = $(inputElem).val();
  let controlElementName = $(inputElem).data('ctrl_object');
  let prop = $(inputElem).data('prop');

  let controlObject = myp5[`get${controlElementName}`]();
  if (controlObject[prop].lockOn === false) {
    controlObject[prop].currentValue = value;
  }
};



/**
 * Create input boxes in the DOM that will control an element when the user presses key board keys.
 * An input box for the Key to press, and another for the the value that the key triggers.
 * @param ctrlObject
 * @param prop
 * @param parentWrapper
 */
let createPianoDomInput = (ctrlObject, prop, parentWrapper) => {
  "use strict";

  let ctrlObjectName = ctrlObject.constructor.name;

  let pianoWrapper = document.createElement('div');
  $(pianoWrapper).addClass(`input-assigner`)
    .appendTo(parentWrapper);


  // input to set which keyboard key plays that element
  let pianoInputKey = document.createElement('input');
  pianoInputKey.type = 'text';
  $(pianoInputKey).addClass('keyboard-assigner helper')
    .attr('title', 'Piano Mode Set Keyboard Key')
    .attr('placeholder', 'Assign Key')
    .attr('maxLength', '1')
    .data('helper', 'Basically use the keyboard as a piano and type away.  Assign a value to set for property on keypress.  When the key is pressed it will set the element\'s property to the value specified.')
    .data('ctrl_object', ctrlObjectName)
    .data('prop', prop)
    .data('type', 'key-set')
    .on("input", setKeyboardControl)
    .appendTo(pianoWrapper);


  // input to set what the value will be for that element on that key press
  let pianoInputValue = document.createElement('input');
  pianoInputValue.type = 'number';
  $(pianoInputValue).val(myp5.random(ctrlObject[prop].min, ctrlObject[prop].max).toFixed(3))
    .attr('max', ctrlObject[prop].max)
    .attr('min', ctrlObject[prop].min)
    .attr('step', Number((ctrlObject[prop].max - ctrlObject[prop].min) / 200).toFixed(3))
    .attr('title', 'Piano Mode Set Keyboard Key Value')
    .data('helper', ' Basically use the keyboard as a piano and type away.   Assign a value for the element\'s property to go to when its corresponding key is pressed. On key release, the it will go back to the reset value (the value set by the slider).')
    .data('type', 'value-set')
    .data('ctrl_object', ctrlObjectName)
    .data('prop', prop)
    .addClass('helper')
    .on("input", setKeyboardControl)
    .appendTo(pianoWrapper);
};



let keyboardCtrl = {};
let ctrlElemPropToKeyMap = {};
/**
 * When the user enters a key into the input
 * save it to a key to controller map
 * @param e
 */
let setKeyboardControl = (e) => {
  "use strict";
  // console.log(e);

  let inputValue = e.target.value;
  let type = $(e.target).data('type');
  let ctrlObjectName = $(e.target).data('ctrl_object');
  let property = $(e.target).data('prop');
  let charCode;
  let propValue;

  if (type === 'key-set') {
    propValue = e.target.nextSibling.value;
    // apparently p5 can only understand keys as uppercase on key press ...
    charCode = inputValue.toUpperCase().charCodeAt(0);
  }
  if (type === 'value-set') {
    propValue = e.target.value;
    // apparently p5 can only understand keys as uppercase on key press ...
    charCode = e.target.previousSibling.value.toUpperCase().charCodeAt(0);
  }

  if (!Number.isNaN(charCode) && ctrlObjectName && property && propValue) {

    // console.log('setting value');
    // console.log([inputValue, charCode, ctrlObjectName, property, propValue]);
    // only update the keyboard control if we have a key to control it with
    keyboardCtrl[charCode] = keyboardCtrl[charCode] || {};
    keyboardCtrl[charCode][ctrlObjectName] = keyboardCtrl[charCode][ctrlObjectName] || {};
    keyboardCtrl[charCode][ctrlObjectName][property] = Number(propValue);

    ctrlElemPropToKeyMap[ctrlObjectName] = ctrlElemPropToKeyMap[ctrlObjectName] || {};
    ctrlElemPropToKeyMap[ctrlObjectName][property] = charCode;
  } else {

    console.log('cleaning ');
    if (ctrlElemPropToKeyMap[ctrlObjectName] && ctrlElemPropToKeyMap[ctrlObjectName][property]) {

      let keyToClean = ctrlElemPropToKeyMap[ctrlObjectName][property];
      console.log(keyToClean);

      delete keyboardCtrl[keyToClean][ctrlObjectName][property];
      if (Object.size(keyboardCtrl[keyToClean][ctrlObjectName]) === 0) {
        delete keyboardCtrl[keyToClean][ctrlObjectName];
      }

      if (Object.size(keyboardCtrl[keyToClean]) === 0) {
        delete keyboardCtrl[keyToClean];
      }
      delete ctrlElemPropToKeyMap[ctrlObjectName][property];
    }


    if (Object.size(ctrlElemPropToKeyMap[ctrlObjectName]) === 0) {
      delete ctrlElemPropToKeyMap[ctrlObjectName];
    }
  }

  // console.log(keyboardCtrl);
  // console.log(ctrlElemPropToKeyMap);
};



/**
 * If a Controlable element is passed then, only loop through that.
 * If no element is passed in then loop through the entire selection of elements.
 * Go through each of the properties and set the current value to the defaultValue.
 * @param ctrlElement
 */
let resetSettings = (ctrlElement) => {
  "use strict";

  let ctrlElementsArray = [];

  let globalReset;
  if (!ctrlElement) {
    globalReset = true;
    ctrlElementsArray = myp5.ctrlElementsArray;
  } else {
    if (typeof(ctrlElement) === "string") {
      ctrlElement = myp5[`get${ctrlElement}`]();
    }
    globalReset = false;
    ctrlElementsArray.push(ctrlElement);
  }


  randomizeAudioResponsiveOption(false, true);
  randomizeAudioFrequency(false, true);

  for (let i in ctrlElementsArray) {
    if (!ctrlElementsArray.hasOwnProperty(i)) {
      continue;
    }

    let ctrlElem = ctrlElementsArray[i];
    let ctrlObjectName = ctrlElem.constructor.name;

    for (let prop in ctrlElem) {
      if (!ctrlElem.hasOwnProperty(prop)) {
        continue;
      }

      if (!ctrlElem[prop].defaultValue || !ctrlElem[prop].currentValue) {
        continue;
      }

      if (ctrlElem[prop].lockOn === true) {
        continue;
      }

      if (ctrlElem[prop].attrType === "numeric") {

        $(`.range-slider.${ctrlObjectName}-${prop}`)[0]
          .noUiSlider.set([ctrlElem[prop].defaultMin, ctrlElem[prop].defaultValue, ctrlElem[prop].defaultMax]);
        ctrlElem[prop].targetValue = ctrlElem[prop].defaultValue;
      } else if (ctrlElem[prop].attrType === "variable") {
        $(`input.radio-input.${ctrlObjectName}-${prop}`)
          .val([ctrlElem[prop].defaultValue]);
        ctrlElem[prop].currentValue = ctrlElem[prop].defaultValue;
      }

      if (globalReset === true) {
        ctrlElem[prop].lockOn = false;

        $(`i.${ctrlObjectName}-${prop}`)
          .html('lock_open')
          .attr('title', 'Lock This Property (Only the global reset will override a locked property)')
          .removeClass('locked');
        $(`i.${ctrlObjectName}-${prop}`)
          .parents(".range-slider-wrapper")
          .removeClass('locked')
          .find('input, select').each(function () {
          $(this).prop('disabled', false);
        });

      }
    }
  }
};



/**
 * This can either randomize every visual element
 * or just a single visual element if it gets passed in
 * @param ctrlElement
 * @param percent
 */
let randomizeSettings = (ctrlElement = false, percent) => {
  // "use strict";

  let ctrlElementsArray = [];

  if (ctrlElement === false) {
    ctrlElementsArray = myp5.ctrlElementsArray;
  } else {
    if (typeof(ctrlElement) === "string") {
      ctrlElement = myp5[`get${ctrlElement}`]();
    }
    ctrlElementsArray.push(ctrlElement);
  }
  console.log(ctrlElementsArray);

  let rVal;
  let valueRange;
  let optLength;
  let optIndex;

  for (let i in ctrlElementsArray) {
    if (!ctrlElementsArray.hasOwnProperty(i)) {
      continue;
    }

    let ctrlElem = ctrlElementsArray[i];
    let ctrlObjectName = ctrlElem.constructor.name;

    for (let prop in ctrlElem) {
      if (!ctrlElem.hasOwnProperty(prop)) {
        continue;
      }

      if (!ctrlElem[prop].defaultValue || !ctrlElem[prop].currentValue) {
        continue;
      }

      if (ctrlElem[prop].lockOn === true) {
        continue;
      }

      if (ctrlElem[prop].attrType === "numeric") {

        if (percent) {
          invertP = 100 - percent;
          valueRange = ctrlElem[prop].resetValue * invertP/100;
          rVal = myp5.random(ctrlElem[prop].min + valueRange, ctrlElem[prop].max - valueRange);
        } else {
          rVal = myp5.random(ctrlElem[prop].min, ctrlElem[prop].max);
        }

        $(`.range-slider.${ctrlObjectName}-${prop}`)[0]
          .noUiSlider.set([null, rVal, null]);

        ctrlElem[prop].targetValue = rVal;

      }
      else if (ctrlElem[prop].attrType === "variable") {
        optLength = ctrlElem[prop].options.length;
        optIndex = getRandomInt(0, optLength - 1);
        rVal = ctrlElem[prop].options[optIndex];
        $(`input.radio-input.${ctrlObjectName}-${prop}`).val([rVal]);
        ctrlElem[prop].currentValue = rVal;


        if (typeof(rVal) === "undefined") {
          console.log('stop');
        }
      }

      if (ctrlElem[prop].lockOn === false) {
      }
    }
  }
};



/**
 * Turn off and on individual visual elements
 * and change the material design icon state and associated title
 * Called by onclick of ctrl Elements' bypass icon
 * @param ctrlElementName
 * @param htmlElem
 */
let toggleVisibility = (ctrlElementName, htmlElem) => {
  "use strict";

  let controlObject = myp5[`get${ctrlElementName}`]();
  controlObject.bypass = !controlObject.bypass;

  $(htmlElem).toggleClass('inactive');

  if ($(htmlElem).hasClass('inactive')) {
    $(htmlElem).attr('title', 'Turn Visuals On');
    $(htmlElem).html('visibility_off');
  } else {
    $(htmlElem).attr('title', 'Turn Visuals Off');
    $(htmlElem).html('visibility');
  }
};



/**
 * Lock the property so that the values can't be changed
 * Set the icon and parent wrapper to a locked stated
 * Disable the inputs and selects
 * @param htmlElem
 */
let lockProperty = (htmlElem) => {
  "use strict";

  console.log(htmlElem);

  if ($.isWindow(htmlElem)) {
    return false;
  }


  let ctrlElementName = $(htmlElem).data('ctrl_object');
  let prop = $(htmlElem).data('prop');
  let controlObject = myp5[`get${ctrlElementName}`]();

  let parent = $(htmlElem).parents(".range-slider-wrapper, .radio-input-wrapper");


  $(htmlElem).toggleClass("locked");
  parent.toggleClass('locked');

  if ($(htmlElem).hasClass("locked")) {

    $(htmlElem).html('lock');
    $(htmlElem).attr('title', 'Unlock This Property');

    parent.find('input, select').each(function () {
      $(this).prop('disabled', true);
    });

    parent.find('.range-slider, .audio-radio-wrapper label, .frequency-selector-wrapper').each(function() {
      $(this).addClass('disabled');
    });
  } else {
    $(htmlElem).html('lock_open');
    $(htmlElem).attr('title', 'Lock This Property');

    parent.find('input, select').each(function () {
      $(this).prop('disabled', false);
    });

    parent.find('.range-slider, .audio-radio-wrapper label, .frequency-selector-wrapper').each(function() {
      $(this).removeClass('disabled');
    });

  }

  controlObject[prop].lockOn = !controlObject[prop].lockOn;
};


/**
 * Given a min and max get a whole number (integer) between them.
 * @param min
 * @param max
 * @returns {number}
 */
let getRandomInt = (min, max) => {
  "use strict";
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};



let unbindMidiCtrl = (controlElem, property, elem) => {
  let $elem = $(elem);
  let $input = $elem.parents('.input-assigner').children('input.midi-assigner');
  let noteVal = $input.val().replace(/[^0-9]+/, '');
  let configToDelete = [controlElem, property];
  $input.val('');

  for (let binding in midiCtrlMap[noteVal]) {
    if (JSON.stringify(midiCtrlMap[noteVal][binding]) === JSON.stringify(configToDelete)) {
      delete midiCtrlMap[noteVal][binding];
      midiCtrlMap[noteVal] = midiCtrlMap[noteVal].filter(val => val);
    }
  }

};