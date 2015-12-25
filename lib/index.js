import JsonSchema from './JsonSchema';
import JsonStringSchema from './JsonStringSchema';
import JsonNumberSchema from './JsonNumberSchema';
import JsonArraySchema from './JsonArraySchema';
import JsonObjectSchema from './JsonObjectSchema';
import JsonBooleanSchema from './JsonBooleanSchema';

import _ from 'lodash';

/**
 * This factory is an enabler of a strategy pattern.
 * Each Schema class is a specialization of JsonSchema
 * designed to handle a particular type of content.
 *
 * This method is attached to each strategy subclass
 * and is used to manage any properties of sub-schema.
 */

/**
 *
 * @param schema {Object} the JSON definition of the schema
 * @param parent {JsonSchema} (optional) the schema in whcih this schema is contained.
 * @param fieldInParent {String} (optional) the path to this schema from the parent.
 * @returns {JsonSchema} returns JsonSchema or one of its child classes.
 *
 */
const factory = (schema, parent, fieldInParent) => {
  let out;
  if (_.isObject(schema)) {
    switch (schema.type) {

      case 'boolean':
        out = new JsonBooleanSchema(schema, parent, fieldInParent);
        break;

      case 'string':
        out = new JsonStringSchema(schema, parent, fieldInParent);
        break;

      case 'number':
        out = new JsonNumberSchema(schema, parent, fieldInParent);
        break;

      case 'array':
        out = new JsonArraySchema(schema, parent, fieldInParent);
        break;

      case 'object':
        out = new JsonObjectSchema(schema, parent, fieldInParent);
        break;

      default:
        out = new JsonSchema(schema, parent, fieldInParent);
    }
  } else {
    out = new JsonSchema(schema, parent, fieldInParent);
  }
  return out;
};

JsonSchema.factory = factory;
JsonStringSchema.factory = factory;
JsonNumberSchema.factory = factory;
JsonArraySchema.factory = factory;
JsonObjectSchema.factory = factory;
JsonBooleanSchema.factory = factory;

export default factory;
