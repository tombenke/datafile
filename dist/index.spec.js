'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _index = require('./index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('datafile', function () {

    it('loadDataFileSync - load a single file', function () {
        var data = (0, _index.loadDataFileSync)('src/fixtures/solarSystem.yml', false);
        (0, _expect2.default)(data).toBeA('object');
        (0, _expect2.default)(data).toIncludeKeys(['name', 'format', 'comment', 'planets']);
        (0, _expect2.default)(data.name).toEqual('The Solar System');
        (0, _expect2.default)(data.planets).toBeAn('object');
    });

    it('loadDataFileSync - try to load a non-existing file (throws exception)', function () {
        try {
            (0, _index.loadDataFileSync)('src/fixtures/slrSystem.yml');
        } catch (err) {
            (0, _expect2.default)(err).toBeAn(Error);
        }
    });

    it('loadDataFileSync - try to load a non-existing file (throws no exception)', function () {
        var data = (0, _index.loadDataFileSync)('src/fixtures/slrSystem.yml', false);
        (0, _expect2.default)(data).toBeA('object');
        (0, _expect2.default)(data).toEqual({});
    });

    it('loadDataFileSync - try to load with no name (throws exception)', function () {
        try {
            (0, _index.loadDataFileSync)(null);
        } catch (err) {
            (0, _expect2.default)(err).toEqual('Error: File name is missing!');
        }
    });

    it('loadDataFileSync - try to load with no name (throws no exception)', function () {
        var data = (0, _index.loadDataFileSync)(null, false);
        (0, _expect2.default)(data).toBeA('object');
        (0, _expect2.default)(data).toEqual({});
    });

    it('mergeDataFilesSync - load a single file', function () {
        var data = (0, _index.mergeDataFilesSync)(['src/fixtures/solarSystem.yml']);
        (0, _expect2.default)(data).toBeA('object');
        (0, _expect2.default)(data).toIncludeKeys(['name', 'format', 'comment', 'planets']);
        (0, _expect2.default)(data.name).toEqual('The Solar System');
        (0, _expect2.default)(data.planets).toBeAn('object');
    });

    it('loadDataSync - merging several files', function () {
        var filesToMerge = ['src/fixtures/solarSystem.yml', 'src/fixtures/moons.yml', 'src/fixtures/earth.yml', 'src/fixtures/mars.yml'];
        (0, _expect2.default)((0, _index.loadData)(filesToMerge)).toEqual((0, _index.mergeDataFilesSync)(filesToMerge));
    });

    it('mergeDataFilesSync - merging several files', function () {
        var data = (0, _index.mergeDataFilesSync)(['src/fixtures/solarSystem.yml', 'src/fixtures/moons.yml', 'src/fixtures/earth.yml', 'src/fixtures/mars.yml']);

        var mars = {
            "earthMass": 0.11,
            "numOfMoons": 2,
            "moons": {
                "Deimos": {},
                "Phobos": {}
            }
        };

        (0, _expect2.default)(data).toBeA('object');
        (0, _expect2.default)(data.name).toEqual('The Solar System');
        (0, _expect2.default)(data).toIncludeKeys(['name', 'format', 'comment', 'planets']);
        (0, _expect2.default)(data.planets).toIncludeKeys(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Neptune', 'Uranus', 'Pluto']);
        (0, _expect2.default)(data.planets.Mars).toEqual(mars);
    });

    it('listFilesSync - list files (recursive)', function () {
        (0, _expect2.default)((0, _index.listFilesSync)('src/fixtures/')).toEqual(['src/fixtures/earth.yml', 'src/fixtures/mars.yml', 'src/fixtures/moons.yml', 'src/fixtures/solarSystem.yml', 'src/fixtures/tree/services/customers/customer/service.yml', 'src/fixtures/tree/services/customers/service.yml', 'src/fixtures/tree/services/defaults/noHeaders/service.yml', 'src/fixtures/tree/services/defaults/noTestCases/service.yml', 'src/fixtures/tree/services/monitoring/isAlive/service.yml']);
    });

    it('listFilesSync - list files (non-recursive)', function () {
        (0, _expect2.default)((0, _index.listFilesSync)('src/fixtures/', false)).toEqual(['earth.yml', 'mars.yml', 'moons.yml', 'solarSystem.yml']);
    });

    it('findFilesSync - find s*.yml files (non-recursive)', function () {
        (0, _expect2.default)((0, _index.findFilesSync)('src/fixtures/', /^s.+\.yml$/, false)).toEqual(['solarSystem.yml']);
    });

    it('findFilesSync - find s*.yml files and merge them by urlPattern|urlTemplate keys', function () {
        var fileListToMerge = (0, _index.findFilesSync)('src/fixtures/', /^s.+\.yml$/);
        var results = (0, _index.mergeDataFilesByKeySync)(fileListToMerge, 'uriTemplate', (0, _index.mergeDataFilesByKeySync)(fileListToMerge, 'urlPattern'));
        (0, _expect2.default)(_.keys(results)).toEqual(['/customers/{id}', '/customers', '/monitoring/isAlive', '/defaults/noHeaders', '/defaults/noTestCases']);
    });
});