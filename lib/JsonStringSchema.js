import JsonSchema from './JsonSchema';
import _ from 'lodash';
import Feedback from './Feedback';

class JsonStringSchema extends JsonSchema {

  /**
   * this is the construction seed; not the JsonSchema properties.
   * @param pParams
   */
  set params(pParams) {

    this.pattern = false;

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
          break;

        case 'pattern':
          this.pattern = value;
          break;

        case '$schema':
          this.$schema = value;
          break;

        default:
          throw new Error('strange field in schema def: ' + propName);
      }
    }
  }

  set pattern(value) {
    this._pattern = value ? new RegExp(value) : null;
  }

  get pattern() {
    return this._pattern;
  }

  set type(value) {

  }

  get type() {
    return 'string';
  }

  validate(target, returnFeedback) {
    let feedback = false;
    let isValid = true;
    if (returnFeedback) {
      feedback = new Feedback(target);
    }

    if (!_.isString(target)) {
      isValid = false;
      if (returnFeedback) {
        feedback.addBase('non-string', target);
      }
    } else if (this.pattern && !this.pattern.test(target)) {
      isValid = false;
      if (returnFeedback) {
        feedback.addBase('pattern mismatch', target);
      }
    }

    return returnFeedback ? feedback : isValid;
  }

}

export default JsonStringSchema;
