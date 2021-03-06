const chai = require('chai');
const expect = chai.expect;
import jsonSchema from '../lib';

const STRING = 'string';
const NUMBER = 'number';
const BOOLEAN = 'boolean';
const ARRAY = 'array';
const SITE_ID = 'http://www.my_site.schema';
import util from 'util';

describe('json-schema', function () {
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

      const BETTER_SCHEMA = {type: 'object', properties: {alpha: STRING, beta: NUMBER}};
      beforeEach(function () {
        withProps = jsonSchema(BETTER_SCHEMA);
      });

      it('should have the expected fields', function () {
        expect(withProps.properties.alpha.type).to.equal(STRING);
        expect(withProps.properties.beta.type).to.equal(NUMBER);
      });

      it('#id', function () {
        expect(withProps.id).to.be.null;
      });

      it('#fieldCount', function () {
        expect(withProps.fieldCount).to.equal(2);
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
      parentSchema = jsonSchema({type: 'object', properties: {foo: STRING}});
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
            id: 'something wrong', type: 'object', properties: {name: STRING}
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
      it('should throw error', function () {
        expect(function () {
          jsonSchema({type: 'foo'});
        }).to.throw(/bad type/);
      });
    });

  });

  describe('#validate', function () {

    describe('boolean', function () {
      let instanceBool;

      beforeEach(function () {
        instanceBool = jsonSchema({type: BOOLEAN});
      });

      it('should validate true', function () {
        expect(instanceBool.validate(true)).to.be.true;
      });

      it('should validate false', function () {
        expect(instanceBool.validate(false)).to.be.true;
      });

      it('should return an error for a string', function () {
        expect(instanceBool.validate('')).to.be.false;
      });
    });

    describe('array', function () {
      let instanceArray;

      beforeEach(function () {
        instanceArray = jsonSchema({type: ARRAY});
      });

      it('should return true on an array', function () {
        expect(instanceArray.validate([1, 2])).to.be.true;
      });

      it('should return false on a non array', function () {
        expect(instanceArray.validate(2)).to.be.false;
      });

    });

    describe('number', function () {
      let instanceNumber;

      beforeEach(function () {
        instanceNumber = jsonSchema({type: NUMBER});
      });

      it('should return true on an number', function () {
        expect(instanceNumber.validate(2)).to.be.true;
      });

      it('should return false on a non number', function () {
        expect(instanceNumber.validate('2')).to.be.false;
      });

    });

    describe('string', function () {
      let instanceString;

      beforeEach(function () {
        instanceString = jsonSchema({type: STRING});
      });

      it('should return true on a string', function () {
        expect(instanceString.validate('foo')).to.be.true;
      });

      it('should return false on a number', function () {

        expect(instanceString.validate(3)).to.be.false;
      });

      describe('with minLength', function () {
        let instanceMin;

        beforeEach(function () {
          instanceMin = jsonSchema({type: STRING, minLength: 5});
        });

        it('should be valid for long strings', function () {
          expect(instanceMin.validate('fooooooo')).to.be.true;
        });

        it('should be invalid for short strings', function () {
          expect(instanceMin.validate('foo')).to.be.false;
        });

      });

      describe('with pattern', function () {
        let instancePatternedString;

        beforeEach(function () {
          instancePatternedString = jsonSchema({type: 'string', pattern: '^[\\d]{3}-[\\d]{3}-[\\d]{4}$'});
        });

        it('should accept a valid phone number pattern', function () {
          expect(instancePatternedString.validate('111-222-3333')).to.be.true;
        });

        it('should reject an invalid phone number pattern', function () {
          expect(instancePatternedString.validate('111-222-333')).to.be.false;
        });
      });
    });
  });

});
