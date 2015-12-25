const chai = require('chai');
const expect = chai.expect;
import jsonSchema from '../lib';

const STRING = 'string';
const NUMBER = 'number';
const ARRAY = 'array';
const SITE_ID = 'http://www.my_site.schema';

describe('json-schema-2015', function () {
  describe('#constructor', function () {
    it('should crash on no parameter', function () {
      expect(() => jsonSchema()).to.throw(/schema cannot be empty/);
    });

    it('should crash on an array', function () {
      expect(() => jsonSchema([])).to.throw(/schema cannot be to array/);
    });

    it('should crash on an a non-object', function () {
      expect(() => jsonSchema('{schema}')).to.throw(/schema must be an object/);
    });

    describe('with fields but no id', function () {
      let withProps;

      const BETTER_SCHEMA = {properties: {alpha: STRING, beta: NUMBER}};
      beforeEach(function () {
        withProps = jsonSchema(BETTER_SCHEMA);
      });

      it('should have the expected fields', function () {
        expect(withProps.properties.alpha.type).to.equal(STRING);
        expect(withProps.properties.beta.type).to.equal(NUMBER);
      });

      it('#id', function () {
        expect(withProps.id).to.equal('');
      });

      it('#fieldCount', function () {
        expect(withProps.fieldCount).to.equal(2);
      });

      it('should reject empty field definitions', function () {
        expect(() => jsonSchema({foo: false})).to.throw(/empty value for property/);

      });

      describe('with id', function () {
        const SCHEMA_WITH_ID = Object.assign({id: SITE_ID}, BETTER_SCHEMA);
        let withId;

        beforeEach(function () {
          withId = jsonSchema(SCHEMA_WITH_ID);
        });

        it('should have the expected fields', function () {
          expect(withProps.properties.alpha.type).to.equal(STRING);
          expect(withProps.properties.beta.type).to.equal(NUMBER);
        });

        /**
         * this is significant in that the ID definition is not counted as as field.
         */
        it('#fieldCount', function () {
          expect(withProps.fieldCount).to.equal(2);
        });

        it('should have the right ID', function () {
          expect(withId.id).to.equal(SITE_ID);
        });
      });
    });
  });

  describe('#id', function () {
    let parentSchema;
    beforeEach(function () {
      parentSchema = jsonSchema({properties: {foo: STRING}});
    });

    it('should reject an invalid id', function () {
      expect(() => jsonSchema({id: 'something wrong'})).to.throw(/bad url/);
    });

    it('should accept a blank id', function () {
      /* eslint no-unused-expressions: 0 */
      expect(() => jsonSchema({id: ''})).to.be.ok;
    });

    it('should not check IDs of sub schemas', function () {
      /* eslint no-unused-expressions: 0, indent: 0 */
      expect(function () {
        jsonSchema({
            id: 'something wrong', properties: {name: STRING}
          },
          parentSchema, 'foo'
        );
      }).to.not.throw(Error);
    });

  });

  describe('#type', function () {
    describe('string type', function () {
      let instanceWithStringType;

      beforeEach(function () {
        instanceWithStringType = jsonSchema({type: STRING});
      });

      it('should have type string', function () {
        expect(instanceWithStringType.type).to.equal(STRING);
      });
    });

    describe('array type', function () {
      let instanceWithArrayType;

      beforeEach(function () {
        instanceWithArrayType = jsonSchema({type: ARRAY});
      });

      it('should have type string', function () {
        expect(instanceWithArrayType.type).to.equal(ARRAY);
      });
    });

    describe('strange type', function () {
      expect(() => jsonSchema({type: 'foo'})).to.throw(/bad type/);
    });

  });

});
