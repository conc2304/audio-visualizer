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
    console.log(this.creationDate);
    this.dateTime = new Date(this.creationDate || Date.now()).getTime();
    console.log(this.dateTime);
  }

  public dateTime: number;
}

export default CatalogueInfoProperty;
