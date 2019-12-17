import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import AudioPlayer from '@/components/AudioPlaylist.vue'
import AudioPlaylist from '@/components/AudioPlaylist.vue'

describe("AudioPlayer", () => {
  let component;

  beforeEach(() => {
    component = shallowMount(AudioPlayer);
  });

  it("should render a playlist", () => {
    expect(component.find(AudioPlaylist).exists()).to.be.true;
  });
});
