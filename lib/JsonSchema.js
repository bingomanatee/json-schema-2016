const VALID_TYPES = ['', 'number', 'string', 'object', 'array', 'boolean', 'null'];
import _ from 'lodash';
import {isUri} from 'valid-url';
import Feedback from './Feedback';

class JsonSchema {
  constructor(params, parentSchema, nameInParentSchema) {

    if (parentSchema) {
      this.parentSchema = parentSchema;
      this.nameInParentSchema = nameInParentSchema;
    } else {
      this.parentSchema = null;
      this.nameInParentSchema = '';
    }

    this.params = params;
  }

  /* ------------ PROPERTIES ------------- */

  init() {
    this._props = {};
    this.type = null;
    this.id = null;
    this.$schema = null;
    this.title = '';
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

  get isRoot() {
    return !this.parentSchema;
  }

  set type(value) {
    if (!_.isNull(value) && !VALID_TYPES.includes(value)) {
      throw new Error('bad type ' + value);
    }
    this._type = value;
  }

  get type() {
    return this._type;
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

  /**
   * This is a diagnostic aid; it simply copies the input for analysis
   * @returns {*}
   */
  get params() {
    return this._params;
  }

  handleGenericField(propName, value) {
    switch (propName) {
      case 'id':
        this.id = value;
        break;

      case 'type':
        this.type = value;
        break;

      case '$schema':
        this.$schema = value;
        break;

      case 'title':
        this.title = value;
        break;

      case 'description':
        this.description = value;
        break;

      case 'default':
        this.default = value;
        break;

      default:
        throw new Error('strange field in schema def: ' + propName);
    }
  }

  get fieldCount() {
    let c = 0;
    for (let property in this.properties) {
      if (this.properties.hasOwnProperty(property)) {
        ++c;
      }
    }
    return c;
  }

  /* --------------- VALIDATING ------------------- */

  /**
   * Given that the only way a specialist class hasn't overridden this method
   * is that the schema is empty, it always passes whatever the value.
   * @param target
   * @param returnFeedback
   * @returns {*}
   */
  validate(target, returnFeedback) {
    return returnFeedback ? null : true;
  }

}

export default JsonSchema;
