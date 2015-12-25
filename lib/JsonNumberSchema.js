import JsonSchema from './JsonSchema';
import _ from 'lodash';
import Feedback from './Feedback';

class JsonNumberSchema extends JsonSchema {
  validate(target, returnFeedback) {
    let feedback = false;
    let isValid = true;
    if (returnFeedback) {
      feedback = new Feedback(target);
    }

    if (!_.isNumber(target)) {
      isValid = false;
      if (returnFeedback) {
        feedback.addBase('bad number', target);
      }
    }

    return returnFeedback ? feedback : isValid;
  }

  set type(value) {

  }

  get type() {
    return 'number';
  }

}

export default JsonNumberSchema;
