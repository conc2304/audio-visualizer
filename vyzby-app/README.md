# VYZBY - An interactive p5JS sketch visualizer

Production URL [http://vyzby.joseconchello.com/](http://vyzby.joseconchello.com/)

## Outline of features
  This app is a tool to animate and control sketches made in p5js through the DOM as well as other auxilliary inputs.
  
  Features 
  
  * Home page has a mouse chasing p5js sketch
  * Home page has a login/out feature (so far doesnt do much)
  * Home page has a pop up with an explanation of the app
  * Visualizer view is the main content page of the app.
  * Visualizer menu has a layer selector to control individual layers
  * Visualizer menu has control that randomize and reset the parameters of each layer
  * Visualizer menu has a toggle to show/hide form fields for auxilliary input
  * Toggling the aux input shows/hides inputs to control layer parameters with keyboard strokes
  * Selecting a layer shows the layer controller menu
  * Layer controller menu is broken up into expansion lists for each parameter category
  * Layer control menu has menu buttons to: toggle visibility, randomize, and reset the layer
  * Setting the visibility to off on a layer sets a red border on that layer
  * Only one expansion list is able to open at a time
  * Expansion list contains sliders and radio buttons to control elements
  * Setting menu has audio player toggle to show/hide audio player
    
    
  In progress
  * Audio player
  * Ability for sketch parameters to respond to music
  * Ability to add new layer
  * Ability to remove existing layer
  * Ability to shift order of layers
  * Ability to control sketch paramters via MIDI input
  

## Anatomy of p5js Sketch Developement
New Sketches in p5Js get registered in `'@/js/services/SketchRegistration.js'` and get imported together as an array of objects.

Sketches are created as a constructror class
The constructor needs to have a `render()` function.  This is what gets called for each registered sketch on the p5js `draw()` cycle.

New Sketch files need the following 3 files 
* import easeInto from '@/js/services/EasingService';
* import NumericProperty from '@/js/services/PropertyConstructorNumeric';
* import VariableProperty from '@/js/services/PropertyConstructorVariable';

Sketch parameters that should be interactive/editable can, currently, be either `Numeric` or `Variable`

* Numeric parameters are those that can take any floating point value as an argument
* Variable parameters are those that take have an array of string as options
* TODO Boolean parameters

Numeric and Variable parameters get grouped together in dropdowns based on the category they are assigned to in the app.


## Outside resources
 * Vuetify https://vuetifyjs.com/en/
 * p5js https://p5js.org/
 * Vue with p5js https://medium.com/js-dojo/experiment-with-p5-js-on-vue-7ebc05030d33
 * Dependency Injection with Vue js https://codeburst.io/dependency-injection-with-vue-js-f6b44a0dae6d
 * No Ui Slider https://www.npmjs.com/package/vue-nouislider-fork/v/1.0.8
 * Material Icons https://material.io/resources/icons/?style=baseline



To be run from the `/vyzby-app` directory
### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
