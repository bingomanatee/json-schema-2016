import JsonSchema from './JsonSchema';
import _ from 'lodash';
import Feedback from './Feedback';

class JsonObjectSchema extends JsonSchema {

  /**
   * this is the construction seed; not the JsonSchema properties.
   * @param pParams
   */
  set params(pParams) {
    this.init();

    if (!pParams) {
      throw new Error('schema cannot be empty');
    }
    if (!_.isObject(pParams)) {
      throw new Error('schema must be an object', pParams);
    }
    if (_.isArray(pParams)) {
      throw new Error('schema cannot be to array');
    }

    this._params = pParams;

    for (let propName in pParams) {
      if (!pParams.hasOwnProperty(propName)) {
        continue;
      }
      let value = pParams[propName];
      if (!value) {
        throw new Error(`empty value for property ${propName} of schema`);
      }

      switch (propName) {
        case 'id':
          this.id = value;
          break;

        case 'properties':
          this.properties = value;
          break;

        case 'type':
          this.type = value;
          break;

        case '$schema':
          this.$schema = value;
          break;

        default:
          throw new Error('strange field in schema def: ' + propName);
      }
    }
  }

  set properties(props) {
    for (let prop in props) {
      if (!props.hasOwnProperty(prop)) {
        continue;
      }
      //@TODO: property validation
      let propDef = props[prop];
      if (_.isString(propDef)) {
        propDef = {type: propDef};
      }
      this._props[prop] = JsonSchema.factory(propDef, this, prop);
    }
  }

  get properties() {
    return this._props;
  }

  set type(value) {

  }

  get type() {
    return 'object';
  }

  validate(target, returnFeedback) {
    let feedback = false;
    let isValid = true;
    if (returnFeedback) {
      feedback = new Feedback(target);
    }

    if (!_.isObject(target)) {
      isValid = false;
      if (returnFeedback) {
        feedback.addBase('bad object', target);
      }
    }

    return returnFeedback ? feedback : isValid;
  }

}

export
default
JsonObjectSchema;
