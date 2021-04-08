import P5 from "p5";
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';

export interface P5Sketch {
  render(p5: P5): void;
  windowWidth: number;
  windowHeight: number;
  bypass: boolean;
  catalogueInfo: CatalogueDataEntry;
  sid: string;
}

export interface AudioProperties {
  responsiveType: AudioResponsiveMode,
  responsiveOptions: Array<AudioResponsiveMode>,
  gain: number,
  fall: number, // not sure what this will do yet
}

export type AudioResponsiveMode = 'add' | 'subtract';
