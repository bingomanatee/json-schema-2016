import JsonSchema from './JsonSchema';
import _ from 'lodash';
import Feedback from './Feedback';

class JsonBooleanSchema extends JsonSchema {
  validate(target, returnFeedback) {
    let feedback = false;
    let isValid = true;
    if (returnFeedback) {
      feedback = new Feedback(target);
    }

    if (!_.isBoolean(target)) {
      isValid = false;
      if (returnFeedback) {
        feedback.addBase('bad boolean value', target);
      }
    }

    return returnFeedback ? feedback : isValid;
  }

  set type(value) {

  }

  get type() {
    return 'boolean';
  }

}

export default JsonBooleanSchema;
