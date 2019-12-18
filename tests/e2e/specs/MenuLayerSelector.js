import { isIterable } from 'core-js';
import { RegisteredSketches } from '@/js/services/SketchRegistration'

describe('Menu Layer Selector', () => {
  const sketchLength = RegisteredSketches.length
  it('selects layers ', () => {
    cy.visit('/playground');
    cy.contains('#layer-selector');

  })
})
