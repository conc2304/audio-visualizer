import VariableProperty from '../services/PropertyConstructorVariable';

export const P5_PRIMITIVES_3D = [ 'torus', 'plane', 'box', 'sphere', 'ellipsoid', 'cylinder', 'cone' ];
export const P5_PRIMITIVES_2D = [];
export const WEBGL_MODELS = [ 'glock', 'lambo', 'shuttle', 'ducky', 'whale', 'dolphin', 'satellite', 'sword' ];

export const CUSTOM_MODELS_DIR = './assets/webgl_models';
export const CATALOGUE_ITEM_AVATAR_DIR = "./assets/sketch_catalogue_gifs";


/**
 * Common Sketch Parameters
 */

export const SKETCH_PROPERTY_3D_SHAPE = new VariableProperty("Shape", "Shape", 'sphere', [].concat(P5_PRIMITIVES_3D, WEBGL_MODELS));
