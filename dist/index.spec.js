'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _index = require('./index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var destCleanup = function destCleanup(cb) {
    var dest = _path2.default.resolve('./tmp/');
    console.log('Remove: ', dest);
    (0, _rimraf2.default)(dest, cb);
};

before(function (done) {
    destCleanup(function () {
        _fs2.default.mkdirSync(_path2.default.resolve('./tmp'));
        done();
    });
});

after(function (done) {
    destCleanup(done);
});

describe('datafile', function () {
    it('loadTextFileSync - load a text file', function () {
        var content = (0, _index.loadTextFileSync)('src/fixtures/merge/earth.yml', false);
        (0, _expect2.default)(typeof content === 'undefined' ? 'undefined' : _typeof(content)).toBe('string');
        (0, _expect2.default)(content).toEqual('planets:\n    Earth:\n        moons:\n            Moon: {}\n');
    });

    it('loadTextFileSync - try to load a non-existing file (throws exception)', function () {
        try {
            (0, _index.loadTextFileSync)('nonExistingFile.txt');
        } catch (err) {
            (0, _expect2.default)(err).toBeInstanceOf(Error);
        }
    });

    it('loadTextFileSync - try to load a non-existing file (throws no exception)', function () {
        var data = (0, _index.loadTextFileSync)('nonExistingFile.txt', false);
        (0, _expect2.default)(typeof data === 'undefined' ? 'undefined' : _typeof(data)).toBe('object');
        (0, _expect2.default)(data).toEqual(null);
    });

    it('saveTextFileSync - save text content into a file', function () {
        var testFileName = 'tmp/testFileToSave.txt';
        var contentToSave = 'This is a simple text to save,\nand load back\n\n';

        (0, _index.saveTextFileSync)(testFileName, contentToSave, false);
        (0, _expect2.default)(_fs2.default.readFileSync(testFileName, 'utf-8')).toEqual(contentToSave);
    });

    it('saveTextFileSync - try to save a file into a non-existing dir (throws exception)', function () {
        try {
            (0, _index.saveTextFileSync)('tmp/nonExistingFileDir/file.txt', 'content');
        } catch (err) {
            (0, _expect2.default)(err).toBeInstanceOf(Error);
        }
    });

    it('saveTextFileSync - try to save a file into a non-existing dir (throws no exception)', function () {
        (0, _index.saveTextFileSync)('tmp/nonExistingFileDir/file.txt', 'content', false);
    });

    it('loadJsonFileSync - load a single file', function () {
        var data = (0, _index.loadJsonFileSync)('src/fixtures/merge/solarSystem.yml', false);
        (0, _expect2.default)(data).toBeInstanceOf(Object);
        //expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        (0, _expect2.default)(data.name).toEqual('The Solar System');
        (0, _expect2.default)(data.planets).toBeInstanceOf(Object);
    });

    it('loadJsonFileSync - try to load a non-existing file (throws exception)', function () {
        try {
            (0, _index.loadJsonFileSync)('nonExistingFile.yml');
        } catch (err) {
            (0, _expect2.default)(err).toBeInstanceOf(Error);
        }
    });

    it('loadJsonFileSync - try to load a non-existing file (throws no exception)', function () {
        var data = (0, _index.loadJsonFileSync)('nonExistingFile.yml', false);
        (0, _expect2.default)(data).toBeInstanceOf(Object);
        (0, _expect2.default)(data).toEqual({});
    });

    it('loadJsonFileSync - try to load with no name (throws exception)', function () {
        try {
            (0, _index.loadJsonFileSync)(null, true);
        } catch (err) {
            (0, _expect2.default)(err).toEqual(new Error('File name is missing!'));
        }
    });

    it('loadJsonFileSync - try to load with no name (throws no exception)', function () {
        var data = (0, _index.loadJsonFileSync)(null, false);
        (0, _expect2.default)(data).toBeInstanceOf(Object);
        (0, _expect2.default)(data).toEqual({});
    });

    it('listFilesSync - list files (recursive)', function () {
        (0, _expect2.default)((0, _index.listFilesSync)('src/fixtures/')).toEqual(['src/fixtures/merge/earth.yml', 'src/fixtures/merge/mars.yml', 'src/fixtures/merge/moons.yml', 'src/fixtures/merge/solarSystem.yml', 'src/fixtures/refs/endpoints/health.yml', 'src/fixtures/refs/endpoints/monitoring.yml', 'src/fixtures/refs/genericHeaders.yml', "src/fixtures/refs/protocols.yml", "src/fixtures/refs/root.yml", 'src/fixtures/templates/copyright.html', 'src/fixtures/templates/footer.html', 'src/fixtures/templates/header.html', 'src/fixtures/templates/main.html', 'src/fixtures/tree/services/customers/customer/service.yml', 'src/fixtures/tree/services/customers/service.yml', 'src/fixtures/tree/services/defaults/noHeaders/service.yml', 'src/fixtures/tree/services/defaults/noTestCases/service.yml', 'src/fixtures/tree/services/monitoring/isAlive/service.yml']);
    });

    it('listFilesSync - list files (non-recursive)', function () {
        (0, _expect2.default)((0, _index.listFilesSync)('src/fixtures/merge/', false)).toEqual(['earth.yml', 'mars.yml', 'moons.yml', 'solarSystem.yml']);
    });

    it('findFilesSync - find s*.yml files (non-recursive)', function () {
        (0, _expect2.default)((0, _index.findFilesSync)('src/fixtures/merge/', /^s.+\.yml$/, false)).toEqual(['solarSystem.yml']);
    });

    it('findFilesSync - find s*.yml files (recursive + splitBaseDir)', function () {
        (0, _expect2.default)((0, _index.findFilesSync)('src/fixtures/merge/', /^s.+\.yml$/, true, true)).toEqual(['solarSystem.yml']);
    });

    it('mergeJsonFilesSync - load a single file', function () {
        var data = (0, _index.mergeJsonFilesSync)(['src/fixtures/merge/solarSystem.yml']);
        (0, _expect2.default)(data).toBeInstanceOf(Object);
        //expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        (0, _expect2.default)(data.name).toEqual('The Solar System');
        (0, _expect2.default)(data.planets).toBeInstanceOf(Object);
    });

    it('mergeJsonFilesSync - merging several files', function () {
        var data = (0, _index.mergeJsonFilesSync)(['src/fixtures/merge/solarSystem.yml', 'src/fixtures/merge/moons.yml', 'src/fixtures/merge/earth.yml', 'src/fixtures/merge/mars.yml']);

        var mars = {
            earthMass: 0.11,
            numOfMoons: 2,
            moons: {
                Deimos: {},
                Phobos: {}
            }
        };

        (0, _expect2.default)(data).toBeInstanceOf(Object);
        (0, _expect2.default)(data.name).toEqual('The Solar System');
        //expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        //expect(data.planets).toIncludeKeys([
        //    'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Neptune', 'Uranus', 'Pluto'
        //])
        (0, _expect2.default)(data.planets.Mars).toEqual(mars);
    });

    it('loadData - merging several files', function () {
        var filesToMerge = ['src/fixtures/merge/solarSystem.yml', 'src/fixtures/merge/moons.yml', 'src/fixtures/merge/earth.yml', 'src/fixtures/merge/mars.yml'];
        (0, _expect2.default)((0, _index.loadData)(filesToMerge)).toEqual((0, _index.mergeJsonFilesSync)(filesToMerge));
    });

    it('mergeJsonFilesByKeySync - find s*.yml files and merge them by urlPattern|urlTemplate keys', function () {
        var fileListToMerge = (0, _index.findFilesSync)('src/fixtures/tree/', /^s.+\.yml$/);
        var results = (0, _index.mergeJsonFilesByKeySync)(fileListToMerge, 'uriTemplate', (0, _index.mergeJsonFilesByKeySync)(fileListToMerge, 'urlPattern'));
        (0, _expect2.default)(_.keys(results)).toEqual(['/customers/{id}', '/customers', '/monitoring/isAlive', '/defaults/noHeaders', '/defaults/noTestCases']);
    });

    it('mergeJsonFilesByFileNameSync - find s*.yml files and merge them by the names of the files', function () {
        var fileListToMerge = (0, _index.findFilesSync)('src/fixtures/tree/', /^s.+\.yml$/);
        var results = (0, _index.mergeJsonFilesByFileNameSync)(fileListToMerge, {});
        (0, _expect2.default)(_.keys(results)).toEqual(['src/fixtures/tree/services/customers/customer/service.yml', 'src/fixtures/tree/services/customers/service.yml', 'src/fixtures/tree/services/defaults/noHeaders/service.yml', 'src/fixtures/tree/services/defaults/noTestCases/service.yml', 'src/fixtures/tree/services/monitoring/isAlive/service.yml']);
        _.map(results, function (dataItem, key) {
            (0, _expect2.default)(dataItem).toBeInstanceOf(Object);
            (0, _expect2.default)(dataItem).toEqual((0, _index.loadJsonFileSync)(key));
        });
    });

    it('mergeTextFilesByFileNameSync - find and read files as plain text and merge them by their names', function () {
        var fileListToMerge = (0, _index.findFilesSync)('src/fixtures/templates/', /.*\.html$/);
        var results = (0, _index.mergeTextFilesByFileNameSync)(fileListToMerge, {});
        (0, _expect2.default)(_.keys(results)).toEqual(['src/fixtures/templates/copyright.html', 'src/fixtures/templates/footer.html', 'src/fixtures/templates/header.html', 'src/fixtures/templates/main.html']);
        _.map(results, function (dataItem, key) {
            (0, _expect2.default)(typeof dataItem === 'undefined' ? 'undefined' : _typeof(dataItem)).toBe('string');
            (0, _expect2.default)(dataItem).toEqual((0, _index.loadTextFileSync)(key));
        });
    });

    it('loadJsonWithRefs', function (done) {
        (0, _index.loadJsonWithRefs)('./src/fixtures/refs/root.yml').then(function (results) {
            var expected = ["#/server/protocols", "#/server/endpoints/0", "#/server/endpoints/0/methods/get/headers", "#/server/endpoints/1", "#/server/endpoints/1/some_def", "#/server/endpoints/1/methods/get/headers"];
            var refs = _.map(results.refs, function (v, k, i) {
                return k;
            });
            (0, _expect2.default)(expected).toEqual(refs);
            (0, _expect2.default)(results.resolved.server.protocols).toEqual(['http', 'https']);
            (0, _expect2.default)(results.resolved.server.endpoints[0].methods.get.headers).toEqual(results.resolved.server.endpoints[1].methods.get.headers);
            done();
        });
    });
});