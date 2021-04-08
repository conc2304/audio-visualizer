// Library Imports
// --------------------------------------------------------------
import P5, { Vector } from "p5";

// App Imports
// --------------------------------------------------------------
import { P5Sketch } from '../../shared/models/p5Sketch';

import easeInto from '../services/EasingService';
import helper from '../services/p5Helper.js';
import Utils from "../services/Utils";
import NumericProperty from '../services/PropertyConstructorNumeric';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';



export default class FlockingLight implements P5Sketch {

  // Private Properties
  private defaultEasingAmount = 0.7;
  private orbPosition: P5.Vector;


  public constructor (
    windowWidth: number,
    windowHeight: number,
  ) {
    this.sid = Utils.guidGenerator();
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;


    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Boids',
      'Just some boids chasing some stuff',
      [ 'Boids', 'Nature' ],
      'Clyzby',
      '',
      300,
      3,
    );
  }


  public catalogueInfo: CatalogueDataEntry;
  public bypass = false;
  public sid: string;
  public windowWidth: number;
  public windowHeight: number;


  // Sketch Element Properties
  // ---------------------------------------------------------------------------
  public orbSize = new NumericProperty('Orb Size', 'Base', 120, 20, 300, this.defaultEasingAmount);
  public orbGlow = new NumericProperty('Orb Glow', 'Base', 20, 1, 300, this.defaultEasingAmount);
  public orbSpeed = new NumericProperty('Orb Speed', 'Base', 5, 1, 100, this.defaultEasingAmount);
  public orbAmplitude = new NumericProperty('Orb Amplitude', 'Base', 5, 1, 200, this.defaultEasingAmount);
  public orbitalNum = new NumericProperty('Num Satellites', 'Base', 5, 1, 10, this.defaultEasingAmount);
  public orbitalSize = new NumericProperty('Satellites Size', 'Base', 20, 1, 100, this.defaultEasingAmount);
  public orbitalRadius = new NumericProperty('Orbit Radius', 'Base', 1, 1, 100, this.defaultEasingAmount);

  private orbTexture: P5.Image;
  private skyBoxTexture: P5.Image;
  private orbitalsTexture: P5.Image;

  // Rendering Section
  // ---------------------------------------------------------------------------
  public render(p5: P5) {

    p5.push();
    p5.textureWrap('clamp', 'clamp');
    this.renderLightOrb(p5);
    this.renderSkyBox(p5);
    this.renderOrbitals(p5);
    p5.pop();


  }

  private renderSkyBox(p5: P5) {
    p5.push();

    if (!this.skyBoxTexture) {
      // this.skyBoxTexture = p5.loadImage("./assets/textures/space-texture.jpeg");
      this.skyBoxTexture = p5.loadImage("./assets/textures/space-texture-nebula.jpg");
    } else {
      p5.texture(this.skyBoxTexture);
    }

    if (this.skyBoxTexture) {
      p5.rotateX(p5.frameCount * 0.001);
      p5.rotateZ(p5.frameCount * 0.001);
      p5.noStroke();
      p5.sphere(5500);
    }

    p5.pop();
  }

  private renderLightOrb(p5: P5) {
    p5.push();

    if (!this.orbTexture) {
      this.orbTexture = p5.loadImage("./assets/textures/2k_haumea_fictional.jpeg");
      console.log(this.orbTexture);
    } else {
      p5.texture(this.orbTexture);
    }


    const Amplitude = this.orbAmplitude.currentValue;
    const Frequency = this.orbSpeed.currentValue;
    const speed = this.orbSpeed.currentValue * 0.0001;
    const xNoise = p5.noise(p5.frameCount * speed);
    const yNoise = p5.noise(p5.frameCount * speed + 500);
    const zNoise = p5.noise(p5.frameCount * speed - 500);
    const xPos = p5.map(xNoise, 0, 1, -this.windowWidth / 2, this.windowWidth / 2);
    const yPos = p5.map(yNoise, 0, 1, -this.windowHeight / 2, this.windowHeight / 2);
    const zPos = p5.map(zNoise, 0, 1, -500, 0);
    this.orbPosition = new Vector().add(xPos, yPos, zPos);

    p5.translate(this.orbPosition.x, this.orbPosition.y, this.orbPosition.z);
    p5.rotateX(p5.frameCount * 0.0001);
    p5.rotateZ(p5.frameCount * 0.0003);
    if (this.orbTexture) {
      p5.noStroke();
    }
    p5.sphere(this.orbSize.currentValue);

    p5.pop();
  }

  private renderOrbitals(p5: P5) {
    p5.push();

    if (!this.orbitalsTexture) {
      this.orbitalsTexture = p5.loadImage("./assets/textures/2k_venus_surface.jpeg");
    } else {
      p5.noStroke();
      p5.texture(this.orbitalsTexture);
    }

    const center = this.orbPosition;

    p5.scale(this.orbitalSize.currentValue * 0.07);

    let i = 0;
    while (i < this.orbitalNum.currentValue) {
      const angle = p5.PI * (360 / i);
      const xPos = center.x + this.orbitalRadius.currentValue * p5.sin(p5.TWO_PI * i + (p5.frameCount * 0.01));
      const yPos = center.y + this.orbitalRadius.currentValue * p5.cos(p5.TWO_PI * i + (p5.frameCount * 0.01));
      const zPos = center.z;
      p5.model(p5[ 'objects' ].lambo);
      p5.translate(xPos, yPos, zPos);
      i++;
    }

    p5.pop();
  }

  private easeInto = easeInto;

}


