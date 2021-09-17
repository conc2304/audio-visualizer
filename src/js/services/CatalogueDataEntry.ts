import { Constructor } from 'vue/types/options';

class CatalogueInfoProperty {
  constructor (
    public classConstructor: Function,
    public title: string,
    public description: string,
    public tags: Array<string>,
    public creator: string,
    public gifUri: string,
    public popularity: number,
    public complexity: number,
    public creationDate: string
  ) {
    this.dateTime = new Date(this.creationDate || Date.now()).getTime();
    this.dateTime = isNaN(this.dateTime) ? new Date(Date.now()).getTime() : this.dateTime;
  }

  public dateTime: number;
}

export default CatalogueInfoProperty;
