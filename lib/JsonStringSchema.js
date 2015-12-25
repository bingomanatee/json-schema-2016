import JsonSchema from './JsonSchema';
import _ from 'lodash';
import Feedback from './Feedback';

class JsonStringSchema extends JsonSchema {
  /* ------------------------- PROPERTIES --------------------- */

  init() {
    super.init();
    this.pattern = false;
    this.minLength = null;
    this.maxLength = null;
  }

  set maxLength(value) {
    if (_.isNull(value)) {
      this._maxLength = value;
    } else if (_.isNumber(value)) {
      if (value < 0) {
        throw new Error(`invalid maxLength: ${value}`);
      }
      this._maxLength = value;
    }
  }

  get maxLength() {
    return this._maxLength;
  }

  set minLength(value) {
    if (_.isNull(value)) {
      this._minLength = value;
    } else if (_.isNumber(value)) {
      if (value < 0) {
        throw new Error(`invalid minLength: ${value}`);
      }
      this._minLength = value;
    }
  }

  // note - not filtering integral results ???
  get minLength() {
    return this._minLength;
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

  /* ------------------------- DIGESTING --------------------- */

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

      switch (propName) {
        case 'maxLength':
          this.maxLength = value;
          break;

        case 'minLength':
          this.minLength = value;
          break;

        case 'pattern':
          this.pattern = value;
          break;

        default:
          this.handleGenericField(propName, value);
      }
    }
  }

  validate(target, returnFeedback) {
    let feedback = false;
    let isValid = true;
    if (returnFeedback) {
      feedback = new Feedback(target);
    }

    const _baseErr = (msg) => {
      isValid = false;
      if (returnFeedback) {
        feedback.addBase(msg, target);
      }
    };

    if (!_.isString(target)) {
      _baseErr('not a string');
    }
    if (this.pattern && !this.pattern.test(target)) {
      _baseErr('pattern mismatch');
    }
    if (!_.isNull(this.minLength) && target.length < this.minLength) {
      _baseErr('too short');
    }
    if (!_.isNull(this.maxLength) && target.length > this.maxLength) {
      _baseErr('too long', feedback);
    }

    return returnFeedback ? feedback : isValid;
  }

}

export default JsonStringSchema;
