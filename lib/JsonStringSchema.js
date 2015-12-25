import JsonSchema from './JsonSchema';
import _ from 'lodash';
import Feedback from './Feedback';

class JsonStringSchema extends JsonSchema {
  validate(target, returnFeedback) {
    let feedback = false;
    let isValid = true;
    if (returnFeedback) {
      feedback = new Feedback(target);
    }

    if (!_.isString(target)) {
      isValid = false;
      if (returnFeedback) {
        feedback.addBase('bad string', target);
      }
    }

    return returnFeedback ? feedback : isValid;
  }

}

export default JsonStringSchema;
