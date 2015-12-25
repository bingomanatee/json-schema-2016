import JsonSchema from './JsonSchema';
import _ from 'lodash';
import Feedback from './Feedback';

class JsonArraySchema extends JsonSchema {
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

  set type(value) {

  }

  get type() {
    return 'array';
  }

}

export default JsonArraySchema;
