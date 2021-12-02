export type CustomModelShape = 
  | 'glock'
  | 'lambo'
  | 'shuttle'
  | 'ducky'
  | 'whale'
  | 'dolphin'
  | 'satellite'
  | 'sword';

export type WebglPrimitiveShape =
  | 'torus'
  | 'plane'
  | 'box'
  | 'sphere'
  | 'ellipsoid'
  | 'cylinder'
  | 'cone';

  export type WebglShape = CustomModelShape | WebglPrimitiveShape;
