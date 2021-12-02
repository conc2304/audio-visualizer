import { CATALOG_AVATAR_DIR } from '../constants';
import { P5Constructor, P5Sketch } from '../interfaces/P5Sketch.interface';

class CatalogDataEntry {
  constructor(
    // public classConstructor: P5Constructor,
    proto: P5Sketch,
    public title: string,
    public description: string,
    public tags: Array<string>,
    public creator: string,
    fileName: string,
    public popularity: number,
    public complexity: number,
    public creationDate: string,
  ) {
    const initialDate = new Date(this.creationDate || Date.now()).getTime();

    this.dateTime = isNaN(initialDate) ? new Date(Date.now()).getTime() : initialDate;
    this.classConstructor = proto.constructor as P5Constructor;
    this.gifUri = `${CATALOG_AVATAR_DIR}/${fileName}`;
  }

  public classConstructor: P5Constructor;
  public gifUri: string;
  public dateTime: number;
}

export default CatalogDataEntry;
