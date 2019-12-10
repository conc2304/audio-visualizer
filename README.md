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
  * Visualizer has a 'Layer Library' to select a new layer to the composition
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
  * Ability to shift order of layers
  * Ability to control sketch paramters via MIDI input
  * Ability to search for sketches/layers in the Sketch Catalogue via categories and/or creators
  

## Anatomy of p5js Sketch Developement within VYZBY
New Sketches in p5Js get registered in `'./src/js/services/SketchRegistration.js'` and get imported together as an array of objects.

p5JS sketches are found and kept in the `./src/js/sketches/` directory.  An exampple of an existing sketch is `vyzby-app/src/js/sketches/SketchConstructorWEBGLWave.js`

Sketches are created as a constructror class
The constructor must have a `render()` function.  This is what gets called for each registered sketch on the p5js `draw()` cycle.

New Sketch files need the following files 
* `import easeInto from '@/js/services/EasingService'`;
* `import NumericProperty from '@/js/services/PropertyConstructorNumeric'`;
* `import VariableProperty from '@/js/services/PropertyConstructorVariable'`;
* `import SketchCatalogue from '@/js/services/SketchCatalogue'`;
* `import CatalogueDataEntry from '@/js/services/CatalogueDataEntry'`;

### Sketch Catalogue
URI: `'./js/services/SketchCatalogue.js'`
The Sketch Catalogue is a central location to register new sketches and layers for users to add to their compositions.
Processing Sketches are added to the Sketch Catalogue via your sketch class constructor.

Required catalogue data:
  * Constructor name: name of the constructor to be used to instantiate the sketch in the app 
  * Title           : the title to appear for this catalogue item
  * Description     : a short, 1-2 sentence, description of the sketch oyu made
  * Categories      : array of 1 word descriptors for users to search by
  * Creator/Author  : who made this sketch ie. you
  * Avatar          : GIF (preferably) or still image of the sketch as an example
    * Images should have a 1:1 ratio
    * Images should be no biger than 250px X 250px and no smaller than 150px X 150px
    * Path to image should be provided to the catalogue service
  * CPU Usage       : an arbitrary number from 1 to 10 that describes
    * 10 would be a sketch that needs to be run alone because it is taxing on the CPU


### Interactive Parameters
Sketch parameters that should be interactive/editable can, currently, be either `Numeric` or `Variable`

* Numeric parameters are those that can take any floating point value as an argument
* Variable parameters are those that take have an array of string as options
* TODO Boolean parameters

Numeric and Variable parameters get grouped together in dropdowns based on the category they are assigned to in the app.

<br>
<br>
NOTE: Things to consider if you feel like you are chewing through too much cpu

  * toggling the visibility of taxing layers
  * removing a sketch from the composition
  * limit the amount of loops occuring within the draw cycle


## Outside resources
 * p5JS tutorial by Daniel Shiffman https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA 
 * p5js https://p5js.org/
 
 * Vuetify https://vuetifyjs.com/en/
 * Vue with p5js https://medium.com/js-dojo/experiment-with-p5-js-on-vue-7ebc05030d33
 * Dependency Injection with Vue js https://codeburst.io/dependency-injection-with-vue-js-f6b44a0dae6d
 * No Ui Slider https://www.npmjs.com/package/vue-nouislider-fork/v/1.0.8
 * Vue Knob Control https://github.com/kramer99/vue-knob-control 
 * Material Icons https://material.io/resources/icons/?style=baseline
 

<br>
<br>

## Getting Started
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
