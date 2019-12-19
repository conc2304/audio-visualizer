import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import SketchMenu from '@/components/SketchMenu.vue';

import MenuLayerSelector from '@/components/MenuLayerSelector.vue';
import MenuCompositionControls from '@/components/MenuCompositionControls.vue';
import MenuPresetLauncher from '@/components/MenuPresetLauncher.vue';
import LayerControlPanel from '@/components/LayerControlPanel.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import CatalogueList from '@/components/CatalogueList.vue';
import HelpDialog from '@/components/HelpDialog.vue';
import PresetAssignSnackbar from '@/components/PresetAssignSnackbar.vue';

import RegisteredSketches from '@/js/services/SketchRegistration';

describe('SketchMenu', () => {
  let component;

  beforeEach(() => {
    component = shallowMount(SketchMenu);
  });

  it('should render a Layer Selector component', () => {
    expect(component.find(MenuLayerSelector).exists()).to.be.true;
  });

  it('should render a Composition Dashboard', () => {
    expect(component.find(MenuCompositionControls).exists()).to.be.true;
  });

  it('should render a Preset Slots launcher', () => {
    expect(component.find(MenuPresetLauncher).exists()).to.be.true;
  });

  it('should render a layer control panel', () => {
    expect(component.find(LayerControlPanel).exists()).to.be.true;
  });

  it('should render an Audio Player', () => {
    expect(component.find(AudioPlayer).exists()).to.be.true;
  });

  it('should render a Sketch Catalogue list', () => {
    expect(component.find(CatalogueList).exists()).to.be.true;
  });

  it('should render a Help Dialog', () => {
    expect(component.find(HelpDialog).exists()).to.be.true;
  });

  it('should render a Preset Slot Assignment snackbar', () => {
    expect(component.find(PresetAssignSnackbar).exists()).to.be.true;
  });

  it('should contain an array of registered sketches', () => {
    expect(RegisteredSketches).to.be.an('array');
  });

  it('should render an audio player toggler', () => {
    expect(component.find('#audio-player-toggle-wrapper').exists()).to.be.true;
  });
});
