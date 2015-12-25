import _ from 'lodash';
import {isUri} from 'valid-url';

import Feedback from './Feedback';

const VALID_TYPES = ['', 'number', 'string', 'object', 'array', 'boolean', 'null'];

class JsonSchema {

  constructor(params, parentSchema, nameInParentSchema) {

    if (parentSchema) {
      this.parentSchema = parentSchema;
      this.nameInParentSchema = nameInParentSchema;
    } else {
      this.parentSchema = null;
      this.nameInParentSchema = '';
    }

    this._props = {};
    this.id = '';
    this.$schema = '';
    this.type = '';
    this.params = params;
  }

  get isRoot() {
    return !this.parentSchema;
  }

  set type(value) {
    if (!VALID_TYPES.includes(value)) {
      throw new Error('bad type ' + value);
    }
    this._type = value;
  }

  get type() {
    return this._type;
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
      this._props[prop] = new JsonSchema(propDef, this, prop);
    }
  }

  get properties() {
    return this._props;
  }

  set $schema(value) {
    if (value) {
      if (!_.isString(value)) {
        throw new Error('non-string id');
      }
      if (this.isRoot) {
        if (!isUri(value)) {
          throw new Error(`$schema set to bad url ${value}`);
        }
      } else {
        if (value) {
          throw new Error('only root Schema can have a $schema');
        }
      }
    }
    this._schema = value;
  }

  get $schema() {
    return this._schema;
  }

  set id(value) {
    if (value) {
      if (!_.isString(value)) {
        throw new Error('non-string id');
      }
      if (this.isRoot && !isUri(value)) {
        throw new Error(`id set to bad url ${value}`);
      }
    }
    this._id = value;
  }

  get id() {
    return this._id;
  }

  /**
   * this is the construction seed; not the JsonSchema properties.
   * @param pParams
   */
  set params(pParams) {
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

  get params() {
    return this._params;
  }

  get fieldCount() {
    let c = 0;
    /* eslint no-unused-vars: 0 */
    for (let property in this.properties) {
      ++c;
    }
    return c;
  }

  /**
   * this is the core method of validating
   * @param target
   * @param returnFeedback
   * @returns {*}
   */
  validate(target, returnFeedback) {
    let feedback = false;
    let isValid = true;
    if (returnFeedback) {
      feedback = new Feedback(target);
    }

    switch (this.type) {
      case '':

        break;

      case 'string':
        if (!_.isString(target)) {
          isValid = false;
          if (returnFeedback) {
            feedback.addBase('bad string', target);
          }
        }
        break;
    }

    return returnFeedback ? feedback : isValid;
  }
}

/**
 * note: realistically you shouldn't be able to define a parentSchema in the factory
 * but for testability we are allowing the assertion of a parent.
 * @param schema {object} the schema definition
 *
 * // don't pass this in production
 *
 * @param ps {JsonSchema} (optional) the parent of the current schema
 * @param n {string} (optional) the name of this schema in the parent's context
 */
export default (schema, ps, n) => new JsonSchema(schema, ps, n);
