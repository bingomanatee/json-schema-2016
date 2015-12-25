import JsonSchema from './JsonSchema';
import _ from 'lodash';
import Feedback from './Feedback';

class JsonArraySchema extends JsonSchema {

  set type(value) {

  }

  get type() {
    return 'array';
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
      this.handleGenericField(propName, pParams[propName]);
    }
  }

  /* ---------------- VALIDATION ------------------ */

  validate(target, returnFeedback) {
    let feedback = false;
    let isValid = true;
    if (returnFeedback) {
      feedback = new Feedback(target);
    }

    if (!_.isArray(target)) {
      isValid = false;
      if (returnFeedback) {
        feedback.addBase('bad array', target);
      }
    }

    return returnFeedback ? feedback : isValid;
  }

}

export default JsonArraySchema;
