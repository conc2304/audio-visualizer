class CatalogueInfoProperty {
  /**
   *
   * @param {Constructor} constructor
   * @param {String} title
   * @param {String} description
   * @param {Array} tags     // a list of categories to desribe the sketch to filter on
   * @param {String} creator
   * @param {String} avatarURI
   * @param {Number} popularity      // currently a made up number
   * @param {Number} complexity      // arbitrarily weighted value of how taxing this sketch is.  scale is 1 to 10  where 10 means it should run by itself.
   */
  constructor(constructor, title, description, tags, creator, avatarURI, popularity, complexity) {
    this.classConstructor = constructor;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.creator = creator;
    this.gifURI = avatarURI;
    this.popularity = popularity;
    this.complexity = complexity;
  }
}

export default CatalogueInfoProperty;
