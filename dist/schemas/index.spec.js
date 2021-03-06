'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('schemas', function () {
    it('#validate() - use single schema file', function (done) {
        var dataToValidate = (0, _index3.loadJsonFileSync)('src/schemas/fixtures/earth.yml');
        if (_index2.default.validate(dataToValidate, __dirname + '/fixtures/', 'planetSchema.yml').length === 0) {
            done();
        }
    });

    it('#validate() - use complex schema files', function (done) {
        var dataToValidate = (0, _index3.loadJsonFileSync)('src/schemas/fixtures/solarSystem.yml');
        console.log(dataToValidate);
        var err = _index2.default.validate(dataToValidate, __dirname + '/fixtures/', 'solarSystemSchema.yml');
        if (err.length === 0) {
            done();
        }
    });

    it('#validate() - find validation error', function (done) {
        var dataToValidate = (0, _index3.loadJsonFileSync)('src/schemas/fixtures/invalidPlanet.yml');
        var errors = _index2.default.validate(dataToValidate, __dirname + '/fixtures/', 'planetSchema.yml');
        if (errors.length > 0) {
            //            errors.length.should.equal(1)
            //            errors[0].kind.should.equal('ObjectValidationError')
            //            errors[0].desc.should.equal('missing: earthMass,moons')
            (0, _expect2.default)(errors.length).toEqual(1);
            (0, _expect2.default)(errors[0].kind).toEqual('ObjectValidationError');
            (0, _expect2.default)(errors[0].desc).toEqual('missing: earthMass,moons');
            done();
        }
    });

    it('#validate() - missing schema error', function (done) {
        var dataToValidate = (0, _index3.loadJsonFileSync)('src/schemas/fixtures/earth.yml');
        var errors = _index2.default.validate(dataToValidate, __dirname + '/fixtures/', 'missingSchema.yml');
        if (errors.length > 0) {
            //            errors[0].desc.should.equal('No schema provided for validation.')
            (0, _expect2.default)(errors[0].desc).toEqual('No schema provided for validation.');
            done();
        }
    });
});