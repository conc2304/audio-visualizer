// Library Imports
// --------------------------------------------------------------
import P5, { Vector } from "p5";

// App Imports
// --------------------------------------------------------------
import { P5Sketch } from '../../shared/models/p5Sketch';
import { Flock, Boid } from "./SketchFlockingBoids";
import easeInto from '../services/EasingService';
import helper from '../services/p5Helper.js';
import Utils from "../services/Utils";
import NumericProperty from '../services/PropertyConstructorNumeric';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import p5 from 'p5';

export default class ParametricFlocking implements P5Sketch {

  // Private Properties
  private defaultEasingAmount = 0.7;

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

  public orbSize = new NumericProperty('Orb Size', 'Base', 100, 20, 300, this.defaultEasingAmount);
  public orbVelocity = new NumericProperty('Orb Speed', 'Base', 1, -50, 50, this.defaultEasingAmount);
  public orbitalNum = new NumericProperty('Num Orbs', 'Base', 2, 1, 20, this.defaultEasingAmount);
  public orbRadius = new NumericProperty('Orb Radius', 'Base', 400, 20, 1000, this.defaultEasingAmount);
  public flockSize = new NumericProperty('Flock Size', 'Base', 10, 4, 100, this.defaultEasingAmount);

  // Rendering Section
  // ---------------------------------------------------------------------------
  public render(p5: P5) {
    if (!this.myP5) {
      this.myP5 = p5;
    }

    p5.push();

    p5.stroke('red');
    p5.strokeWeight(2);
    p5.fill('blue');

    this.myP5.ellipse(0, 0, 20, 20);

    // create or remove flocks
    this.sizeFlockArray();

    // render orbitals and flocks
    this.renderOrbitals();

    p5.pop();
  }

  private renderOrbitals() {
    this.myP5.push();
    const step = this.myP5.TWO_PI / Math.floor(this.orbitalNum.currentValue);
    this.myP5.normalMaterial();

    for (let i = 0; i < Math.floor(this.orbitalNum.currentValue); i++) {
      this.orbitalCoords[ i ] = this.parametricCircle(i * step);
      this.myP5.push();

      this.myP5.translate(this.orbitalCoords[ i ].x, this.orbitalCoords[ i ].y);
      this.myP5.sphere(this.orbSize.currentValue);

      // update what the flock should be following and render
      this.flocks[ i ].targetPos = this.orbitalCoords[ i ];
      this.flocks[ i ].run();
      this.myP5.pop();

    }

    this.myP5.pop();
  }

  private sizeFlockArray() {
    // make sure we have the right amount of flocks
    if (this.flocks.length < this.orbitalNum.currentValue) {
      for (let i = this.flocks.length - 1; i < this.orbitalNum.currentValue; i++) {
        this.flocks.push(this.initializeFlock(i));
      }
    } else if (this.flocks.length > this.orbitalNum.currentValue) {
      this.flocks.length = Math.floor(this.orbitalNum.currentValue);
    }
  }

  private renderFlock(flockIndex: number) {
    // we want each flock of boids to chase the orbitals

  }

  private initializeFlock(targetIndex: number): Flock {
    const targetPos = this.orbitalCoords[ targetIndex ];
    let flock = new Flock(targetPos);
    // Add an initial set of boids into the system
    for (let i = 0; i < this.flockSize.currentValue; i++) {
      let b = new Boid(0, 0, this.myP5);
      flock.addBoid(b);
    }

    return flock;
  }


  private parametricCircle(step: number): P5.Vector {
    let position = new P5.Vector();

    position.set(
      this.myP5.sin((this.orbVelocity.currentValue * 0.01) * this.myP5.frameCount + step) * this.orbRadius.currentValue,
      this.myP5.cos((this.orbVelocity.currentValue * 0.01) * this.myP5.frameCount + step) * this.orbRadius.currentValue,
      0
    );
    return position;
  }


  private orbitalCoords: Array<P5.Vector> = [];
  private flocks: Array<Flock> = [];
  private myP5: P5;
  private easeInto = easeInto;
}
