class CatalogueInfoProperty {
  /**
   *
   * @param {Constructor} constructor
   * @param {String} title
   * @param {String} description
   * @param {Array} categories     // a list of categories to desribe the sketch to filter on
   * @param {String} creator
   * @param {String} avatarURI
   * @param {Number} cpuUsage      // arbitrarily weighted value of how taxing this sketch is.  scale is 1 to 10  where 10 means it should run by itself.
   */
  constructor(constructor, title, description, categories, creator, avatarURI, cpuUsage) {
    this.classConstructor = constructor;
    this.title = title;
    this.description = description;
    this.filterCategories = categories;
    this.creator = creator;

    this.gifURI = avatarURI;
    this.cpuUsage = cpuUsage;
  }
}

export default CatalogueInfoProperty;
