class Feedback {
  constructor(target) {
    this.target = target;
    this.properties = {};
    this.base = [];
  }

  addBase(error, data) {
    this.base.push({error: error, data: data});
    return this;
  }

  addProperty(name, error, data) {
    if (!this.properties[name]) {
      this.properties[name] = [];
    }

    this.properties[name].push({error: error, data: data});
    return this;
  }
}

export default Feedback;
